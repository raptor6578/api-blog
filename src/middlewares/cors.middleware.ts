import configLoaderService from '../services/configLoader.service'
import { Request, Response, NextFunction } from 'express'

const config = configLoaderService.getConfig()

/**
 * Middleware to enable CORS (Cross-Origin Resource Sharing) in the Express application.
 * Sets various headers to manage cross-origin requests according to the application's configuration.
 * 
 * This middleware sets the 'Access-Control-Allow-Origin' header to a specific value from the app's config,
 * allowing control over which domains can access the resources. Additionally, it configures the types of
 * allowed HTTP methods and headers that can be used with cross-origin requests.
 * 
 * @param req - Express Request object. This middleware does not directly use any property from 'req', but it's part of the middleware signature.
 * @param res - Express Response object where the CORS headers are set.
 * @param next - Callback to pass control to the next middleware function in the stack.
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', config.allowOrigin)
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
      next()
}

export default corsMiddleware