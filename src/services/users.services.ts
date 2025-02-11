import { config } from 'dotenv'
import { ObjectId } from 'mongodb'
import { TokenType, UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import { RegisterRequestBody, TokenPayload, UpdateMeRequestBody } from '~/models/request/User.request'
import RefreshToken from '~/models/schemas/RefreshToken.schemas'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import emailService from '~/services/email.services'
import Flower from '~/models/schemas/Follower.schema'
import axios from 'axios'

config()
class UsersService {
  private signAccessToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.AccessToken, verify },
      privateKey: process.env.JWT_SECRET_ACCESS_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_ACCESS_TOKEN }
    })
  }
  private signRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.RefreshToken, verify },
      privateKey: process.env.JWT_SECRET_REFRESH_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_REFRESH_TOKEN }
    })
  }
  private signEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.EmailVerifyToken, verify },
      privateKey: process.env.JWT_SECRET_EMAIL_VERIFY_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_EMAIL_VERIFY_TOKEN as string }
    })
  }
  private signAcessAndRefreshToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return Promise.all([this.signAccessToken({ user_id, verify }), this.signRefreshToken({ user_id, verify })])
  }
  private signForgotPasswordToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return signToken({
      payload: { user_id, token_type: TokenType.ForgotPasswordToken, verify },
      privateKey: process.env.JWT_SECRET_FORGOT_PASSWORD_TOKEN as string,
      options: { expiresIn: process.env.EXPIRES_IN_FORGOT_PASSWORD_TOKEN as string }
    })
  }
  //login gg
  private async getOauthGoogleToken(code: string) {
    const body = {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    }

    const { data } = await axios.post('https://oauth2.googleapis.com/token', body, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return data as {
      access_token: string
      id_token: string
    }
  }
  private async getGoogleUserInfor(access_token: string, id_token: string) {
    const { data } = await axios.get('https://www.googleapis.com/oauth2/v1/userinfo', {
      params: {
        access_token,
        alt: 'json'
      },
      headers: {
        Authorization: `Bearer ${id_token}`
      }
    })
    return data as {
      id: string
      email: string
      verified_email: boolean
      name: string
      given_name: string
      family_name: string
      picture: string
      locale: string
    }
  }
  async oauth(code: string) {
    const { id_token, access_token } = await this.getOauthGoogleToken(code)
    const userinfor = await this.getGoogleUserInfor(access_token, id_token)
    if (!userinfor.verified_email) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.GOOGLE_ACCOUNT_NOT_VERIFIED,
        status: HTTP_STATUS.BAD_REQUEST
      })
    }
    const user = await databaseService.users.findOne({ email: userinfor.email })
    if (user) {
      const [access_token, refresh_token] = await this.signAcessAndRefreshToken({
        user_id: user._id.toString(),
        verify: user.verify
      })
      await databaseService.refreshTokens.insertOne(
        new RefreshToken({ user_id: new ObjectId(user._id), token: refresh_token })
      )
      return { access_token, refresh_token, newUser: 0, verify: user.verify }
    } else {
      const password = Math.random().toString(36).substring(2, 15)
      const data = await this.register({
        email: userinfor.email,
        name: userinfor.name,
        date_of_birth: new Date().toISOString(),
        password: password,
        confirm_password: password
      })
      return { ...data, newUser: 1, verify: UserVerifyStatus.Unverified }
    }
  }
  //login
  async login({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const [access_token, refresh_token] = await this.signAcessAndRefreshToken({
      user_id: user_id.toString(),
      verify
    })
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return { access_token, refresh_token }
  }
  // register user
  async register(payload: RegisterRequestBody) {
    const user_id = new ObjectId()
    const email_verify_token = await this.signEmailVerifyToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })

    // create new user
    await databaseService.users.insertOne(
      new User({
        ...payload,
        _id: user_id,
        username: `user${user_id.toString()}`,
        email_verify_token,
        date_of_birth: new Date(payload.date_of_birth),
        password: hashPassword(payload.password)
      })
    )

    // send verify email
    await emailService.sendVerificationEmail({
      to: payload.email,
      verifyToken: email_verify_token
    })

    const [access_token, refresh_token] = await this.signAcessAndRefreshToken({
      user_id: user_id.toString(),
      verify: UserVerifyStatus.Unverified
    })
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
      this.signAcessAndRefreshToken({ user_id: user_id.toString(), verify: UserVerifyStatus.Verified }),
      databaseService.users.updateOne(
        { _id: new ObjectId(user_id) },
        {
          $set: {
            email_verify_token: '',
            verify: UserVerifyStatus.Verified
          },
          $currentDate: {
            updated_at: true
          }
        }
      )
    ])
    const [access_token, refresh_token] = token
    await databaseService.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token })
    )
    return {
      access_token,
      refresh_token
    }
  }
  // resend verify email
  async resendVerifyEmail(user_id: string) {
    const email_verify_token = await this.signEmailVerifyToken({ user_id, verify: UserVerifyStatus.Unverified })
    console.log('Resend_email_verify_token', email_verify_token)
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { email_verify_token }
      }
    )
    return USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS
  }
  // forgot password
  async forgotPassword({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    const user = await databaseService.users.findOne({ user_id, verify })
    if (!user) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }

    const forgot_password_token = await this.signForgotPasswordToken({ user_id, verify })
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: { forgot_password_token },
        $currentDate: { updated_at: true }
      }
    )

    // send reset password email
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
  public createEmailVerifyToken({ user_id, verify }: { user_id: string; verify: UserVerifyStatus }) {
    return this.signEmailVerifyToken({ user_id, verify })
  }
  // change password
  async changePassword(user_id: string, password: string) {
    await databaseService.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: { password: hashPassword(password) }, $currentDate: { updated_at: true } }
    )
    return USER_MESSAGES.CHANGE_PASSWORD_SUCCESS
  }
  // get me
  async getMe(user_id: string) {
    const user = await databaseService.users.findOne(
      { _id: new ObjectId(user_id) },
      { projection: { password: 0, email_verify_token: 0, forgot_password_token: 0 } }
    )
    return user
  }
  // update me
  async updateMe(user_id: string, payload: UpdateMeRequestBody) {
    const _payload = payload.date_of_birth ? { ...payload, date_of_birth: new Date(payload.date_of_birth) } : payload
    const user = await databaseService.users.findOneAndUpdate(
      { _id: new ObjectId(user_id) },
      {
        $set: { ...(_payload as UpdateMeRequestBody & { date_of_birth?: Date }) },
        $currentDate: { updated_at: true }
      },
      {
        returnDocument: 'after',
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0
        }
      }
    )
    return user
  }
  // get user profile
  async getUserProfile(username: string) {
    const user = await databaseService.users.findOne(
      { username },
      {
        projection: {
          password: 0,
          email_verify_token: 0,
          forgot_password_token: 0,
          verify: 0,
          created_at: 0,
          updated_at: 0
        }
      }
    )
    if (user === null) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    return user
  }
  // follow user
  async followUser(user_id: string, followed_user_id: string) {
    const follower = await databaseService.flowers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (follower === null) {
      await databaseService.flowers.insertOne(
        new Flower({
          user_id: new ObjectId(user_id),
          followed_user_id: new ObjectId(followed_user_id)
        })
      )
      return USER_MESSAGES.FOLLOW_USER_SUCCESS
    }
    return USER_MESSAGES.FOLLOWED_USER_ALREADY_EXISTS
  }
  // unfollow user
  async unfollowUser(user_id: string, followed_user_id: string) {
    const flower = await databaseService.flowers.findOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    if (flower === null) {
      throw new ErrorWithStatus({
        message: USER_MESSAGES.FOLLOWED_USER_NOT_FOUND,
        status: HTTP_STATUS.NOT_FOUND
      })
    }
    await databaseService.flowers.deleteOne({
      user_id: new ObjectId(user_id),
      followed_user_id: new ObjectId(followed_user_id)
    })
    return USER_MESSAGES.UNFOLLOW_USER_SUCCESS
  }
}

const usersService = new UsersService()
export default usersService
