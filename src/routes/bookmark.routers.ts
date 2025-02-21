import { Router } from 'express'
import {
  bookmarkTweetByIdController,
  bookmarkTweetController,
  unBookmarkTweetByIdController,
  unBookmarkTweetController
} from '~/controllers/bookmark.controllers'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const bookmarkRouter = Router()

bookmarkRouter.post('', accessTokenValidator, verifyUserValidator, wrapRequestHandler(bookmarkTweetController))
bookmarkRouter.delete(
  '/tweets/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unBookmarkTweetController)
)
bookmarkRouter.post('', accessTokenValidator, verifyUserValidator, wrapRequestHandler(bookmarkTweetByIdController))
bookmarkRouter.delete(
  '/:id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unBookmarkTweetByIdController)
)

export default bookmarkRouter
