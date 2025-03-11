import { MediaTypeQuery, PeopleFollow } from '~/constants/enum'
import { checkSchema } from 'express-validator'
import { SEARCH_MESSAGE } from '~/constants/messages'
import { validate } from '~/utils/validation'

export const searchValidator = validate(
  checkSchema(
    {
      content: {
        isString: {
          errorMessage: SEARCH_MESSAGE.CONTENT_MUST_BE_A_STRING
        }
      },
      media_type: {
        optional: true,
        isIn: {
          options: [Object.values(MediaTypeQuery)]
        },
        errorMessage: `MediaTypeQuery must be one of ${Object.values(MediaTypeQuery).join(', ')}`
      },
      people_follow: {
        optional: true,
        isIn: {
          options: [Object.values(PeopleFollow)],
          errorMessage: SEARCH_MESSAGE.PEOPLE_FOLLOW
        }
      }
    },

    ['query']
  )
)
