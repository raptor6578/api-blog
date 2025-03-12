import express, { Router } from 'express'
import tokenMiddleware from '../middlewares/token.middleware'
import imagesController from '../controllers/images.controller'

function ImagesRoute() {

        const router = express.Router()
        router.get('/:path/:width/:height/:imageName', imagesController.getImage)
        return router
}

export default ImagesRoute