import { Router } from 'express'
import { serveImgController } from '~/controllers/medias.controllers'
const staticRouter = Router()

staticRouter.get('/image/:name', serveImgController)

export default staticRouter
