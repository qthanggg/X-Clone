import { MongoClient } from 'mongodb'
import { config } from 'dotenv'
config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:$
{process.env.DB_PASSWORD}@twitter.rtpb0.mongodb.net/?retryWrites=true&w=majority&appName=Twitter`
// 1. Default Connection

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true
//   }
// })

// export async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect()
//     // Send a ping to confirm a successful connection
//     await client.db('admin').command({ ping: 1 })
//     console.log('Pinged your deployment. You successfully connected to MongoDB!')
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close()
//   }
// }

// 2. Pool Connection
class DatabaseService {
  private client: MongoClient
  constructor() {
    this.client = new MongoClient(uri)
  }
  async connect() {
    try {
      await this.client.db('admin').command({ ping: 1 })
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } finally {
      await this.client.close()
    }
  }
}

const databaseService = new DatabaseService()
export default databaseService
