import { Router } from 'express'
import { getConversationController } from '~/controllers/conversation.controllers'
import { pagingationValidator } from '~/middlewares/tweets.middleware'
import { accessTokenValidator, getConversationValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const conversationRouter = Router()

conversationRouter.get(
  '/receiver/:receiver_id',
  accessTokenValidator,
  verifyUserValidator,
  pagingationValidator,
  getConversationValidator,
  wrapRequestHandler(getConversationController)
)
export default conversationRouter
