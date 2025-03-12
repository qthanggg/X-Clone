import { uploadImgController } from '../controllers/medias.controllers.js'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMG_DIR, UPLOAD_VIDEO_DIR, UPLOAD_IMG_TEMP_DIR } from '~/constants/dir'
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
import cloudinary from '~/utils/cloudinary.js'
import { uploadFileToCloudinary, uploadVideoToCloudinary } from '~/utils/cloudinary'
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
    const file = req.file as Express.Multer.File
    const newName = file.filename.split('.')[0] + '.jpg'
    const newPath = path.resolve(UPLOAD_IMG_TEMP_DIR, newName)

    // Convert and optimize image
    await sharp(file.path).jpeg().toFile(newPath)

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(newPath, {
      folder: 'twitter/images',
      resource_type: 'image'
    })

    // Clean up temp files
    fs.unlinkSync(file.path)
    fs.unlinkSync(newPath)

    return result.secure_url
  }
  async uploadVideo(req: Request) {
    const files = req.files as Express.Multer.File[]
    const result: Media[] = []

    for (const file of files) {
      // Upload to Cloudinary
      const response = await uploadVideoToCloudinary(file.path)

      // Add to result array
      result.push({
        url: response.secure_url,
        type: MediaType.Video
      })

      // Cleanup temp file
      fs.unlinkSync(file.path)
    }

    return result
  }
  async uploadVideoHLS(req: Request) {
    const files = req.files as Express.Multer.File[]
    const result: Media[] = []

    for (const file of files) {
      // Upload to Cloudinary with streaming profile
      const response = await uploadVideoToCloudinary(file.path, {
        resource_type: 'video',
        eager: [{ streaming_profile: 'hls_1080p', format: 'm3u8' }],
        eager_async: true
      })

      // Add HLS URL to result
      result.push({
        url: response.eager[0].secure_url, // HLS stream URL
        type: MediaType.HLS
      })

      // Cleanup temp file
      fs.unlinkSync(file.path)
    }

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
