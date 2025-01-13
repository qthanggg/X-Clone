import { JwtPayload } from 'jsonwebtoken'
import { TokenType } from '~/constants/enum'

export interface RegisterRequestBody {
  email: string
  password: string
  confirm_password: string
  date_of_birth: string
  name: string
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

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenType
}
