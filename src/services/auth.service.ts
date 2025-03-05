import configLoaderService from './configLoader.service'
import { UserSchema } from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

class AuthService {

  private config = configLoaderService.getConfig()

  public async isPasswordMatch(password: string, comparePassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, comparePassword)
    return isMatch
  }

  public getTokenByUser(user: UserSchema) {
    const payload = user.toJSON()
    const { secret, expiresIn } = this.config.jwt
    delete payload.password
    return jwt.sign(payload, secret, { expiresIn })
  }
  
}

export default new AuthService()