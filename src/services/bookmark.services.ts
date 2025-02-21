import { ObjectId } from 'bson'
import { Bookmark } from './../models/schemas/Bookmark.schema'
import databaseService from '~/services/database.services'

class BookmarkService {
  async BookmarkTweet(user_id: string, tweetId: any) {
    const result = await databaseService.bookmark.findOneAndUpdate(
      { user_id: new ObjectId(user_id), tweet_id: new ObjectId(tweetId) },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(tweetId)
        })
      },
      { upsert: true, returnDocument: 'after' }
    )
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
