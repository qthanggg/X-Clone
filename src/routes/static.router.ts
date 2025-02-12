import { Router } from 'express'
import { serveImgController, serveVideoController } from '~/controllers/medias.controllers'
const staticRouter = Router()

staticRouter.get('/image/:name', serveImgController)
staticRouter.get('/video/:name', serveVideoController)

export default staticRouter
