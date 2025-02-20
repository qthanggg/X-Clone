import { TweetAudience, TweetType } from '~/constants/enum'
import { Media } from '~/models/Other'

export interface TweetsRequestBody {
  type: TweetType
  audience: TweetAudience
  content: string
  parent_id: null | string //  chỉ null khi tweet gốc
  hashtags: string[]
  mentions: string[]
  medias: Media[]
}
