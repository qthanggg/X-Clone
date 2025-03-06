import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { update } from 'lodash'
import { TweetType } from '~/constants/enum'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { Paganation, TweetParam, TweetQuery, TweetsRequestBody } from '~/models/request/Tweets.request'
import { TokenPayload } from '~/models/request/User.request'
import databaseService from '~/services/database.services'
import tweetsService from '~/services/tweets.services'
export const createTweetController = async (req: Request<ParamsDictionary, any, TweetsRequestBody>, res: Response) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const result = await tweetsService.createTweets(user_id, req.body)
  res.json({
    message: TWEETS_MESSAGES.CREATE_TWEET_SUCCESS,
    result
  })
}
export const getTweetController = async (req: Request<ParamsDictionary, any, TweetsRequestBody>, res: Response) => {
  const result = await tweetsService.increaseView(req.params.tweet_id, req.decoded_authorization?.user_id)
  const tweet = {
    ...req.tweet,
    guest_views: result?.guest_views,
    user_views: result?.user_views,
    update_at: result?.updated_at
  }

  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_SUCCESS,
    result: tweet
  })
}
export const getTweetChildrenController = async (req: Request<TweetParam, any, any, TweetQuery>, res: Response) => {
  const tweet_type = Number(req.query.tweet_type) as TweetType
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id
  const { tweets, total } = await tweetsService.getTweetChildren({
    tweet_id: req.params.tweet_id,
    tweet_type,
    limit,
    page,
    user_id
  })
  res.json({
    message: TWEETS_MESSAGES.GET_TWEET_CHILDREN_SUCCESS,
    result: {
      tweets,
      tweet_type,
      limit,
      page,
      total_item: total,
      total_page: Math.ceil(total / limit)
    }
  })
}
export const getNewFeedsController = async (req: Request<ParamsDictionary, any, any, Paganation>, res: Response) => {
  const limit = Number(req.query.limit)
  const page = Number(req.query.page)
  const user_id = req.decoded_authorization?.user_id as string
  const result = await tweetsService.getNewFeed({
    user_id,
    limit,
    page
  })
  res.json({
    message: TWEETS_MESSAGES.GET_NEW_FEED_SUCCESS,
    result: {
      tweets: result.tweets,
      limit,
      page,
      total_item: result.total,
      total_page: Math.ceil(result.total / limit)
    }
  })
}
