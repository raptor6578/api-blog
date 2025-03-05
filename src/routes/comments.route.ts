import express from 'express'
import commentsController from '../controllers/comments.controller'

function ArticlesRoute() {
  const router = express.Router()

  router.post('/', commentsController.addComment)
  router.put('/', commentsController.updateComment)
  router.delete('/', commentsController.deleteComment)

  return router
}

export default ArticlesRoute