import { ObjectId } from 'bson'
import { Bookmark } from './../models/schemas/Bookmark.schema'
import databaseService from '~/services/database.services'
import { Like } from '~/models/schemas/Like.schema'

class LikeService {
  async likeBookmarkTweet(user_id: string, tweetId: any) {
    const result = await databaseService.like.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweetId) },
      {
        $setOnInsert: new Like({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweetId)
        })
      },
      { upsert: true, returnDocument: 'after' }
    )
    return result
  }
  async unLikeTweet(user_id: string, tweetId: any) {
    const result = await databaseService.like.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweetId)
    })
    return result
  }
}

const likeService = new LikeService()
export default likeService
