import express from 'express'
import articlesController from '../controllers/articles.controller'
import tokenMiddleware from '../middlewares/token.middleware'
import sessionMiddleware from '../middlewares/session.midleware'
import { validateNewAndUpdateArticle } from '../middlewares/validators/article.validator.middleware'

/**
 * Creates and returns an Express Router for article-related routes.
 * This router handles API endpoints for articles, providing functionality to retrieve,
 * create, update, and delete articles. Authentication is required for creating, updating,
 * and deleting articles, enforced by tokenMiddleware.
 * 
 * Routes:
 * - GET '/' to retrieve all articles.
 * - POST '/' to create a new article, protected by tokenMiddleware.
 * - GET '/:slug' to retrieve a single article by its slug.
 * - PUT '/:slug' to update an existing article by its slug, protected by tokenMiddleware.
 * - DELETE '/:slug' to delete an article by its slug, protected by tokenMiddleware.
 * 
 * @returns {express.Router} - Configured Express router for article routes.
 */
export function ArticlesRoute() {

    const router = express.Router()

    router.get('/', articlesController.getAll)
    router.post('/', tokenMiddleware, validateNewAndUpdateArticle, articlesController.newArticle)
    router.get('/:slug', articlesController.getArticleBySlug)
    router.put('/:slug', tokenMiddleware, articlesController.updateArticle)
    router.delete('/:slug', tokenMiddleware, validateNewAndUpdateArticle, sessionMiddleware, articlesController.deleteArticle)
    
    return router
}

export default ArticlesRoute