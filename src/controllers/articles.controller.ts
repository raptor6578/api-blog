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
   * Creates a new article with an optional array of images. Extracts the title and content of the article from the request body,
   * and the author's ID from the authenticated user. If files are uploaded and available in `req.files`, they are processed by 
   * `imageService.saveImages` to save under the 'articles' directory, and the resulting image names are included in the article data.
   * This method also supports transactional operations via `req.session`.
   * @param req - The Express request object, which must include `title` and `content` in `req.body`, and the user's ID in `req.user!._id`.
   * It may also include `files` as an array of image files (if images are uploaded), and `session` for database transaction context.
   * @param res - The Express response object.
   * @returns Sends a JSON response with a status of 201 and a success message, indicating successful article creation.
   */
  public async newArticle(req: Request, res: Response): Promise<void> {
    const { title, content } = req.body
    const author = req.user!._id
    let imageNames

    if (req.files) { 
      const titleSlug = getSlug(title, { lang: 'fr' })
      await imageService.createOrResetFolder(`articles/${titleSlug}`)
      imageNames = await imageService.saveImages(`articles/${titleSlug}`, req.files, false)
    }

    await articleRepository.newArticle(title, content, author, {session: req.session, imageNames})
    const { statusCode, message } = responseService.getStatusCodeAndMessage('articles', 'newArticle', 'success')
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
      const { statusCode, message } = responseService.getStatusCodeAndMessage('articles', 'getArticleBySlug', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    res.status(200).send(article)
  }

  /**
   * Updates an existing article identified by its slug. Extracts the new title and content of the article from the request body, and the author's ID from the authenticated user.
   * @param req - The Express request object, which must include `title` and `content` in `req.body`, the `slug` in `req.params`, and the user's ID in `req.user!._id`.
   * @param res - The Express response object.
   * @returns Sends the updated article or an error message if no article is found.
   */
  public async updateArticle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const { title, content } = req.body
    const author = req.user!._id 
    const article = await articleRepository.findBySlugAndUpdate(slug, title, content, author, { session: req.session })
    if (!article) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('articles', 'updateArticle', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    res.status(200).send(article)
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
      const { statusCode, message } = responseService.getStatusCodeAndMessage('articles', 'deleteArticle', 'notFound')
      res.status(statusCode).json({message})
      return
    }
    await imageService.deleteImages('articles', article.imageNames)
    const { statusCode, message } = responseService.getStatusCodeAndMessage('articles', 'deleteArticle', 'success')
    res.status(statusCode).json({message})
  }

}

export default new ArticleController
