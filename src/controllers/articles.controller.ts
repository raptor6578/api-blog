import { Request, Response } from 'express'
import articleRepository from '../repositories/article.repository'
import mongoose from 'mongoose'

/**
 * Controller for managing articles.
 */
export class ArticleController {

    /**
   * Creates a new article. Extracts the title and content of the article from the request body, and the author's ID from the authenticated user.
   * @param req - The Express request object, which must include `title` and `content` in `req.body`, and the user's ID in `req.user!._id`.
   * @param res - The Express response object.
   * @returns Sends a JSON response with a status of 201 and a success message.
   */
  public async newArticle(req: Request, res: Response): Promise<void> {
    const { title, content } = req.body
    const author = req.user!._id
    await articleRepository.newArticle(title, content, author)
    res.status(201).json({ message: 'Article created successfully.' })
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
      res.status(404).json({ message: 'Article not found.' })
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
    const article = await articleRepository.findBySlugAndUpdate(slug, title, content, author)
    if (!article) {
      res.status(404).json({ message: 'Article not found.' })
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
    const article = await articleRepository.findBySlugAndDelete(slug, author)
    if (!article) {
      res.status(404).json({ message: 'Article not found.' })
      return
    }
    res.status(200).json({ message: 'Article deleted.' })
  }

}

export default new ArticleController
