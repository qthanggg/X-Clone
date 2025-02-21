import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { BOOK_MARK_MESSAGE } from '~/constants/messages'
import { BookmarkTweetRequestBody } from '~/models/request/Bookmark.request'
import { TokenPayload } from '~/models/request/User.request'
import bookmarkService from '~/services/bookmark.services'
export const bookmarkTweetController = async (
  req: Request<ParamsDictionary, any, BookmarkTweetRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await bookmarkService.BookmarkTweet(user_id, req.body.tweet_id)
  res.json({
    message: BOOK_MARK_MESSAGE.CREATE_BOOK_MARK_SUCCESS,
    result
  })
}
