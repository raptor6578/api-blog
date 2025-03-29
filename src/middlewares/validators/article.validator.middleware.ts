import Joi from "joi"
import { Request, Response, NextFunction } from 'express'
import responseService from "../../services/response.service"

/**
 * Defines the validation schema for new and updated articles using Joi.
 */
const titleEmpty = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'titleEmpty').message
const titleMin = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'titleMin').message
const titleMax = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'titleEmpty').message

const contentEmpty = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'contentEmpty').message
const contentMin = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'contentMin').message
const contentMax = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'contentEmpty').message

const newArticleSchema = Joi.object({
    title: Joi.string().min(10).max(100).required().messages({
        'string.min': titleMin,
        'string.max': titleMax,
        'string.empty': titleEmpty  
    }),
    content: Joi.string().min(100).max(15000).required().messages({
        'string.min': contentMin,
        'string.max': contentMax,
        'string.empty': contentEmpty
    })
})

/**
 * Middleware to validate new and updated article data.
 * Ensures the request contains valid title and content.
 * If validation fails, it responds with a 400 status code and a validation error message.
 * @param req - Express Request object containing article input data.
 * @param res - Express Response object used to send back the HTTP response.
 * @param next - Callback to pass control to the next middleware function.
 */
export function validateNewAndUpdateArticle(req: Request, res: Response, next: NextFunction) {
    const { error } = newArticleSchema.validate(req.body)
    if (error) {
        const response =  { message: error.details[0].message, type: error.details[0].path[0] }
        res.status(400).json(response)
        return
    }
    next()
}