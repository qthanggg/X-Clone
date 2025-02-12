import e, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_IMG_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import { USER_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'

export const uploadImgController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadImg(req)
  res.json({
    message: USER_MESSAGES.UPLOAD_SUCCESS,
    url
  })
}
export const serveImgController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_IMG_DIR, name + '.jpg'), (err) => {
    if (err) {
      res.status((err as any).status).send({
        message: USER_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}

export const serveVideoController = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.params
  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, name), (err) => {
    if (err) {
      res.status((err as any).status).send({
        message: USER_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}
export const uploadVideoController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideo(req)
  res.json({
    message: USER_MESSAGES.UPLOAD_SUCCESS,
    url
  })
}
