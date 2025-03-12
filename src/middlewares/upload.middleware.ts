import multer from 'multer'
import { Request } from 'express'
import { UPLOAD_VIDEO_TEMP_DIR, UPLOAD_IMG_TEMP_DIR } from '~/constants/dir'
import fs from 'fs'

// Ensure upload directories exist
if (!fs.existsSync(UPLOAD_IMG_TEMP_DIR)) {
  fs.mkdirSync(UPLOAD_IMG_TEMP_DIR, { recursive: true })
}
if (!fs.existsSync(UPLOAD_VIDEO_TEMP_DIR)) {
  fs.mkdirSync(UPLOAD_VIDEO_TEMP_DIR, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, UPLOAD_IMG_TEMP_DIR)
    } else if (file.mimetype.startsWith('video/')) {
      cb(null, UPLOAD_VIDEO_TEMP_DIR)
    }
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, `${uniqueSuffix}-${file.originalname}`)
  }
})

export const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true)
    } else {
      cb(new Error('File must be an image or video'))
    }
  },
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit for videos
  }
})
