import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface RegisterRequestBody {
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
  name: string
}
export interface UpdateMeRequestBody {
  name?: string
  date_of_birth?: string // ISO string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}
export interface FollowUserRequestBody {
  followed_user_id: string
}
export interface LoginRequestBody {
  email: string
  password: string
}
export interface LogoutRequestBody {
  refresh_token: string
}

export interface ResendVerifyEmailRequestBody {
  email_verify_token: string
}

export interface RefreshTokenRequestBody {
  refresh_token: string
}
export interface VerifyEmailRequestBody {
  email_verify_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
export interface ForgotPasswordRequestBody {
  email: string
}
export interface VerifyForgotPasswordRequestBody {
  forgot_password_token: string
}
export interface ResetPasswordRequestBody {
  password: string
  confirm_password: string
  forgot_password_token: string
}
export interface GetUserProfileRequestParams {
  username: string
}
