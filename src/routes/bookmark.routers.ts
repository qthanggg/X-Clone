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

bookmarkRouter.post(
  '',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(bookmarkTweetController)
)
bookmarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unBookmarkTweetController)
)
bookmarkRouter.post(
  '',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(bookmarkTweetByIdController)
)
bookmarkRouter.delete(
  '/:id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unBookmarkTweetByIdController)
)

export default bookmarkRouter
