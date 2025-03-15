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
     * Registers a new user with an email, password, and optionally a profile image. It first checks if the email already exists
     * in the database and returns an error if so. If the email is not found, it creates a new user account. If an image file is
     * provided in `req.file`, the image is saved in the 'users' directory using the image service, and the image name is associated
     * with the user account. The method handles the file upload using `multer`, expecting the file to be accessed via `req.file`.
     * @param req - The Express request object, which must include `email` and `password` in `req.body`. The request may also include
     * an uploaded image file accessible through `req.file`.
     * @param res - The Express response object.
     * @returns A JSON response with a status of 201 indicating successful user creation. If the email already exists, it returns a status of 409.
     */
    public async signUp(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body
        if (await userRepository.doesEmailExist(email)) {
            const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signUp', 'emailExists')
            res.status(statusCode).json({ message })
            return
        }
        let imageName
        if (req.file) {
            imageName = await imageService.saveImage('users', req.file)
        }
        await userRepository.newUser(email, password, imageName)
        const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signUp', 'success')
        res.status(statusCode).json({ message })
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
            const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signIn', 'invalidEmailorPassword')
            res.status(statusCode).json({ message })
            return
        }
        if (!await authService.isPasswordMatch(password, user.password)) {
            const { statusCode, message } = responseService.getStatusCodeAndMessage('auth', 'signIn', 'invalidEmailorPassword')
            res.status(statusCode).json({ message })
            return
        }
        const token = authService.getTokenByUser(user)
        res.status(200).json({token})
    }

}

export default new AuthController()
