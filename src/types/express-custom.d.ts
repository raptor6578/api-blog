import 'express'
import { UserSchema } from '../models/user.model'

declare module 'express' {
    interface Request {
        user?: UserSchema
    }
}