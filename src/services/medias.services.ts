import { uploadImgController } from '../controllers/medias.controllers.js'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMG_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { getNameFromFullName, hanldeUploadImg, hanldeUploadVideo } from '~/utils/file'
import fs from 'fs'
import fsPromise from 'fs/promises'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { EncodingStatus, MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
import { encodeHLSWithMultipleVideoStreams } from '~/utils/video.js'
import VideoStatus from '~/models/schemas/VideoStatus.schema.js'
import databaseService from '~/services/database.services.js'
config()
class Queu {
  items: string[]
  encodeing: boolean
  constructor() {
    this.items = []
    this.encodeing = false
  }
  async enqueu(item: string) {
    this.items.push(item)
    console.log(item)

    // const idName = getNameFromFullName(item.split('/').pop() as string)
    const idName = path.parse(item).name

    console.log('id', idName)

    const videoStatus = new VideoStatus({
      name: idName,
      status: EncodingStatus.Pending
    })

    // Kiểm tra dữ liệu trước khi insert
    console.log('Inserting video status:', videoStatus)

    await databaseService.videoStatus.insertOne(videoStatus)
    this.processEndcode()
  }
  async processEndcode() {
    if (this.encodeing) return
    if (this.items.length > 0) {
      this.encodeing = true
      const videoPath = this.items[0]
      const idName = path.parse(videoPath).name

      await databaseService.videoStatus.updateOne(
        { name: idName },
        {
          $set: {
            status: EncodingStatus.Processing
          },
          $currentDate: {
            updated_at: true
          }
        }
      )

      try {
        await encodeHLSWithMultipleVideoStreams(videoPath)
        this.items.shift()
        await fsPromise.unlink(videoPath)

        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Success
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode ${videoPath} success`)
      } catch (error) {
        await databaseService.videoStatus.updateOne(
          { name: idName },
          {
            $set: {
              status: EncodingStatus.Failed
            },
            $currentDate: {
              updated_at: true
            }
          }
        )
        console.log(`Encode ${videoPath} fail`, error)
      }

      this.encodeing = false
      this.processEndcode()
    } else {
      console.log('empty')
    }
  }
}
const queue = new Queu()
class MediasService {
  async uploadImg(req: Request) {
    const files = await hanldeUploadImg(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        const newPath = path.resolve(UPLOAD_IMG_DIR, `${newName}.jpg`)
        await sharp(file.filepath).jpeg().toFile(newPath)
        fs.unlinkSync(file.filepath)

        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${newName}.jpg`
            : `http://localhost:4000/static/image/${newName}.jpg`,
          type: MediaType.Image
        }
      })
    )
    return result
  }
  async uploadVideo(req: Request) {
    const files = await hanldeUploadVideo(req)
    const { filepath, newFilename } = files[0]

    // Create video directory if not exists
    const videoDir = path.resolve(UPLOAD_VIDEO_DIR)
    if (!fs.existsSync(videoDir)) {
      fs.mkdirSync(videoDir, { recursive: true })
    }

    // Move file to correct location
    const newPath = path.resolve(UPLOAD_VIDEO_DIR, newFilename)
    fs.renameSync(filepath, newPath)

    return {
      url: isProduction
        ? `${process.env.HOST}/static/video-stream/${newFilename}`
        : `http://localhost:4000/static/video-stream/${newFilename}`,
      type: MediaType.Video
    }
  }
  async uploadVideoHLS(req: Request) {
    const files = await hanldeUploadVideo(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        const newName = getNameFromFullName(file.newFilename)
        queue.enqueu(file.filepath)
        return {
          url: isProduction
            ? `${process.env.HOST}/static/video-hls/${newName}.m3u8`
            : `http://localhost:4000/static/video-hls/${newName}.m3u8`,
          type: MediaType.HLS
        }
      })
    )
    return result
  }
  async getVideoStatus(id: string) {
    console.log('id', id)

    const result = await databaseService.videoStatus.findOne({ name: id })
    console.log('rl', result)

    return result
  }
}
const mediasService = new MediasService()

export default mediasService
