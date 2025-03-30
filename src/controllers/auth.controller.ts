import { Request, Response } from 'express'
import authService from '../services/auth.service'
import userRepository from '../repositories/user.repository'
import responseService from '../services/response.service'
import imageService from '../services/image.service'

/**
 * Controller responsible for authentication operations.
 */
export class AuthController {

    /**
     * Registers a new user. Validates the email and username to ensure they are not already taken.
     * If the email or username exists, it returns an error message. If the registration is successful,
     * it saves the user's image if provided, and returns a success message.
     * @param req - The Express request object, which must include `email`, `username`, and `password` in `req.body`.
     * @param res - The Express response object.
     * @returns A JSON response with a status of 200 and a success message if successful, or an error message if validation fails.
     */
    public async signUp(req: Request, res: Response): Promise<void> {
        const { email, username, password } = req.body
        if (await userRepository.doesEmailExist(email)) {
            const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signUp', 'emailExists')
            res.status(statusCode).json({ message })
            return
        }
        if (await userRepository.doesUsernameExist(username)) {
            const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signUp', 'usernameExists')
            res.status(statusCode).json({ message })
            return
        }
        let imageName
        if (req.file) {
            imageName = await imageService.saveImage('users', req.file)
        }
        await userRepository.newUser(email, username, password, imageName)
        const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signUp', 'success')
        res.status(statusCode).json({ message })
    }

    /**
     * Signs in a user by validating the provided email and password. If the email is not found or the password does not match,
     * it returns an error message. If successful, it generates a JWT token for the user and returns it along with the user's information.
     * @param req - The Express request object, which must include `email` and `password` in `req.body`.
     * @param res - The Express response object.
     * @returns A JSON response with a status of 200 and the user's token and information if successful, or an error message if validation fails.
     */
    public async signIn(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body
        const user = await userRepository.getUserByEmail(email, true)
        if (!user) {
            const { statusCode, message, type } = responseService.getStatusCodeAndMessage('auth', 'signIn', 'invalidEmail')
            res.status(statusCode).json({ message, type })
            return
        }
        if (!await authService.isPasswordMatch(password, user.password)) {
            const { statusCode, message, type } = responseService.getStatusCodeAndMessage('auth', 'signIn', 'invalidPassword')
            res.status(statusCode).json({ message, type })
            return
        }
        const userResponse = user.toJSON()
        delete userResponse.password
        const token = authService.getTokenByUser(user)
        res.status(200).json({token, user: userResponse})
    }

}

export default new AuthController()
