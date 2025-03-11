import { Query } from 'express-serve-static-core'
import { MediaTypeQuery } from './../../constants/enum'
import { Paganation } from '~/models/request/Tweets.request'

export interface SearchQuery extends Paganation, Query {
  content: string
  MediaType: MediaTypeQuery
  people_follow: string
}
