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

config()
const app = express()
app.use(cors())
const PORT = process.env.PORT || 4000
databaseService.connect().then(() => {
  databaseService.indexUser()
  databaseService.indexFollower()
  databaseService.indexVideoStatus()
})

initFolder()

app.use(express.json())

app.use('/users', usersRouter)
app.use('/medias', mediaRouter)
app.use('/tweets', tweetsRouter)
app.use('/bookmarks', bookmarkRouter)
app.use('/like', likeRouter)
// app.use('/medias', express.static(UPLOAD_IMG_DIR))
app.use('/static', staticRouter)
app.use('/static/video', express.static(UPLOAD_VIDEO_DIR))
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
