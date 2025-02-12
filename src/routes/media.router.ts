import { Router } from 'express'
import { uploadImgController } from '~/controllers/medias.controllers'
import { wrapRequestHandler } from '~/utils/handlers'
const mediaRouter = Router()

mediaRouter.post('/upload-img', wrapRequestHandler(uploadImgController))

export default mediaRouter
