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
import conversationRouter from '~/routes/conversation.routers'
import initSocket from '~/utils/socket'
import YAML from 'yamljs'
import path from 'path'
import swaggerUi from 'swagger-ui-express'
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

// Load Swagger document
const swaggerDocument = YAML.load(path.resolve('main.yaml'))

// Setup Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(defaultErrorHandler)
initSocket(httpServer)

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
