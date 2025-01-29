import { ObjectId } from 'mongodb'

interface FlowerType {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
}
export default class Flower {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId
  created_at?: Date
  constructor({ _id, user_id, created_at, followed_user_id }: FlowerType) {
    this._id = _id
    this.user_id = user_id
    this.created_at = created_at || new Date()
    this.followed_user_id = followed_user_id
  }
}
