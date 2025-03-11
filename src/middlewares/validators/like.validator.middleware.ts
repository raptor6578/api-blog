import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { ContentType } from '../../enums/contentType.enum'

const addLikeSchema = Joi.object({
    targetId: Joi.string().required(),
    contentType: Joi.string().valid(...Object.values(ContentType)).required(), 
    value: Joi.number().required()
})

const deleteLikeSchema = Joi.object({
    targetId: Joi.string().required()
})

/**
 * Middleware to validate the data for adding a like.
 * Checks the request body against the defined Joi schema.
 * @param req - The Express request object, expected to include `targetId`, `contentType`, and `value`.
 * @param res - The Express response object.
 * @param next - The next middleware function in the Express routing process.
 * 
 * If validation fails, responds with a 400 status code and detailed error messages.
 * If validation succeeds, proceeds to the next middleware.
 */
export function validateAddLike(req: Request, res: Response, next: NextFunction): void {
  const { error } = addLikeSchema.validate(req.body)
  if (error) {
      res.status(400).json({
          message: "Validation failed", 
          details: error.details.map(detail => detail.message)
      });
      return
  }
  next()
}

/**
* Middleware to validate the data for deleting a like.
* Checks the request body against the defined Joi schema.
* @param req - The Express request object, expected to include `targetId`.
* @param res - The Express response object.
* @param next - The next middleware function in the Express routing process.
* 
* If validation fails, responds with a 400 status code and detailed error messages.
* If validation succeeds, proceeds to the next middleware.
*/
export function validateDeleteLike(req: Request, res: Response, next: NextFunction): void {
  const { error } = deleteLikeSchema.validate(req.body)
  if (error) {
      res.status(400).json({
          message: "Validation failed", 
          details: error.details.map(detail => detail.message)
      });
      return
  }
  next()
}