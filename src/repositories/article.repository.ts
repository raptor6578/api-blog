import mongoose from 'mongoose'
import { ArticleModel, ArticleSchema } from '../models/article.model'
import commentRepository from '../repositories/comment.repository'

class ArticleRepository {

  public async newArticle(
    title: string, 
    content: string, 
    author: mongoose.Types.ObjectId
  ): Promise<ArticleSchema> {

    const article = new ArticleModel({ title, content, author })
    await article.save()
    return article
  }

  public async getAll(): Promise<ArticleSchema[]> {
    return await ArticleModel.find()
        .populate('author')
        .populate('comments')
        .populate('likes')
  }

  public async getArticleBySlug(slug: string): Promise<ArticleSchema | null> {
   return await ArticleModel.findOne({ slug })
      .populate('author')
      .populate({
        path: 'comments',
        populate: { path: 'author likes' }
      })
      .populate('likes')
  }

  public async findBySlugAndUpdate(
    slug: string, 
    title: string, 
    content: string, 
    author: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findOneAndUpdate(
      { slug, author }, 
      { title, content }, 
      { new: true })
  } 

  public async addCommentId(
    idArticle: mongoose.Types.ObjectId, 
    idComment: mongoose.Types.ObjectId
  ): Promise<boolean> {

    const article = await ArticleModel.findByIdAndUpdate(idArticle, {new: true})
    let status
    if (article) { 
      article.comments.push(idComment) 
      article.save()
      status = true
    } else {
      status = false
    }
    return status
  }

  public async findBySlugAndDelete(
    slug: string, 
    author: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    const article = await ArticleModel.findOneAndDelete({ slug, author })
    if (article) {
      await commentRepository.deleteAllCommentsByTargetId(article._id)
    }
    return article
  }

}

export default new ArticleRepository()