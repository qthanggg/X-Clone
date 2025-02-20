import { Router } from 'express'
import { createTweetController } from '~/controllers/tweets.controllers'
import { loginController } from '~/controllers/users.controllers'
import { createTweetValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, loginValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const tweetsRouter = Router()

tweetsRouter.post(
  '/',
  accessTokenValidator,
  verifyUserValidator,
  createTweetValidator,
  wrapRequestHandler(createTweetController)
)

export default tweetsRouter
