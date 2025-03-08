import express from 'express'
import likesController from '../controllers/likes.controller'
import sessionMiddleware from '../middlewares/session.midleware'

/**
 * Creates and returns an Express Router for like-related routes.
 * This router manages API endpoints for adding and deleting likes.
 * Note: The DELETE route should ideally specify which like to delete, either via path parameters or request body.
 *
 * Routes:
 * - POST '/': Adds a new like using the `addLike` controller method. Typically, details such as
 *   the target ID and the user ID of the person who liked the content are expected in the request body.
 * - DELETE '/': Deletes an existing like using the `deleteLike` controller method. This operation
 *   should specify the ID of the like to be deleted, which needs to be defined in the request path or body.
 *
 * @returns {express.Router} Configured Express router for like routes.
 */
export function LikesRoute() {
  const router = express.Router()

  router.post('/', sessionMiddleware, likesController.addLike)
  router.delete('/', sessionMiddleware, likesController.deleteLike)

  return router
}

export default LikesRoute