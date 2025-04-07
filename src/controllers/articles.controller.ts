import { Request, Response } from 'express'
import articleRepository from '../repositories/article.repository'
import responseService from '../services/response.service'
import imageService from '../services/image.service'
import getSlug from 'speakingurl'

/**
 * Controller for managing articles.
 */
export class ArticleController {

  /**
   * Creates a new article. Extracts the title, description, and content from the request body,
   * and the author's ID from the authenticated user. If files are uploaded, they are processed by `imageService.saveImages`
   * to save under a directory named after the article's slug.
   * @param req - The Express request object, which must include the user's ID in `req.user!._id`.
   * @param res - The Express response object.
   * @returns Sends a JSON response with a status of 200 and a success message.
   */
  public async newArticle(req: Request, res: Response): Promise<void> {
    const { title, description, content } = req.body
    const author = req.user!._id
    let imageNames

    if (req.files) { 
      const titleSlug = getSlug(title, { lang: 'fr' })
      await imageService.createOrResetFolder(`articles/${titleSlug}`)
      imageNames = await imageService.saveImages(`articles/${titleSlug}`, req.files, false)
    }

    await articleRepository.newArticle(title, description, content, author, {session: req.session, imageNames})
    const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'successNew')
    res.status(statusCode).json({message})
  }

  /**
   * Retrieves all articles. Does not require any specific parameters in the request.
   * @param req - The Express request object.
   * @param res - The Express response object.
   * @returns Sends a JSON response with a status of 200 and a list of articles.
   */
  public async getAll(req: Request, res: Response): Promise<void> {
    const articles = await articleRepository.getAll()
    res.status(200).json(articles)
  }
  
    /**
   * Retrieves an article by its slug identifier.
   * @param req - The Express request object, which must include the article's `slug` in `req.params`.
   * @param res - The Express response object.
   * @returns Sends the found article or an error message if no article is found.
   */
  public async getArticleBySlug(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const article = await articleRepository.getArticleBySlug(slug)
    if (!article) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'getArticleBySlug', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    res.status(200).send(article)
  }

  /**
   * Updates an existing article identified by its slug. Extracts the title and content from the request body,
   * and the author's ID from the authenticated user. If files are uploaded, they are processed by `imageService.saveImages`
   * to save under a directory named after the article's slug.
   * @param req - The Express request object, which must include the article's `slug` in `req.params`, 
   * and the user's ID in `req.user!._id`. It may also include `files` as an array of image files (if images are uploaded).
   * @param res - The Express response object.
   * @returns Sends a JSON response with a status of 200 and the updated article.
   */
  public async updateArticle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const { title, content } = req.body
    const author = req.user!._id 

    let imageNames
    if (req.files) { 
      const titleSlug = getSlug(title, { lang: 'fr' })
      await imageService.createOrResetFolder(`articles/${titleSlug}`)
      imageNames = await imageService.saveImages(`articles/${titleSlug}`, req.files, false)
    }

    const article = await articleRepository.findBySlugAndUpdate(slug, title, content, author, { session: req.session })
    if (!article) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'newAndUpdateArticle', 'successUpdate')
    res.status(statusCode).json({message})
  }

  /**
   * Deletes an article identified by its slug. Extracts the author's ID from the authenticated user to check permissions.
   * @param req - The Express request object, which must include the article's `slug` in `req.params` and the user's ID in `req.user!._id`.
   * @param res - The Express response object.
   * @returns Sends a confirmation message or an error message if no article is found.
   */
  public async deleteArticle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const author = req.user!._id
    const article = await articleRepository.findBySlugAndDelete(slug, author, { session: req.session })
    if (!article) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'deleteArticle', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    await imageService.deleteImages('articles', article.imageNames)
    const { statusCode, message } = responseService.getStatusCodeAndMessage('article', 'deleteArticle', 'success')
    res.status(statusCode).json({message})
  }

}

export default new ArticleController
