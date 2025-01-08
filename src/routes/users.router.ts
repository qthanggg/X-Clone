import { Router } from 'express'
import { loginControler, registerController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginControler)
usersRouter.post('/register', registerValidator, registerController)

export default usersRouter
