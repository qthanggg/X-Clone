import { NextFunction, Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { TweetsRequestBody } from '~/models/request/Tweets.request'
import { TokenPayload } from '~/models/request/User.request'
import tweetsService from '~/services/tweets.services'
export const createTweetController = async (req: Request<ParamsDictionary, any, TweetsRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweets(user_id, req.body)
  res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}
