import { Router } from 'express'
import { uploadImgController, uploadVideoController } from '~/controllers/medias.controllers.js'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouter = Router()

mediaRouter.post('/upload-img', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadImgController))
mediaRouter.post('/upload-video', accessTokenValidator, verifyUserValidator, wrapRequestHandler(uploadVideoController))

export default mediaRouter
