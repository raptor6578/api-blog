import sanitize from 'mongo-sanitize';
import { Request, Response, NextFunction } from 'express'

/**
 * Middleware to sanitize request inputs to prevent MongoDB injection attacks.
 * This middleware uses the `mongo-sanitize` module to clean the `req.body`, `req.query`, 
 * and `req.params` objects by stripping out any keys that start with a `$` symbol,
 * which are used in MongoDB queries potentially to alter query operators.
 * 
 * By sanitizing these parts of the request, the application protects against injecting malicious
 * MongoDB query operators into the database through user inputs.
 * 
 * @param req - Express Request object containing the data to be sanitized.
 * @param res - Express Response object. Not directly used by this middleware, but necessary for middleware signature.
 * @param next - Callback to pass control to the next middleware function in the stack.
 */
export function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  req.body = sanitize(req.body)
  req.query = sanitize(req.query)
  req.params = sanitize(req.params)
  next()
}

export default sanitizeMiddleware
