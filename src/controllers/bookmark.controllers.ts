import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOK_MARK_MESSAGE } from '~/constants/messages'
import { BookmarkByIdTweetRequestBody, LikeBookmarkTweetRequestBody } from '~/models/request/Bookmark.request'
import { TokenPayload } from '~/models/request/User.request'
import bookmarkService from '~/services/bookmark.services'
export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, LikeBookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.BookmarkTweet(user_id, req.body.tweet_id)
  res.json({
    message: BOOK_MARK_MESSAGE.CREATE_BOOK_MARK_SUCCESS,
    result
  })
}
export const unBookmarkTweetController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unBookmarkTweet(user_id, req.params.tweet_id)
  res.json({
    message: BOOK_MARK_MESSAGE.DELETE_BOOK_MARK_SUCCESS,
    result
  })
}
export const bookmarkTweetByIdController = async (
  req: Request<ParamsDictionary, any, BookmarkByIdTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.bookmarkTweetByIdController(user_id, req.body._id)
  res.json({
    message: BOOK_MARK_MESSAGE.CREATE_BOOK_MARK_SUCCESS,
    result
  })
}
export const unBookmarkTweetByIdController = async (req: Request, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.unBookmarkTweetById(user_id, req.params.id)
  console.log('bookmark_id:', req.params.id)
  console.log('user_id:', user_id)

  res.json({
    message: BOOK_MARK_MESSAGE.DELETE_BOOK_MARK_SUCCESS,
    result
  })
}
