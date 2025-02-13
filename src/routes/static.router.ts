import { Router } from 'express'
import { serveImgController, serveVideoStreamController } from '~/controllers/medias.controllers.js'
const staticRouter = Router()

staticRouter.get('/image/:name', serveImgController)
staticRouter.get('/video-stream/:name', serveVideoStreamController)

export default staticRouter
