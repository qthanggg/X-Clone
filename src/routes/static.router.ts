import { Router } from 'express'
import {
  serveVideoStreamController,
  serveImgController,
  serveM3U8Controller,
  serveSegmentController
} from '~/controllers/medias.controllers'
const staticRouter = Router()
staticRouter.get('/image/:name', serveImgController)
staticRouter.get('/video-stream/:name', serveVideoStreamController)
staticRouter.get('/video-hls/:id/master.m3u8', serveM3U8Controller)
staticRouter.get('/video-hls/:id/:v/:segment', serveSegmentController)

export default staticRouter
