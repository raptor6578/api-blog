import Joi from "joi"
import { Request, Response, NextFunction } from 'express'

/**
 * Defines the validation schema for new and updated articles using Joi.
 */
const newArticleSchema = Joi.object({
    title: Joi.string().min(10).max(100).required(),
    content: Joi.string().min(100).max(15000).required()
})

/**
 * Middleware to validate the structure of a new or updated article.
 * @param req - The Express request object containing the article data.
 * @param res - The Express response object used for sending back responses.
 * @param next - The next middleware function in the stack.
 *
 * This function validates the request body against a predefined Joi schema for articles.
 * If the validation fails, it responds with a 400 status code and a detailed error message.
 * If the validation is successful, it proceeds to the next middleware function.
 */
export function validateNewAndUpdateArticle(req: Request, res: Response, next: NextFunction) {
    const { error } = newArticleSchema.validate(req.body)
    if (error) {
        res.status(400).json({
           message: "Validation failed", 
           details: error.details.map(detail => detail.message) 
          })
        return
    }
    next()
}