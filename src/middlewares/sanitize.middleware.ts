import sanitize from 'mongo-sanitize';
import { Request, Response, NextFunction } from 'express'

function sanitizeMiddleware(req: Request, res: Response, next: NextFunction) {
  req.body = sanitize(req.body)
  req.query = sanitize(req.query)
  req.params = sanitize(req.params)
  next()
}

export default sanitizeMiddleware
