import { UserModel, UserSchema } from '../models/user.model'

/**
 * Repository class for managing user entities in the database. Provides methods to check if an email exists,
 * retrieve a user by email, and create a new user.
 */
export class UserRepository {

  /**
   * Checks if an email is already registered in the database.
   * @param email - The email address to check.
   * @returns A boolean indicating whether the email exists in the database.
   */
  public async doesEmailExist(email: string): Promise<boolean> {
    const user = await UserModel.findOne({ email })
    return !!user
  }

  /**
   * Retrieves a user by their email address. Optionally includes the user's password in the result,
   * depending on whether the password is needed for the operation (e.g., during authentication).
   * @param email - The email address of the user to retrieve.
   * @param passwordSelected - Boolean indicating whether to include the password in the retrieved user information.
   * @returns The user document if found, or null if no user is found with the given email.
   */
  public async getUserByEmail(email: string, passwordSelected?: boolean): Promise<UserSchema | null> {
    const query = UserModel.findOne({email})
    const user = passwordSelected ? await query.select('+password') : await query
    return user || null
  }

  /**
   * Creates a new user with the provided email and password. Saves the new user to the database.
   * @param email - The email address for the new user.
   * @param password - The password for the new user, which should be hashed prior to calling this method if not handled internally.
   * @param imageName - Optional The image name of the user to retrieve.
   * @returns The newly created user document.
   */
  public async newUser(email: string, password: string, imageName?: string): Promise<UserSchema> {
    const newUser = new UserModel({ email, password })
    imageName && (newUser.imageName = imageName)
    await newUser.save()
    return newUser
  }

}

export default new UserRepository()