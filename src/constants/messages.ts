export const USER_MESSAGES = {
  VALIDATION_ERROR: 'Validation error',
  USER_NOT_FOUND: 'User not found',
  NAME_IS_REQUIRED: 'Name is required',
  NAME_MUST_BE_A_STRING: 'Name must be a string',
  NAME_LENGTH_MUST_BE_FROM_1_TO_100: 'Name length must be from 1 to 100',
  EMAIL_ALREADY_EXISTS: 'Email already exists',
  EMAIL_IS_REQUIRED: 'Email is required',
  EMAIL_IS_INVALID: 'Email is invalid',
  EMAIL_OR_PASSWORD_IS_INCORRECT: 'Email or password is incorrect',
  PASSWORD_IS_REQUIRED: 'Password is required',
  PASSWORD_MUST_BE_A_STRING: 'Password must be a string',
  PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Password length must be from 6 to 50',
  PASSWORD_MUST_BE_STRONG:
    'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Confirm password is required',
  CONFIRM_PASSWORD_MUST_BE_A_STRING: 'Confirm password must be a string',
  CONFIRM_PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50: 'Confirm password length must be from 6 to 50',
  CONFIRM_PASSWORD_MUST_BE_STRONG:
    'Confirm password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one symbol',
  CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD: 'Confirm password must be the same as password',
  DATE_OF_BIRTH_MUST_BE_ISO8601: 'Date of birth must be ISO8601(YYYY-MM-DD)',
  LOGIN_SUCCESS: 'Login success',
  REGISTER_SUCCESS: 'Register success',
  LOGOUT_SUCCESS: 'Logout success',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token is required',
  ACCESS_TOKEN_IS_INVALID: 'Access token is invalid',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token is required',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token is invalid',
  REFRESH_TOKEN_MUST_BE_A_STRING: 'Refresh token must be a string',
  USED_REFRESH_TOKEN_OR_NOT_EXIST: 'Used refresh token or not exist',
  REFRESH_TOKEN_NOT_EXIST: 'Refresh token not exist',
  REFRESH_TOKEN_SUCCESS: 'Refresh token success',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token is required',
  EMAIL_VERIFY_TOKEN_MUST_BE_A_STRING: 'Email verify token must be a string',
  EMAIL_VERIFY_TOKEN_NOT_EXIST: 'Email verify token not exist',
  EMAIL_VERIFY_TOKEN_SUCCESS: 'Email verify token success',
  EMAIL_ALREADY_VERIFIED: 'Email already verified',
  RESEND_VERIFY_EMAIL_SUCCESS: 'Resend verify email success',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Check email to reset password',
  FORGOT_PASSWORD_TOKEN_IS_REQUIRED: 'Forgot password token is required',
  FORGOT_PASSWORD_TOKEN_IS_INVALID: 'Forgot password token is invalid',
  VERIFY_FORGOT_PASSWORD_SUCCESS: 'Verify forgot password success',
  RESET_PASSWORD_SUCCESS: 'Reset password success',
  GET_ME_SUCCESS: 'Get me success',
  USER_NOT_VERIFIED: 'User not verified',
  UPDATE_ME_SUCCESS: 'Update me success',
  BIO_MUST_BE_A_STRING: 'Bio must be a string',
  BIO_LENGTH_MUST_BE_FROM_1_TO_200: 'Bio length must be from 1 to 200',
  LOCATION_MUST_BE_A_STRING: 'Location must be a string',
  LOCATION_LENGTH_MUST_BE_FROM_1_TO_200: 'Location length must be from 1 to 200',
  WEBSITE_MUST_BE_A_STRING: 'Website must be a string',
  WEBSITE_LENGTH_MUST_BE_FROM_1_TO_200: 'Website length must be from 1 to 200',
  USERNAME_MUST_BE_A_STRING: 'Username must be a string',
  USERNAME_LENGTH_MUST_BE_FROM_1_TO_50: 'Username length must be from 1 to 50',
  USERNAME_INVALID: 'Username must be 4-15 characters long and contain only letters, numbers, and underscores',
  USERNAME_ALREADY_EXISTS: 'Username already exists',
  AVATAR_MUST_BE_A_STRING: 'Avatar must be a string',
  AVATAR_LENGTH_MUST_BE_FROM_1_TO_400: 'Avatar length must be from 1 to 400',
  COVER_PHOTO_MUST_BE_A_STRING: 'Cover photo must be a string',
  COVER_PHOTO_LENGTH_MUST_BE_FROM_1_TO_400: 'Cover photo length must be from 1 to 400',
  GET_PROFILE_SUCCESS: 'Get profile success',
  FOLLOW_USER_SUCCESS: 'Follow user success',
  INVALID_FOLLOWED_USER_ID: 'Invalid followed user id',
  FOLLOWED_USER_ALREADY_EXISTS: 'Followed user already exists',
  INVALID_USER_ID: 'Invalid user id',
  UNFOLLOW_USER_SUCCESS: 'Unfollow user success',
  FOLLOWED_USER_NOT_FOUND: 'Followed user not found',
  OLD_PASSWORD_IS_INCORRECT: 'Old password is incorrect',
  CHANGE_PASSWORD_SUCCESS: 'Change password success',
  GOOGLE_ACCOUNT_NOT_VERIFIED: 'Google account not verified',
  UPLOAD_SUCCESS: 'Upload success',
  FILE_NOT_FOUND: 'File not found',
  GET_VIDEO_STATUS_SUCCESS: 'Get status success',
  ACCOUNT_IS_BANNED: 'Account is banned'
} as const

