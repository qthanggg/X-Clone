import { Router } from 'express'
import { createTweetController, getTweetChildrenController, getTweetController } from '~/controllers/tweets.controllers'
import {
  audienceValidator,
  createTweetValidator,
  getTweetChildrenValidator,
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
  getTweetChildrenValidator,
  isUserLoginValidator(accessTokenValidator),
  isUserLoginValidator(verifyUserValidator),
  audienceValidator,
  wrapRequestHandler(getTweetChildrenController)
)

export default tweetsRouter
