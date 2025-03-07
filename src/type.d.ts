import { Request } from 'express'
import { TokenPayload } from '~/models/request/User.request'
import Tweet from '~/models/schemas/Tweet.schema'
import User from '~/models/schemas/User.schemas'

declare module 'express' {
  interface Request {
    user?: User
    decoded_refresh_token?: TokenPayload
    decoded_authorization?: TokenPayload
    decoded_email_verify_token?: TokenPayload
    decoded_forgot_password_token?: TokenPayload
    tweet?: Tweet
  }
}
