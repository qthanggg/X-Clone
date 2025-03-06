import { Router } from 'express'
import {
  createTweetController,
  getNewFeedsController,
  getTweetChildrenController,
  getTweetController
} from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
  pagingationValidator,
  tweetValidator
} from '~/middlewares/tweets.middleware'
import { accessTokenValidator, isUserLoginValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const tweetsRouter = Router()

tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)
tweetsRouter.get(
  '/:tweet_id',
  tweetValidator,
  isUserLoginValidator(accessTokenValidator),
  isUserLoginValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetController)
)
tweetsRouter.get(
  '/:tweet_id/children',
  tweetValidator,
  pagingationValidator,
  getTweetChildrenValidator,
  isUserLoginValidator(accessTokenValidator),
  isUserLoginValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)
// Get new feeds
tweetsRouter.get(
  '/',
  pagingationValidator,
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(getNewFeedsController)
)

export default tweetsRouter
