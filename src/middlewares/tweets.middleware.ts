import { ObjectId } from 'mongodb'
import { checkSchema } from 'express-validator'
import { MediaType, TweetAudience, TweetType } from '~/constants/enum'
import { TWEETS_MESSAGES } from '~/constants/messages'
import { numberEnumToArray } from '~/utils/common'
import { validate } from '~/utils/validation'
import { isEmpty } from 'lodash'
const tweetsType = numberEnumToArray(TweetType)
const tweetsAudience = numberEnumToArray(TweetAudience)
const tweetsMediaType = numberEnumToArray(MediaType)
export const createTweetValidator = validate(
  checkSchema({
    type: {
      isIn: {
        options: [tweetsType],
        errorMessage: TWEETS_MESSAGES.TWEET_TYPE_IS_INVALID
      }
    },
    audience: {
      isIn: {
        options: [tweetsAudience],
        errorMessage: TWEETS_MESSAGES.TWEET_AUDIENCE_IS_INVALID
      }
    },
    parent_id: {
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          if ([TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].includes(type) && ObjectId.isValid(value)) {
            if (!value) throw new Error(TWEETS_MESSAGES.PARENT_ID_IS_REQUIRED)
          }
          if (type === TweetType.Tweet && value !== null) {
            throw new Error(TWEETS_MESSAGES.PARENT_ID_MUST_BE_NULL)
          }
          return true
        }
      }
    },
    content: {
      isString: true,
      custom: {
        options: (value, { req }) => {
          const type = req.body.type as TweetType
          const hashtags = req.body.hashtags as string[]
          const menttion = req.body.menttions as string[]
          if (
            [TweetType.Comment, TweetType.Retweet, TweetType.QuoteTweet].includes(type) &&
            isEmpty(hashtags) &&
            isEmpty(menttion) &&
            value === ''
          ) {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_NON_EMPTY_STRING)
          }
          if (type === TweetType.Retweet && value !== '') {
            throw new Error(TWEETS_MESSAGES.CONTENT_MUST_BE_A_EMPTY_STRING)
          }
          return true
        }
      }
    },
    hashtags: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (value.some((item: any) => typeof item !== 'string')) {
            throw new Error(TWEETS_MESSAGES.HASHTAGS_MUST_BE_AN_ARRAY_OF_STRINGS)
          }
          return true
        }
      }
    },
    mentions: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (value.some((item: any) => !ObjectId.isValid(item))) {
            throw new Error(TWEETS_MESSAGES.MENTIONS_MUST_BE_AN_ARRAY_OF_USER_IDS)
          }
          return true
        }
      }
    },
    medias: {
      isArray: true,
      custom: {
        options: (value, { req }) => {
          if (
            value.some((item: any) => {
              return typeof item.url !== 'string' || !tweetsMediaType.includes(item.type)
            })
          ) {
            throw new Error(TWEETS_MESSAGES.MEDIA_MUST_BE_AN_ARRAY_OF_STRINGS)
          }
          return true
        }
      }
    }
  })
)
