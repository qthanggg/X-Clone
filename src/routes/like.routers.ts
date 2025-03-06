import { Router } from 'express'
import { likeTweetController, unLikeTweetController } from '~/controllers/like.controllers'
import { tweetValidator } from '~/middlewares/tweets.middleware'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const likeRouter = Router()
/**
 * Description: Like tweet
 * Path: /
 * Method: POST
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
likeRouter.post('', accessTokenValidator, verifyUserValidator, tweetValidator, wrapRequestHandler(likeTweetController))
/**
 * Description: Unlike tweet by id
 * Path: /tweet/:tweet_id
 * Method: DELETE
 * Body: { Authozation: Bearer <access_token> }
 * Body: Tweet schema
 */
likeRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  tweetValidator,
  wrapRequestHandler(unLikeTweetController)
)
export default likeRouter
