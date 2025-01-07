import { Request, Response } from 'express'

import usersService from '~/services/users.services'
export const loginControler = (req: Request, res: Response) => {
  if (req.body.email === 'thang@gmail.com' && req.body.password === '123456') {
    res.status(200).json({ message: 'User logged in' })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await usersService.register({ email, password })
    res.status(200).json({ message: 'User registered', result })
  } catch (error) {
    res.json({ message: 'Register failed', error })
  }
}
