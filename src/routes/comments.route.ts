import express from 'express'
import commentsController from '../controllers/comments.controller'
import sessionMiddleware from '../middlewares/session.midleware'
import { validateAddComment, validateDeleteComment, validateUpdateComment } from '../middlewares/validators/comment.validator.middleware'

/**
 * Creates and returns an Express Router for comment-related routes.
 * This router handles API endpoints for managing comments, including adding,
 * updating, and deleting comments.
 *
 * Routes:
 * - POST '/': Adds a new comment using the `addComment` controller method.
 * - PUT '/': Updates an existing comment using the `updateComment` controller method.
 * - DELETE '/': Deletes an existing comment using the `deleteComment` controller method.
 *
 * @returns {express.Router} Configured Express router for comment routes.
 */
export function ArticlesRoute() {
  const router = express.Router()

  router.post('/', validateAddComment, commentsController.addComment)
  router.put('/', validateUpdateComment, commentsController.updateComment)
  router.delete('/', validateDeleteComment, sessionMiddleware, commentsController.deleteComment)

  return router
}

export default ArticlesRoute