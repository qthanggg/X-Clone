import { Router } from 'express'
import { getConversationController } from '~/controllers/conversation.controllers'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
const conversationRouter = Router()

conversationRouter.get('/receiver/:receiverId', accessTokenValidator, verifyUserValidator, getConversationController)
export default conversationRouter
