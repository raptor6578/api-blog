import Joi from "joi"
import { Request, Response, NextFunction } from 'express'
import responseService from "../../services/response.service"

const invalidEmail = responseService.getStatusCodeAndMessage('auth', 'validator', 'invalidEmail').message
const emptyEmail = responseService.getStatusCodeAndMessage('auth', 'validator', 'emptyEmail').message
const minPassword = responseService.getStatusCodeAndMessage('auth', 'validator', 'minPassword').message
const emptyPassword = responseService.getStatusCodeAndMessage('auth', 'validator', 'emptyPassword').message

const email = Joi.string().email().required().messages({
    'string.email': invalidEmail,
    'string.empty':  emptyEmail,
  })
const password = Joi.string().min(8).required().messages({
    'string.min': minPassword,
    'string.empty': emptyPassword
  })

const signUpSchema = Joi.object({
    email: email,
    password: password,
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
        const response =  { message: error.details[0].message, type: error.details[0].path[0] }
        res.status(400).json(response)
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
        const response =  { message: error.details[0].message, type: error.details[0].path[0] }
        res.status(400).json(response)
        return
    }
    next()
}