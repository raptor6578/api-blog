import 'express'
import 'mongoose'
import { UserSchema } from '../models/user.model'

declare module 'express' {
    interface Request {
        user?: UserSchema
        session?: mongoose.ClientSession
        imageNames?: string[]
    }
}