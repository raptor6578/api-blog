import express from 'express'
import articlesController from '../controllers/articles.controller'
import tokenMiddleware from '../middlewares/token.middleware'

function ArticlesRoute() {

    const router = express.Router()

    router.get('/', articlesController.getAll)
    router.post('/', tokenMiddleware, articlesController.newArticle)
    router.get('/:slug', articlesController.getArticleById)
    router.put('/:slug', tokenMiddleware, articlesController.updateArticle)
    router.delete('/:slug', tokenMiddleware, articlesController.deleteArticle)
    
    return router
}

export default ArticlesRoute