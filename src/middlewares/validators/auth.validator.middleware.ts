import Joi from "joi"
import { Request, Response, NextFunction } from 'express'

const email = Joi.string().email().required()
const password = Joi.string().min(8).required()

const signUpSchema = Joi.object({
    email: email,
    password: password,
    name: Joi.string().alphanum().min(3).max(30).optional(),
})

const signInSchema = Joi.object({
    email: email,
    password: password
})

export function validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { error } = signUpSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: "Validation failed", details: error.details.map(detail => detail.message) })
        return
    }
    next()
}

export function validateSignIn(req: Request, res: Response, next: NextFunction) {
    const { error } = signInSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: "Authentication failed.", details: error.details.map(detail => detail.message) })
        return
    }
    next()
}