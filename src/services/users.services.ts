import User from '~/models/schemas/User.schemas'
import databaseService from '~/services/database.services'

class UsersService {
  async register(payload: { email: string; password: string }) {
    const result = await databaseService.users.insertOne(
      new User({
        email: payload.email,
        password: payload.password
      })
    )
    return result
  }
}

const usersService = new UsersService()
export default usersService
