import { Request, Response, NextFunction } from 'express'
import mongoose from 'mongoose'

/**
 * Middleware to manage MongoDB sessions within each request lifecycle.
 * This middleware initializes a MongoDB session and attaches it to the `req` object as `req.session`.
 * It ensures the session is closed after the response is sent to the client by listening to the `finish` event of the response object.
 * 
 * @param {Request} req - The Express request object, augmented with the session object.
 * @param {Response} res - The Express response object, used to listen for the `finish` event to close the session.
 * @param {NextFunction} next - The callback function to continue processing the middleware stack.
 * 
 * Usage:
 * The session is accessible via `req.session` in subsequent middleware and route handlers.
 * 
 * Example:
 * app.use(sessionMiddleware)
 */
export async function sessionMiddleware(req: Request, res: Response, next: NextFunction) {
  const session = await mongoose.startSession()
  req.session = session
  try {
    await req.session.startTransaction()
    res.on('finish', async () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        await req.session.commitTransaction()
      } else {
        await req.session.abortTransaction()
      }
      await req.session.endSession()
    })

    next()
  } catch (error) {
    await req.session.abortTransaction()
    await req.session.endSession()
    next(error)
  }
}

export default sessionMiddleware