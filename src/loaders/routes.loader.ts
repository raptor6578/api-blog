import express, { Express } from 'express'
import path from 'path'
import authRoute from '../routes/auth.route'
import settingsRoute from '../routes/settings.route'
import articlesRoutes from '../routes/articles.route'
import commentsRoutes from '../routes/comments.route'
import likesRoute from '../routes/likes.route'
import tokenMiddleware from '../middlewares/token.middleware'

/**
 * Configures and attaches routes to the Express application. This includes API routes for
 * authentication, settings, articles, comments, and likes, as well as middleware for token
 * verification where necessary. Also sets up static file serving for images.
 * 
 * @param app - The Express application instance to which routes and static middleware are attached.
 * 
 * Routes are organized under the '/api' path and are structured as follows:
 * - '/images' : Serves static images from a directory.
 * - '/api/auth' : Routes related to authentication processes.
 * - '/api/settings' : Protected routes for user settings, requires token authentication.
 * - '/api/articles' : Routes for article management.
 * - '/api/comments' : Protected routes for comments on articles, requires token authentication.
 * - '/api/likes' : Protected routes for liking articles and comments, requires token authentication.
 */
export function routesLoader(app: Express) {

  app.use('/images', express.static(path.join(__dirname, 'images')))
  app.use('/api/auth', authRoute())
  app.use('/api/settings', tokenMiddleware, settingsRoute())
  app.use('/api/articles', articlesRoutes())
  app.use('/api/comments', tokenMiddleware, commentsRoutes())
  app.use('/api/likes', tokenMiddleware, likesRoute())

}

export default routesLoader