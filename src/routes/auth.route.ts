import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
import {validateSignIn, validateSignUp} from '../middlewares/validators/auth.validator.middleware'

/**
 * Creates and returns an Express Router for authentication routes.
 * This setup configures routes for signing up and signing in users, incorporating validation middleware
 * to ensure that input data meets the required format and standards before it reaches the controller.
 * 
 * Routes:
 * - POST '/signup': Registers a new user. The request's body must validate against the signUp schema
 *   before proceeding to the signUp controller method.
 * - POST '/signin': Authenticates a user. The request's body must validate against the signIn schema
 *   before proceeding to the signIn controller method.
 *
 * Both routes use specific validation middleware to preprocess and validate incoming data,
 * ensuring that only valid data is processed by the controllers.
 * 
 * @returns {Router} Configured Express router for authentication routes.
 */
export function AuthRoute() {

    const router = express.Router()

    router.post('/signup', validateSignUp, authController.signUp)
    router.post('/signin', validateSignIn, authController.signIn)

    return router
}

export default AuthRoute