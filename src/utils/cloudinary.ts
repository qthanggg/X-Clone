import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { config } from 'dotenv'
config()

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
console.log(process.env.CLOUDINARY_NAME, process.env.CLOUDINARY_API_KEY, process.env.CLOUDINARY_API_SECRET)

export const uploadFileToCloudinary = async (filePath: string) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'twitter/media'
  })
  return result
}

export const uploadVideoToCloudinary = async (filePath: string, options = {}) => {
  const result = await cloudinary.uploader.upload(filePath, {
    folder: 'twitter/videos',
    resource_type: 'video',
    ...options
  })
  return result
}

export default cloudinary