export const TWEETS_MESSAGES = {
  INVALID_LIMIT: 'Invalid limit',
  GET_NEW_FEED_SUCCESS: 'Get new feed success',
  GET_TWEET_SUCCESS: 'Get tweet success',
  GET_TWEET_CHILDREN_SUCCESS: 'Get tweet children success',
  TWEET_TYPE_MUST_BE_A_STRING: 'Tweet type must be a string',
  INVALID_TYPE: 'Invalid type',
  INVALID_AUDIENCE: 'Invalid audience',
  PARENT_ID_MUST_BE_A_VALID_TWEET_ID: 'Parent id must be a valid tweet id',
  CONTENT_MUST_BE_EMPTY_STRING: 'Content must be empty string',
  HASHTAGS_MUST_BE_AN_ARRAY_OF_STRINGS: 'Hashtags must be an array of strings',
  MENTIONS_MUST_BE_AN_ARRAY_OF_USER_IDS: 'Mentions must be an array of user ids',
  MEDIAS_MUST_BE_AN_ARRAY_OF_MEDIA_OBJECTS: 'Medias must be an array of media objects',

  TWEET_TYPE_IS_INVALID: 'Tweet type is invalid',
  TWEET_AUDIENCE_IS_INVALID: 'Tweet audience is invalid',
  PARENT_ID_IS_REQUIRED: 'Parent id is required',
  PARENT_ID_MUST_BE_NULL: 'Parent id must be null',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  CONTENT_MUST_BE_A_NON_EMPTY_STRING: 'Content must be a non-empty string',
  CONTENT_MUST_BE_A_EMPTY_STRING: 'Content must be a empty string',
  MEDIA_MUST_BE_AN_ARRAY_OF_STRINGS: 'Media must be an array of strings',
  CREATE_TWEET_SUCCESS: 'Create tweet success',
  TWEET_ID_IS_INVALID: 'Tweets ID is invalid',
  TWEET_NOT_FOUND: 'Tweet not found',
  DELETE_TWEET_SUCCESS: 'Delete tweet success',
  TWEET_IS_NOT_PUBLIC: 'Tweet is not public'
} as const

export const BOOK_MARK_MESSAGE = {
  CREATE_BOOK_MARK_SUCCESS: 'Create bookmark success',
  DELETE_BOOK_MARK_SUCCESS: 'Delete bookmark success'
} as const

export const LIKE_MESSAGE = {
  LIKE_SUCCESS: 'Like success',
  UNLIKE_SUCCESS: 'Unlike success'
} as const
export const SEARCH_MESSAGE = {
  SEARCH_SUCCESS: 'Search success',
  CONTENT_MUST_BE_A_STRING: 'Content must be a string',
  PEOPLE_FOLLOW: 'People follow must be 0 or 1'
} as const
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized'
} as const
