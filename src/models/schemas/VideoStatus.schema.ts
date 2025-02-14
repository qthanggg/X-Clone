import { ObjectId } from 'mongodb'
import { EncodingStatus } from '~/constants/enum'

interface VideoStatusType {
  _id?: ObjectId
  name: string
  status: EncodingStatus
  message?: string
  createdAt?: Date
  updatedAt?: Date
}

export default class VideoStatus {
  _id?: ObjectId
  name: string
  status: EncodingStatus
  message: string
  create_at: Date
  update_at: Date
  constructor({ _id, name, status, message, createdAt, updatedAt }: VideoStatusType) {
    const now = new Date()
    this._id = _id
    this.name = name
    this.status = status
    this.message = message || ''
    this.create_at = createdAt || now
    this.update_at = updatedAt || now
  }
}
