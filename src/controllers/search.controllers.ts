import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { result } from 'lodash'
import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { SearchQuery } from '~/models/request/Search.request'
import searchService from '~/services/search.services'

export const searchController = async (req: Request<ParamsDictionary, any, SearchQuery>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const result = await searchService.search({
    limit,
    page,
    content: req.query.content as string,
    media_type: req.query.media_type as MediaTypeQuery,
    people_follow: req.query.people_follow as PeopleFollow,
    user_id: req.decoded_authorization?.user_id as string
  })

  res.json({
    message: SEARCH_MESSAGE.SEARCH_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
