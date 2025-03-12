import { Router } from 'express'
import {
  uploadImgController,
  uploadVideoController,
  uploadVideoHLSController,
  videoStatusController
} from '~/controllers/medias.controllers.js'
import { upload } from '~/middlewares/upload.middleware'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouter = Router()
/**
 * Description: Upload image
 * Path: /upload-img
 * Method: POST
 * Body: { Authozation: Bearer <access_token> }
 * Body: Image schema
 */
mediaRouter.post(
  '/upload-img',
  accessTokenValidator,
  verifyUserValidator,
  upload.single('image'),
  wrapRequestHandler(uploadImgController)
)
/**
 * Description: Upload video
 * Path: /upload-video
 * Method: POST
 * Body: { Authozation: Bearer <access_token> }
 * Body: Video schema
 */
mediaRouter.post(
  '/upload-video',
  accessTokenValidator,
  verifyUserValidator,
  upload.array('video', 1),
  wrapRequestHandler(uploadVideoController)
)
mediaRouter.post(
  '/upload-video-hls',
  accessTokenValidator,
  verifyUserValidator,
  upload.array('video', 1),
  wrapRequestHandler(uploadVideoHLSController)
)
/**
 * Description: Get video status
 * Path: /video-status/:id
 * Method: GET
 * Body: { Authozation: Bearer <access_token> }
 *
 */
mediaRouter.get(
  '/video-status/:id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(videoStatusController)
)
export default mediaRouter
