import { Router } from 'express'
import { likeTweetController, unLikeTweetController } from '~/controllers/like.controllers'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const likeRouter = Router()

likeRouter.post('', accessTokenValidator, verifyUserValidator, wrapRequestHandler(likeTweetController))
likeRouter.delete(
  '/tweet/:tweet_id',
  accessTokenValidator,
  verifyUserValidator,
  wrapRequestHandler(unLikeTweetController)
)

export default likeRouter
