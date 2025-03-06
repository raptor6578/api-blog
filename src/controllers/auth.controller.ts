import { Request, Response } from 'express'
import authService from '../services/auth.service'
import userRepository from '../repositories/user.repository'

/**
 * Controller responsible for authentication operations.
 */
export class AuthController {

    /**
     * Registers a new user with an email and password. Checks if the email already exists in the database
     * and returns an error if it does. Otherwise, creates a new user and returns a success message.
     * @param req - The Express request object, which must include `email` and `password` in `req.body`.
     * @param res - The Express response object.
     * @returns A JSON response with a status of 201 indicating successful user creation or 409 if the email already exists.
     */
    public async signUp(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body
        if (await userRepository.isEmailExists(email)) {
            res.status(409).json({ message: "An account using the entered email already exists." })
            return
        }
        await userRepository.newUser(email, password)
        res.status(201).json({ message: "User created successfully." })
    }

    /**
     * Authenticates a user using email and password. Validates the user credentials and returns a JWT token
     * if authentication is successful. Returns an error if the email or password does not match.
     * @param req - The Express request object, which must include `email` and `password` in `req.body`.
     * @param res - The Express response object.
     * @returns A JSON response with a status of 200 and a JWT token if successful, or 401 if authentication fails.
     */
    public async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body
        const user = await userRepository.getUserByEmail(email, true)
        if (!user) {
            res.status(401).json({ message: "Invalid email or password." })
            return
        }
        if (!await authService.isPasswordMatch(password, user.password)) {
            res.status(401).json({ message: "Invalid email or password." })
            return
        }
        const token = authService.getTokenByUser(user)
        res.status(200).json({token})
    }

}

export default new AuthController()
