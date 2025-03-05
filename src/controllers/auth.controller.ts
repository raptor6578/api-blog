import { Request, Response } from 'express'
import authService from '../services/auth.service'
import userRepository from '../repositories/user.repository'

class AuthController {

    public async signUp(req: Request, res: Response): Promise<void> {
        const { email, password } = req.body
        if (await userRepository.isEmailExists(email)) {
            res.status(409).json({ message: "An account using the entered email already exists." })
            return
        }
        await userRepository.newUser(email, password)
        res.status(201).json({ message: "User created successfully." })
    }

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
