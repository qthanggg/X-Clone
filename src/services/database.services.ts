import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schemas'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import VideoStatus from '~/models/schemas/VideoStatus.schema'
import Follower from '~/models/schemas/Follower.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import Hashtag from '~/models/schemas/Hashtag.schema'
import { Bookmark } from '~/models/schemas/Bookmark.schema'
import { Like } from '~/models/schemas/Like.schema'
import Conversation from '~/models/schemas/Conversation.shema'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@twitter.rtpb0.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`

//  Pool Connection
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }
  async connect() {
    try {
      await this.db.command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.log(error)
    }
  }
  async indexUser() {
    const isExit = await this.users.indexExists(['email_1_password_1', 'email_1', 'username_1'])
    if (!isExit) {
      this.users.createIndex({ email: 1, password: 1 })
      this.users.createIndex({ email: 1 }, { unique: true })
      this.users.createIndex({ username: 1 }, { unique: true })
    }
  }
  async indexVideoStatus() {
    const isExit = await this.videoStatus.indexExists('name_1')
    if (!isExit) {
      this.videoStatus.createIndex({ name: 1 })
    }
  }
  async indexFollower() {
    const isExit = await this.followers.indexExists(['user_id_1_followed_user_id_1'])
    if (!isExit) {
      this.followers.createIndex({ user_id: 1, followed_user_id: 1 })
    }
  }
  async indexTweets() {
    const exists = await this.tweets.indexExists(['content_text'])
    if (!exists) {
      this.tweets.createIndex({ content: 'text' }, { default_language: 'none' })
    }
  }
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }
  get followers(): Collection<Follower> {
    return this.db.collection(process.env.DB_COLLECTION_FOLLOWERS as string)
  }
  get videoStatus(): Collection<VideoStatus> {
    return this.db.collection(process.env.DB_COLLECTION_VIDEO_STATUS as string)
  }
  get tweets(): Collection<Tweet> {
    return this.db.collection(process.env.DB_COLLECTION_TWEETS as string)
  }
  get hashtags(): Collection<Hashtag> {
    return this.db.collection(process.env.DB_COLLECTION_HASHTAG as string)
  }
  get bookmark(): Collection<Bookmark> {
    return this.db.collection(process.env.DB_COLLECTION_BOOKMARKS as string)
  }
  get like(): Collection<Like> {
    return this.db.collection(process.env.DB_COLLECTION_LIKE as string)
  }
  get conversation(): Collection<Conversation> {
    return this.db.collection(process.env.DB_COLLECTION_CONVERSATION as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
