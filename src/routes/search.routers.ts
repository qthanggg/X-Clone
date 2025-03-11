import { Router } from 'express'
import { searchController } from '~/controllers/search.controllers'
import { searchValidator } from '~/middlewares/search.middleware'
import { accessTokenValidator, verifyUserValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandler } from '~/utils/handlers'
const searchRouter = Router()

searchRouter.get('/', accessTokenValidator, verifyUserValidator, searchValidator, searchController)

export default searchRouter
