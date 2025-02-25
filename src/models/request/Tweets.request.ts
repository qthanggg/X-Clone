import { ParamsDictionary, Query } from 'express-serve-static-core'
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
export interface TweetParam extends ParamsDictionary {
  tweet_id: string
}
export interface TweetQuery extends Query {
  limit: string
  page: string
  tweet_type: string
}
