import { Collection, Db, MongoClient } from 'mongodb'
import User from '~/models/schemas/User.schemas'
import { config } from 'dotenv'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import Flower from '~/models/schemas/Follower.schema'
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
  get users(): Collection<User> {
    return this.db.collection(process.env.DB_COLLECTION_USERS as string)
  }
  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(process.env.DB_COLLECTION_REFRESH_TOKENS as string)
  }
  get flowers(): Collection<Flower> {
    return this.db.collection(process.env.DB_COLLECTION_FLOWERS as string)
  }
}

const databaseService = new DatabaseService()
export default databaseService
