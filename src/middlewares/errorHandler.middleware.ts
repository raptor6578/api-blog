import { Request, Response, NextFunction } from 'express'

interface ICustomError extends Error {
  statusCode?: number
}

function errorHandler(err: ICustomError, req: Request, res: Response, next: NextFunction): void {
  if (err) {
    console.error(err) 
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({ message: err.message || 'Internal Server Error' })
  } else {
    next()
  }
}

export default errorHandler
