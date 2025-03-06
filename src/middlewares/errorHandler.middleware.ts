import { Request, Response, NextFunction } from 'express'

export interface ICustomError extends Error {
  statusCode?: number
}

/**
 * Express middleware for handling exceptions that occur during the processing of requests.
 * This error handler logs the error to the console and sends a JSON response with the error message and appropriate status code.
 * 
 * It checks for a statusCode property on the error object to determine the HTTP response status. If none is found,
 * it defaults to 500, indicating an Internal Server Error. If there's no error, it simply passes control to the next middleware.
 * 
 * @param err - The error object that may contain custom properties such as statusCode.
 * @param req - Express Request object. Not used in this function, but necessary for middleware signature.
 * @param res - Express Response object used to send back the error response.
 * @param next - Callback to pass control to the next middleware function in the stack.
 */
export function errorHandler(err: ICustomError, req: Request, res: Response, next: NextFunction): void {
  if (err) {
    console.error(err) 
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ message: err.message || 'Internal Server Error' })
  } else {
    next()
  }
}

export default errorHandler
