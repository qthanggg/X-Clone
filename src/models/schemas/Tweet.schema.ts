import { ObjectId } from 'bson'
import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '~/models/Other'

interface TweetContructor {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc
  hashtags: ObjectId[] // Không nên nhúng như thế này, vì sẽ gây khó khăn trong việc tìm kiếm những tweet nào có hashtag này, cũng như là gây lặp lại dữ liệu về tên hastag
  mentions: string[]
  medias: Media[]
  guest_views?: number
  user_views?: number
  created_at?: Date
  updated_at?: Date
}
export default class Tweet {
  _id?: ObjectId
  user_id: ObjectId
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | ObjectId //  chỉ null khi tweet gốc
  hashtags: ObjectId[] // Không nên nhúng như thế này, vì sẽ gây khó khăn trong việc tìm kiếm những tweet nào có hashtag này, cũng như là gây lặp lại dữ liệu về tên hastag
  mentions: ObjectId[]
  medias: Media[]
  guest_views: number
  user_views: number
  created_at: Date
  updated_at: Date
  constructor({
    _id,
    audience,
    content,
    hashtags,
    mentions,
    medias,
    parent_id,
    type,
    user_id,
    guest_views,
    user_views,
    created_at,
    updated_at
  }: TweetContructor) {
    const date = new Date()
    this._id = _id
    this.user_id = user_id
    this.type = type
    this.audience = audience
    this.content = content
    this.parent_id = parent_id ? new ObjectId(parent_id) : null
    this.hashtags = hashtags
    this.mentions = mentions.map((mention) => new ObjectId(mention))
    this.medias = medias
    this.guest_views = guest_views || 0
    this.user_views = user_views || 0
    this.created_at = created_at || date
    this.updated_at = updated_at || date
  }
}
