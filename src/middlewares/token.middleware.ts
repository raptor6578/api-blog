import configLoaderService from '../services/configLoader.service'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserSchema } from '../models/user.model'

const config = configLoaderService.getConfig()

/**
 * Middleware for validating JWT tokens in Express applications. This middleware checks the authorization header
 * for a bearer token, verifies the token, and decodes it to extract the user details. It attaches the user details
 * to the request object for use in downstream handlers or middleware. It also handles various errors associated with
 * token validation, such as expired tokens and malformed tokens.
 *
 * @param req - Express Request object, where the authorization header is extracted and the user object is attached.
 * @param res - Express Response object, used to send back error messages if token validation fails.
 * @param next - Callback to pass control to the next middleware function in the stack.
 */
export function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const { secret } = config.jwt;
  const authorizationHeader = req.headers.authorization
  if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "No token provided." })
    return
  }
  const token = authorizationHeader.split(' ')[1]
  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err instanceof jwt.TokenExpiredError) {
        res.status(401).json({ message: "Token has expired." })
        return
      } else if (err instanceof jwt.JsonWebTokenError) {
        res.status(403).json({ message: "Failed to authenticate token." })
        return
      }
    }
    req.user = decoded as UserSchema
    next()
  })
}

export default tokenMiddleware