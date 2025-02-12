import { uploadImgController } from './../controllers/medias.controllers'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_IMG_DIR } from '~/constants/dir'
import { getNameFromFullName, hanldeUploadImg, hanldeUploadVideo } from '~/utils/file'
import fs from 'fs'
import { isProduction } from '~/constants/config'
import { config } from 'dotenv'
import { MediaType } from '~/constants/enum'
import { Media } from '~/models/Other'
config()
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
    const { newFilename } = files[0]
    return {
      url: isProduction
        ? `${process.env.HOST}/static/video/${newFilename}`
        : `http://localhost:4000/static/video/${newFilename}`,
      type: MediaType.Video
    }
  }
}

const mediasService = new MediasService()

export default mediasService
