import { Router } from 'express'
import { bookmarkTweetController } from '~/controllers/bookmark.controllers'

import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const bookmarkRouter = Router()

bookmarkRouter.post('', accessTokenValidator, verifyUserValidator, wrapRequestHandler(bookmarkTweetController))

export default bookmarkRouter
