import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { RegisterRequestBody, TokenPayload } from '~/models/request/User.request'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import emailService from '~/services/email.services'
config()
class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN }
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN }
    })
  }
  private signAcessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  private signEmailVerifyToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_EMAIL_VERIFY_TOKEN as string }
    })
  }
  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string }
    })
  }
  //login
  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAcessAndRefreshToken(user_id)
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }
  // register user
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken(user_id.toString())

    // Tạo user mới
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // Gửi email xác thực
    await emailService.sendVerificationEmail({
      to: payload.email,
      verifyToken: email_verify_token
    })

    const [access_token, refresh_token] = await this.signAcessAndRefreshToken(user_id.toString())
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )

    return { access_token, refresh_token }
  }
  // check email exist
  async checkEmailExist(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
  // logout
  async logout(refresh_token: string) {
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    return { message: USER_MESSAGES.LOGOUT_SUCCESS }
  }
  // refresh token
  async refreshToken({ refresh_token, decoded_refresh_token }: { refresh_token: string; decoded_refresh_token: any }) {
    const { user_id } = decoded_refresh_token
    const [new_access_token, new_refresh_token] = await this.signAcessAndRefreshToken(user_id)
    await databaseService.refreshTokens.deleteOne({ token: refresh_token })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token })
    )
    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token
    }
  }
  // verify email
  async verifyEmail(user_id: string) {
    const [token] = await Promise.all([
      this.signAcessAndRefreshToken(user_id),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: { email_verify_token: '', verify: UserVerifyStatus.Verified, updated_at: '$$NOW' }
        }
      )
    ])
    const [access_token, refresh_token] = token
    return {
      access_token,
      refresh_token
    }
  }
  // resend verify email
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken(user_id)
    console.log('email_verify_token', email_verify_token)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token }
      }
    )
    return USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  }
  // forgot password
  async forgotPassword(user_id: string) {
    const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const forgot_password_token = await this.signForgotPasswordToken(user_id)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token },
        $currentDate: { updated_at: true }
      }
    )

    // Gửi email reset password
    await emailService.sendForgotPasswordEmail({
      to: user.email,
      resetToken: forgot_password_token
    })

    return USER_MESSAGES.CHECK_EMAIL_TO_RESET_PASSWORD
  }
  // reset password
  async resetPassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          forgot_password_token: '',
          password: hashPassword(password)
        },
        $currentDate: {
          updated_at: true
        }
      }
    )
    return USER_MESSAGES.RESET_PASSWORD_SUCCESS
  }
  public createEmailVerifyToken(user_id: string) {
    return this.signEmailVerifyToken(user_id)
  }
}

const usersService = new UsersService()
export default usersService
