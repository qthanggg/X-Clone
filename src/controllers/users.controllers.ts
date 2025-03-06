import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  ForgotPasswordRequestBody,
  GetUserProfileRequestParams,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  ResendVerifyEmailRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  UpdateMeRequestBody,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody,
  FollowUserRequestBody,
  UnfollowUserRequestBody,
  ChangePasswordRequestBody
} from '~/models/request/User.request'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import emailService from '~/services/email.services'
import { pick } from 'lodash'
import { config } from 'dotenv'
config()
// login
export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login({ user_id: user_id.toString(), verify: user.verify })
  res.json({ message: USER_MESSAGES.LOGIN_SUCCESS, result })
}

// register
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  res.json({ message: USER_MESSAGES.REGISTER_SUCCESS, result })
}
// logout
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  await usersService.logout(refresh_token)
  res.json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}
// refresh token
export const refreshTokenController = async (
  req: Request<ParamsDictionary, any, RefreshTokenRequestBody>,
  res: Response
) => {
  const { refresh_token } = req.body
  const { user_id, verify, exp } = req.decoded_refresh_token as TokenPayload
  const result = await usersService.refreshToken({ user_id, verify, exp, refresh_token })
  res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}
// verify email
export const verifyEmailController = async (
  req: Request<ParamsDictionary, any, VerifyEmailRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_email_verify_token as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  // User not found
  if (!user) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }

  // Verified email, return message "Email already verified"
  if (user.email_verify_token === '') {
    res.json({ message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED })
  }
  const result = await usersService.verifyEmail(user_id)
  res.json({ message: USER_MESSAGES.EMAIL_VERIFY_TOKEN_SUCCESS, result })
}
// resend verify email
export const resendVerifyEmailController = async (
  req: Request<ParamsDictionary, any, ResendVerifyEmailRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const user = await databaseService.users.findOne({ _id: new ObjectId(user_id) })
  if (!user) {
    throw new ErrorWithStatus({
      message: USER_MESSAGES.USER_NOT_FOUND,
      status: HTTP_STATUS.NOT_FOUND
    })
  }
  if (user.verify === UserVerifyStatus.Verified) {
    res.json({ message: USER_MESSAGES.EMAIL_ALREADY_VERIFIED })
  }

  // Gửi lại email verify
  const email_verify_token = await usersService.createEmailVerifyToken({
    user_id: user_id.toString(),
    verify: UserVerifyStatus.Unverified
  })
  await emailService.sendVerificationEmail({
    to: user.email,
    verifyToken: email_verify_token
  })

  res.json({ message: USER_MESSAGES.RESEND_VERIFY_EMAIL_SUCCESS })
}
// forgot password
export const forgotPasswordController = async (
  req: Request<ParamsDictionary, any, ForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { _id } = req.user as User
  const result = await usersService.forgotPassword({
    user_id: (_id as ObjectId).toString(),
    verify: UserVerifyStatus.Verified
  })
  res.json({ message: result })
}
// verify forgot password
export const verifyForgotPasswordController = async (
  req: Request<ParamsDictionary, any, VerifyForgotPasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  res.json({ message: USER_MESSAGES.VERIFY_FORGOT_PASSWORD_SUCCESS })
}
// reset password
export const resetPasswordController = async (
  req: Request<ParamsDictionary, any, ResetPasswordRequestBody>,
  res: Response
) => {
  const { user_id } = req.decoded_forgot_password_token as TokenPayload
  const { password } = req.body
  const result = await usersService.resetPassword(user_id, password)
  res.json({ message: result })
}
// change password
export const changePasswordController = async (
  req: Request<ParamsDictionary, any, ChangePasswordRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { password } = req.body
  const result = await usersService.changePassword(user_id, password)
  res.json({ message: result })
}
// get me
export const getMeController = async (req: Request, res: Response, next: NextFunction) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  console.log('user_id', user_id)
  const user = await usersService.getUserProfile(user_id)
  console.log('user', user)

  res.json({ message: USER_MESSAGES.GET_ME_SUCCESS, result: user })
}
// get user profile by username
export const getUserProfileController = async (
  req: Request<GetUserProfileRequestParams>,
  res: Response,
  next: NextFunction
) => {
  const { username } = req.params
  const user = await usersService.getUserProfile(username)
  res.json({ message: USER_MESSAGES.GET_PROFILE_SUCCESS, result: user })
}
// update me
export const updateMeController = async (
  req: Request<ParamsDictionary, any, UpdateMeRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { body } = req
  console.log(body)
  const result = await usersService.updateMe(user_id, body)
  res.json({ message: USER_MESSAGES.UPDATE_ME_SUCCESS, result })
}
// follow user
export const followUserController = async (
  req: Request<ParamsDictionary, any, FollowUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.body
  const result = await usersService.followUser(user_id, followed_user_id)
  res.json({ message: result })
}
// unfollow user
export const unfollowUserController = async (
  req: Request<ParamsDictionary, any, UnfollowUserRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const { user_id } = req.decoded_authorization as TokenPayload
  const { followed_user_id } = req.params
  const result = await usersService.unfollowUser(user_id, followed_user_id)
  res.json({ message: result })
}
// login with google
export const loginWithGoogleController = async (req: Request, res: Response) => {
  const { code } = req.query
  const result = await usersService.oauth(code as string)
  const urlRedirect = `${process.env.CLIENT_URL}?access_token=${result.access_token}&refresh_token=${result.refresh_token}&new_user=${result.newUser}&verify=${result.verify}`
  res.redirect(urlRedirect)
  res.json({
    message: result.newUser ? USER_MESSAGES.REGISTER_SUCCESS : USER_MESSAGES.LOGIN_SUCCESS,
    result
  })
}
