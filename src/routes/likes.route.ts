import express from 'express'
import likesController from '../controllers/likes.controller'

function LikesRoute() {
  const router = express.Router()

  router.post('/', likesController.addLike)
  router.delete('/', likesController.deleteLike)

  return router
}

export default LikesRoute