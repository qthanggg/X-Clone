import { ObjectId } from 'mongodb'
import { TweetsRequestBody } from '~/models/request/Tweets.request'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'

class TweetsService {
  async createTweets(user_id: string, body: TweetsRequestBody) {
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags: [],
        mentions: body.mentions,
        medias: body.medias,
        parent_id: body.parent_id,
        type: body.type,
        user_id: new ObjectId(user_id)
      })
    )
    const tweet = await databaseService.tweets.findOne({ _id: result.insertedId })
    return tweet
  }
}
export const tweetsService = new TweetsService()
export default tweetsService
