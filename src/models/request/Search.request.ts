import { Query } from 'express-serve-static-core'
import { MediaTypeQuery, PeopleFollow } from './../../constants/enum'
import { Paganation } from '~/models/request/Tweets.request'

export interface SearchQuery extends Paganation, Query {
  content: string
  media_type?: MediaTypeQuery
  people_follow?: PeopleFollow
}
