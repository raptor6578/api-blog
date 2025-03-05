import express, { Express } from 'express'
import corsMiddleware from '../middlewares/cors.middleware'
import sanitizeMiddleware from '../middlewares/sanitize.middleware'
import errorHandler from '../middlewares/errorHandler.middleware'

function middlewaresLoader(app: Express) {

  // Loaded before routes
  app.use(corsMiddleware)
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(sanitizeMiddleware)

  // Loaded after routes
  setImmediate(() => {
    app.use(errorHandler)
  })
  
}

export default middlewaresLoader