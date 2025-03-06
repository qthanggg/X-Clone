import { Router } from 'express'
import {
  bookmarkTweetByIdController,
  bookmarkTweetController,
  unBookmarkTweetByIdController,
  unBookmarkTweetController
} from '~/controllers/bookmark.controllers'
import { tweetValidator } from '~/middlewares/tweets.middleware'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const bookmarkRouter = Router()

/**
 * Description: Bookmark tweet
 * Path: /
 * Method: POST
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
bookmarkRouter.post(
  '',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(bookmarkTweetController)
)
/**
 * Description: Unbookmark tweet
 * Path: /
 * Method: DELETE
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
bookmarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unBookmarkTweetController)
)
/**
 * Description: Bookmark tweet by id
 * Path: /
 * Method: POST
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
bookmarkRouter.post(
  '',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(bookmarkTweetByIdController)
)
/**
 * Description: Unbookmark tweet by id
 * Path: /
 * Method: DELETE
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
bookmarkRouter.delete(
  '/:id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unBookmarkTweetByIdController)
)

export default bookmarkRouter
