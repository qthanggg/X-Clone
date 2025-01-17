import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/constants/enum'
import HTTP_STATUS from '~/constants/httpStatus'
import { USER_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import {
  ForgotPasswordRequestBody,
  LoginRequestBody,
  LogoutRequestBody,
  RefreshTokenRequestBody,
  RegisterRequestBody,
  ResendVerifyEmailRequestBody,
  ResetPasswordRequestBody,
  TokenPayload,
  VerifyEmailRequestBody,
  VerifyForgotPasswordRequestBody
} from '~/models/request/User.request'
import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'
import usersService from '~/services/users.services'
import emailService from '~/services/email.services'

// login
export const loginController = async (req: Request<ParamsDictionary, any, LoginRequestBody>, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await usersService.login(user_id.toString())
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
  const { decoded_refresh_token } = req
  const result = await usersService.refreshToken({ refresh_token, decoded_refresh_token })
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
  const email_verify_token = await usersService.createEmailVerifyToken(user_id)
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
  const result = await usersService.forgotPassword((_id as ObjectId).toString())
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
