import { Request, Response } from 'express'
import articleRepository from '../repositories/article.repository'

class ArticleController {

  public async newArticle(req: Request, res: Response): Promise<void> {
    const { title, content } = req.body
    const author = req.user!._id
    await articleRepository.newArticle(title, content, author)
    res.status(201).json({ message: 'Article created successfully.' })
  }

  public async getAll(req: Request, res: Response): Promise<void> {
    const articles = await articleRepository.getAll()
    res.status(200).json(articles)
  }
  
  public async getArticleById(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const article = await articleRepository.getArticleBySlug(slug)
    if (!article) {
      res.status(404).send('Article not found')
      return
    }
    res.status(200).send(article)
  }

  public async updateArticle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const { title, content } = req.body
    const author = req.user!._id 
    const article = await articleRepository.findBySlugAndUpdate(slug, title, content, author)
    if (!article) {
      res.status(404).send('Article not found')
      return
    }
    res.status(200).send(article)
  }

  public async deleteArticle(req: Request, res: Response): Promise<void> {
    const { slug } = req.params
    const author = req.user!._id
    const article = await articleRepository.findBySlugAndDelete(slug, author)
    if (!article) {
      res.status(404).send('Article not found')
      return
    }
    res.status(200).send('Article deleted')
  }

}

export default new ArticleController()
