import { Router } from 'express'
import { loginControler, registerController } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginControler)
usersRouter.post('/register', registerController)

export default usersRouter
