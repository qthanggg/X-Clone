import { Request, Response, NextFunction } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { RegisterRequestBody } from '~/models/request/User.request'
import usersService from '~/services/users.services'
export const loginController = (req: Request, res: Response) => {
  if (req.body.email === 'thang@gmail.com' && req.body.password === '123456') {
    res.status(200).json({ message: 'User logged in' })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export const registerController = async (
  req: Request<ParamsDictionary, any, RegisterRequestBody>,
  res: Response,
  next: NextFunction
) => {
  const result = await usersService.register(req.body)
  res.status(200).json({ message: 'User registered', result })
}
