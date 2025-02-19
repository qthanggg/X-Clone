import { NextFunction, Request, RequestHandler, Response } from 'express'
import path from 'path'
import { UPLOAD_IMG_DIR, UPLOAD_VIDEO_DIR } from '~/constants/dir'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import mediasService from '~/services/medias.services'
import fs from 'fs'
//import mime from 'mime'
import mimeTypes from 'mime-types'

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
export const serveM3U8Controller = (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  return res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, 'master.m3u8'), (err) => {
    if (err) {
      res.status((err as any).status).send({
        message: USER_MESSAGES.FILE_NOT_FOUND
      })
    }
  })
}
export const serveSegmentController = (req: Request, res: Response, next: NextFunction) => {
  const { id, v, segment } = req.params

  res.sendFile(path.resolve(UPLOAD_VIDEO_DIR, id, v, segment), (err) => {
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
export const uploadVideoHLSController = async (req: Request, res: Response, next: NextFunction) => {
  const url = await mediasService.uploadVideoHLS(req)
  res.json({
    message: USER_MESSAGES.UPLOAD_SUCCESS,
    url
  })
}
export const videoStatusController = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params
  const result = await mediasService.getVideoStatus(id as string)
  res.json({
    message: USER_MESSAGES.GET_VIDEO_STATUS_SUCCESS,
    result: result
  })
}
export const serveVideoStreamController = async (req: Request, res: Response) => {
  const { name } = req.params
  const range = req.headers.range

  if (!range) {
    res.status(HTTP_STATUS.BAD_REQUEST).send('Requires Range header')
  }

  const videoPath = path.resolve(UPLOAD_VIDEO_DIR, name)
  // 1MB = 10^6 bytes (Tính theo hệ 10, đây là thứ mà chúng ta hay thấy trên UI)
  // Còn nếu tính theo hệ nhị phân thì 1MB = 2^20 bytes (1024 * 1024)

  // Dung lượng video (bytes)
  const videoSize = fs.statSync(videoPath).size
  // DUng lượng video cho mỗi phân đoạn stream
  const chunkSize = 5 * 10 ** 6 // 5MB
  // Lấy giá trị byte bắt đầu từ header Range (vd: bytes=1048576-)
  const start = Number(range!.replace(/\D/g, ''))
  // Lấy giá trị byte kết thúc, vượt quá dung lượng video thì lấy giá trị videoSize - 1
  const end = Math.min(start + chunkSize, videoSize - 1)

  // Dung lượng thực tế cho mỗi đoạn video stream
  // THường đây sẽ là chunkSize, ngoại trừ đoạn cuối cùng
  const contentLength = end - start + 1
  const contentType = mimeTypes.lookup(videoPath) || 'video/*'

  /**
   * Format của header Content-Range: bytes <start>-<end>/<videoSize>
   * Ví dụ: Content-Range: bytes 1048576-3145727/3145728
   * Yêu cầu là `end` phải luôn luôn nhỏ hơn `videoSize`
   * ❌ 'Content-Range': 'bytes 0-100/100'
   * ✅ 'Content-Range': 'bytes 0-99/100'
   *
   * Còn Content-Length sẽ là end - start + 1. Đại diện cho khoản cách.
   * Để dễ hình dung, mọi người tưởng tượng từ số 0 đến số 10 thì ta có 11 số.
   * byte cũng tương tự, nếu start = 0, end = 10 thì ta có 11 byte.
   * Công thức là end - start + 1
   *
   * ChunkSize = 50
   * videoSize = 100
   * |0----------------50|51----------------99|100 (end)
   * stream 1: start = 0, end = 50, contentLength = 51
   * stream 2: start = 51, end = 99, contentLength = 49
   */
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType,
    'Cache-Control': 'no-cache'
  }

  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStream = fs.createReadStream(videoPath, { start, end })
  videoStream.pipe(res)
}
