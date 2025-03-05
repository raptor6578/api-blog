import express, { Express } from 'express'
import path from 'path'
import authRoute from '../routes/auth.route'
import settingsRoute from '../routes/settings.route'
import articlesRoutes from '../routes/articles.route'
import commentsRoutes from '../routes/comments.route'
import tokenMiddleware from '../middlewares/token.middleware'

function routesLoader(app: Express) {

  app.use('/images', express.static(path.join(__dirname, 'images')))
  app.use('/api/auth', authRoute())
  app.use('/api/settings', tokenMiddleware, settingsRoute())
  app.use('/api/articles', articlesRoutes())
  app.use('/api/comments', tokenMiddleware, commentsRoutes())

}

export default routesLoader