import e, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { UPLOAD_DIR } from '~/constants/dir'
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
  res.sendFile(path.resolve(UPLOAD_DIR, name + '.jpg'), (err) => {
    if (err) {
      res.status((err as any).status).send({
        message: USER_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}
