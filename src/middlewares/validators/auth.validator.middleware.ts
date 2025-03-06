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

/**
 * Middleware to validate sign-up request data.
 * Ensures the request contains valid email, password, and optionally, a name.
 * If validation fails, it responds with a 400 status code and a validation error message.
 * @param req - Express Request object containing user input data.
 * @param res - Express Response object used to send back the HTTP response.
 * @param next - Callback to pass control to the next middleware function.
 */
export function validateSignUp(req: Request, res: Response, next: NextFunction) {
    const { error } = signUpSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: "Validation failed", details: error.details.map(detail => detail.message) })
        return
    }
    next()
}

/**
 * Middleware to validate sign-in request data.
 * Checks for a valid email and password in the request. If validation fails,
 * it sends back a 400 status code and an error message indicating the authentication failure.
 * @param req - Express Request object containing user input data.
 * @param res - Express Response object used to send back the HTTP response.
 * @param next - Callback to pass control to the next middleware function.
 */
export function validateSignIn(req: Request, res: Response, next: NextFunction) {
    const { error } = signInSchema.validate(req.body)
    if (error) {
        res.status(400).json({ message: "Authentication failed.", details: error.details.map(detail => detail.message) })
        return
    }
    next()
}