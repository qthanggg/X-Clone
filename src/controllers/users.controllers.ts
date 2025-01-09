import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USER_MESSAGES } from '~/constants/messages'
import { RegisterRequestBody } from '~/models/request/User.request'
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
