import configLoaderService from '../services/configLoader.service'
import { Request, Response, NextFunction } from 'express'

const config = configLoaderService.getConfig()

function corsMiddleware(req: Request, res: Response, next: NextFunction) {
      res.setHeader('Access-Control-Allow-Origin', config.allowOrigin)
      res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
      next()
}

export default corsMiddleware