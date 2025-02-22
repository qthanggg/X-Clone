import { Router } from 'express'
import { likeTweetController, unLikeTweetController } from '~/controllers/like.controllers'
import { tweetValidator } from '~/middlewares/tweets.middleware'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const likeRouter = Router()

likeRouter.post('', accessTokenValidator, verifyUserValidator, tweetValidator, wrapRequestHandler(likeTweetController))
likeRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unLikeTweetController)
)

export default likeRouter
