import express, { Router } from 'express'
import tokenMiddleware from '../middlewares/token.middleware'
import settingsController from '../controllers/settings.controller'

function SettingsRoute() {

        const router = express.Router()
        router.post('/account', settingsController.account)
        return router
}

export default SettingsRoute