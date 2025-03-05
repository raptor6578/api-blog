import express, { Router } from 'express'
import authController from '../controllers/auth.controller'
import {validateSignIn, validateSignUp} from '../middlewares/validators/auth.validator.middleware'

function AuthRoute() {

    const router = express.Router()

    router.post('/signup', validateSignUp, authController.signUp)
    router.post('/signin', validateSignIn, authController.signIn)

    return router
}

export default AuthRoute