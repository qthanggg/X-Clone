import { Router } from 'express'
import { loginControler } from '~/controllers/users.controllers'
import { loginValidator } from '~/middlewares/users.middlewares'
const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginControler)

export default usersRouter
