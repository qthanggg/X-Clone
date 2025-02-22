import { ObjectId, ReturnDocument, WithId } from 'mongodb'
import { TweetsRequestBody } from '~/models/request/Tweets.request'
import Hashtag from '~/models/schemas/Hashtag.schema'
import Tweet from '~/models/schemas/Tweet.schema'
import databaseService from '~/services/database.services'

class TweetsService {
  async checkAndCreateHashtag(hashtags: string[]) {
    const hashtagDocument = await Promise.all(
      hashtags.map((hashtag) => {
        return databaseService.hashtags.findOneAndUpdate(
          { name: hashtag },
          { $setOnInsert: new Hashtag({ name: hashtag }) },
          { upsert: true, returnDocument: 'after' }
        )
      })
    )
    return hashtagDocument.map((hashtag) => (hashtag as WithId<Hashtag>)._id)
  }
  async createTweets(user_id: string, body: TweetsRequestBody) {
    const hashtags = await this.checkAndCreateHashtag(body.hashtags)
    const result = await databaseService.tweets.insertOne(
      new Tweet({
        audience: body.audience,
        content: body.content,
        hashtags,
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
  // async increaseViews(tweet_id: string, user_id: string) {
  //   const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
  //   const tweet = await databaseService.tweets.findOneAndUpdate(
  //     { _id: new ObjectId(tweet_id) },
  //     { $inc: inc, $currentDate: { updated_at: true } },
  //     {
  //       returnDocument: 'after',
  //       projection: {
  //         guest_view: 1,
  //         user_views: 1
  //       }
  //     }
  //   )
  //   return tweet as WithId<{
  //     guest_views: number
  //     user_views: number
  //   }>
  // }
  async increaseView(tweet_id: string, user_id?: string) {
    const inc = user_id ? { user_views: 1 } : { guest_views: 1 }
    const result = await databaseService.tweets.findOneAndUpdate(
      { _id: new ObjectId(tweet_id) },
      {
        $inc: inc,
        $currentDate: {
          updated_at: true
        }
      },
      {
        returnDocument: 'after',
        projection: {
          guest_views: 1,
          user_views: 1,
          updated_at: 1
        }
      }
    )
    return result
  }
}
export const tweetsService = new TweetsService()
export default tweetsService
