import express, { Express } from 'express'
import corsMiddleware from '../middlewares/cors.middleware'
import sanitizeMiddleware from '../middlewares/sanitize.middleware'
import errorHandler from '../middlewares/errorHandler.middleware'

/**
 * Loads necessary middlewares into the Express application. This setup function is crucial
 * for initializing the middleware stack that will handle requests and responses throughout
 * the application lifecycle.
 * 
 * Middlewares are loaded in a specific order to ensure proper handling of requests:
 * 1. CORS Middleware - Handles Cross-Origin Resource Sharing settings.
 * 2. JSON Body Parser - Parses incoming request bodies in a middleware before your handlers,
 *    available under the `req.body` property.
 * 3. URL Encoded Parser - Parses URL-encoded bodies (important for form submissions).
 * 4. Sanitization Middleware - Custom middleware for sanitizing request data to prevent
 *    common web vulnerabilities.
 * 5. Error Handling Middleware - Centralized error handling, which is delayed to ensure
 *    it captures all errors thrown from preceding middlewares or routes.
 * 
 * @param app - The Express application instance to which middlewares are attached.
 */
export function globalMiddlewaresLoader(app: Express) {

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

export default globalMiddlewaresLoader