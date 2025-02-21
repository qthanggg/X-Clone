import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LIKE_MESSAGE } from '~/constants/messages'
import { BookmarkTweetRequestBody } from '~/models/request/Bookmark.request'
import { TokenPayload } from '~/models/request/User.request'
import likeService from '~/services/like.services'
export const likeTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.likeBookmarkTweet(user_id, req.body.tweet_id)
  res.json({
    message: LIKE_MESSAGE.LIKE_SUCCESS,
    result
  })
}
export const unLikeTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await likeService.unLikeTweet(user_id, req.params.tweet_id)
  res.json({
    message: LIKE_MESSAGE.UNLIKE_SUCCESS,
    result
  })
}
