import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import express from 'express'
import cors from 'cors'
import { UPLOAD_VIDEO_DIR } from '~/constants/dir'
import defaultErrorHandler from '~/middlewares/error.middleware'
import mediaRouter from '~/routes/media.router'
import staticRouter from '~/routes/static.router'
import usersRouter from '~/routes/users.router'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import tweetsRouter from '~/routes/tweets.router'
import bookmarkRouter from '~/routes/bookmark.routers'
import likeRouter from '~/routes/like.routers'
import searchRouter from '~/routes/search.routers'
import { createServer } from 'http'
import { Server } from 'socket.io'
import Conversation from '~/models/schemas/Conversation.shema'
import conversationRouter from '~/routes/conversation.routers'
import { verifyAcessToken } from '~/middlewares/common.middleware'
import { TokenPayload } from '~/models/request/User.request'
import { UserVerifyStatus } from '~/constants/enum'
import { ErrorWithStatus } from '~/models/Errors'
import { ERROR_MESSAGES, USER_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import { ne } from '@faker-js/faker'

// import '~/utils/fake'
config()
const app = express()
const httpServer = createServer(app)
app.use(cors())
const PORT = process.env.PORT || 4000
databaseService.connect().then(() => {
  databaseService.indexUser()
  databaseService.indexFollower()
  databaseService.indexVideoStatus()
  databaseService.indexTweets()
})

initFolder()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/like', likeRouter)
app.use('/search', searchRouter)
app.use('/conversation', conversationRouter)
// app.use('/medias', express.static(UPLOAD_IMG_DIR))
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
})
const users: {
  [key: string]: {
    socket_id: string
  }
} = {}
io.use(async (socket, next) => {
  const { Authorization } = socket.handshake.auth
  const access_token = Authorization?.split(' ')[1]
  try {
    const decoded_authorization = await verifyAcessToken(access_token)
    socket.handshake.auth = {
      ...socket.handshake.auth,
      decoded_authorization
    }
    const { verify } = decoded_authorization as TokenPayload
    if (verify !== UserVerifyStatus.Verified) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_VERIFIED,
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    next()
  } catch (error) {
    next({
      message: ERROR_MESSAGES.UNAUTHORIZED,
      name: 'UnauthorizedError',
      data: error
    })
  }
})
io.on('connection', (socket) => {
  console.log(`a ${socket.id} connected`)
  const { user_id } = socket.handshake.auth.decoded_authorization as TokenPayload
  console.log('user_id', user_id)
  users[user_id] = {
    socket_id: socket.id
  }
  console.log('Current users:', users)
  socket.on('conversation', async (data) => {
    console.log('-------- Chat Data --------')
    console.log('Full received data:', data)
    console.log('From user:', data.conversation.sender_id)
    console.log('To user:', data.conversation.receiver_id)
    console.log('Message content:', data.conversation.content)
    console.log('-------------------------')

    const { sender_id, receiver_id, content } = data.conversation
    const recerver_socket_id = users[receiver_id]?.socket_id
    console.log('Receiver socket ID:', recerver_socket_id)
    if (!recerver_socket_id) {
      return
    }

    const conversation = new Conversation({
      sender_id: new ObjectId(sender_id),
      receiver_id: new ObjectId(receiver_id),
      content: content
    })
    // console.log('conversation', conversation)
    const result = await databaseService.conversation.insertOne(conversation)
    console.log('Saved to database:', result)
    conversation._id = result.insertedId
    socket.to(recerver_socket_id).emit('conversationrep', {
      payload: conversation
    })
  })
  socket.on('disconnect', () => {
    delete users[user_id]
    console.log(`a ${socket.id} disconnected`)
  })
})

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
