import configLoaderService from '../services/configLoader.service'
import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { UserSchema } from '../models/user.model'

const config = configLoaderService.getConfig()

function tokenMiddleware(req: Request, res: Response, next: NextFunction) {
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