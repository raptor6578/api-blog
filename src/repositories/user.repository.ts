import { UserModel, UserSchema } from '../models/user.model'

class UserRepository {

  public async isEmailExists(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email })
    return !!user
  }

  public async getUserByEmail(email: string, passwordSelected?: boolean): Promise<UserSchema | null> {
    const query = UserModel.findOne({email})
    const user = passwordSelected ? await query.select('+password') : await query
    return user || null
  }

  public async newUser(email: string, password: string): Promise<UserSchema> {
    const newUser = new UserModel({ email, password })
    await newUser.save()
    return newUser
  }

}

export default new UserRepository()