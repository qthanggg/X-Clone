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
io.on('connection', (socket) => {
  console.log(`a ${socket.id} connected`)
  //console.log(socket.handshake.auth)
  const user_id = socket.handshake.auth._id
  users[user_id] = {
    socket_id: socket.id
  }
  console.log(users)
  socket.on('mess', async (data) => {
    console.log('Received message data:', data)
    const recerver_socket_id = users[data.to]?.socket_id // lay ra thong tin nguoi nhan
    if (!recerver_socket_id) {
      return
    }
    await databaseService.conversation.insertOne(
      new Conversation({
        sender_id: data.form,
        receiver_id: data.to,
        content: data.content
      })
    )
    socket.to(recerver_socket_id).emit('messrep', {
      content: data.content,
      from: user_id
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
