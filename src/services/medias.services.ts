import { uploadImgController } from './../controllers/medias.controllers'
import { Request } from 'express'
import path from 'path'
import sharp from 'sharp'
import { UPLOAD_DIR } from '~/constants/dir'
import { getNameFromFullName, hanldeUploadImg } from '~/utils/file'
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
        const newPath = path.resolve(UPLOAD_DIR, `${newName}.jpg`)
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
}
const mediasService = new MediasService()

export default mediasService
