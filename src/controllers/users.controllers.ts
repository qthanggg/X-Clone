import { Request, Response } from 'express'
export const loginControler = (req: Request, res: Response) => {
  if (req.body.email === 'thang@gmail.com' && req.body.password === '123456') {
    res.status(200).json({ message: 'User logged in' })
  } else {
    res.status(401).json({ message: 'Invalid credentials' })
  }
}
