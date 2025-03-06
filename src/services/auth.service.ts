import configLoaderService from './configLoader.service'
import { UserSchema } from '../models/user.model'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

/**
 * Service class for handling authentication-related operations such as password verification
 * and generating JWT tokens for authenticated users.
 */
export class AuthService {

  private config = configLoaderService.getConfig()

  /**
   * Compares a plaintext password against a hashed password to verify user login attempts.
   * @param password - The plaintext password input by the user.
   * @param comparePassword - The hashed password stored in the database.
   * @returns A boolean indicating whether the password is a match.
   */
  public async isPasswordMatch(password: string, comparePassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, comparePassword)
    return isMatch
  }

  /**
   * Generates a JWT token for a logged-in user, excluding sensitive information such as the password.
   * The token includes the user's details and has a configured expiration.
   * @param user - The user schema object containing the user's information.
   * @returns A JWT token string that can be used to authenticate subsequent requests by the user.
   */
  public getTokenByUser(user: UserSchema) {
    const payload = user.toJSON()
    const { secret, expiresIn } = this.config.jwt
    delete payload.password
    return jwt.sign(payload, secret, { expiresIn })
  }
  
}

export default new AuthService()