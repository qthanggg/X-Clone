import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import { LogoutRequestBody, RegisterRequestBody } from '~/models/request/User.request'
import User from '~/models/schemas/User.schemas'
import usersService from '~/services/users.services'

// login
export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId

  const result = await usersService.login(user_id.toString())
  res.status(200).json({ message: USER_MESSAGES.LOGIN_SUCCESS, result })
}

// register
export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  res.status(200).json({ message: USER_MESSAGES.REGISTER_SUCCESS, result })
}
// logout
export const logoutController = async (req: Request<ParamsDictionary, any, LogoutRequestBody>, res: Response) => {
  const { refresh_token } = req.body
  await usersService.logout(refresh_token)
  res.status(200).json({ message: USER_MESSAGES.LOGOUT_SUCCESS })
}

export const refreshTokenController = async (req: Request, res: Response) => {
  const { refresh_token } = req.body
  const { decoded_refresh_token } = req
  const result = await usersService.refreshToken({ refresh_token, decoded_refresh_token })
  res.json({
    message: USER_MESSAGES.REFRESH_TOKEN_SUCCESS,
    result
  })
}
