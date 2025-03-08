import Joi from "joi"
import { Request, Response, NextFunction } from 'express'
import { ContentType } from '../../enums/contentType.enum'

/**
 * Schema to validate new comment submissions.
 * Validates the content type, target ID, comment content, and parent comment ID (optional).
 */
const contentType = Joi.string().valid(...Object.values(ContentType)).required()
const targetId = Joi.string().required()
const content = Joi.string().min(1).max(250).required()
const parentComment = Joi.string().allow('', null)

const addCommentSchema = Joi.object({
    contentType: contentType,
    targetId: targetId,
    content: content,
    parentComment: parentComment
})

/**
 * Schema to validate comment updates.
 * Validates the comment ID and updated content.
 */
const commentId = Joi.string().required();
const updateCommentSchema = Joi.object({
  commentId: commentId,
  content: content
})

/**
 * Schema to validate the deletion of comments.
 * Validates the comment ID and its content type.
 */
const deleteCommentSchema = Joi.object({
  commentId: commentId,
  contentType: contentType
})

/**
 * Middleware to validate the creation of a new comment.
 * @param req - The request object containing the new comment data.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * If validation fails, it sends a 400 status code with error details.
 * Otherwise, it passes control to the next middleware function.
 */
export function validateAddComment(req: Request, res: Response, next: NextFunction): void {
    const { error } = addCommentSchema.validate(req.body);
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
 * Middleware to validate comment updates.
 * @param req - The request object containing the update data.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * If validation fails, it sends a 400 status code with error details.
 * Otherwise, it passes control to the next middleware function.
 */
export function validateUpdateComment(req: Request, res: Response, next: NextFunction): void {
  const { error } = updateCommentSchema.validate(req.body);
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
 * Middleware to validate the deletion of comments.
 * @param req - The request object containing the deletion data.
 * @param res - The response object.
 * @param next - The next middleware function in the stack.
 *
 * If validation fails, it sends a 400 status code with error details.
 * Otherwise, it passes control to the next middleware function.
 */
export function validateDeleteComment(req: Request, res: Response, next: NextFunction): void {
  const { error } = deleteCommentSchema.validate(req.body);
  if (error) {
      res.status(400).json({
         message: "Validation failed", 
         details: error.details.map(detail => detail.message) 
        });
      return
  }
  next()
}
