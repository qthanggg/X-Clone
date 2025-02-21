import { bookmarkTweetByIdController } from './../controllers/bookmark.controllers'
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
  async unBookmarkTweet(user_id: string, tweetId: any) {
    const result = await databaseService.bookmark.findOneAndDelete({
      user_id: new ObjectId(user_id),
      tweet_id: new ObjectId(tweetId)
    })
    return result
  }
  // bookmarkTweetByIdController
  async bookmarkTweetByIdController(user_id: string, id: any) {
    const result = await databaseService.bookmark.findOneAndUpdate(
      { user_id: new ObjectId(user_id), _id: new ObjectId(id) },
      {
        $setOnInsert: new Bookmark({
          user_id: new ObjectId(user_id),
          tweet_id: new ObjectId(id)
        })
      },
      { upsert: true, returnDocument: 'after' }
    )
    return result
  }
  async unBookmarkTweetById(user_id: string, _id: any) {
    const result = await databaseService.bookmark.findOneAndDelete({
      user_id: new ObjectId(user_id),
      _id: new ObjectId(_id)
    })
    return result
  }
}

const bookmarkService = new BookmarkService()
export default bookmarkService
