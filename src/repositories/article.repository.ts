import mongoose from 'mongoose'
import { ArticleModel, ArticleSchema } from '../models/article.model'
import commentRepository from '../repositories/comment.repository'
import likeRepository from './like.repository'
import { LikeContentType } from '../models/like.model'

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

  public async findBySlugAndDelete(
    slug: string, 
    author: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    const article = await ArticleModel.findOneAndDelete({ slug, author })
    if (article) {
      await commentRepository.deleteAllCommentsByTargetId(article._id, 'Article' as LikeContentType)
      await likeRepository.deleteAllLikesByTargetId(article._id, 'Article' as LikeContentType)
    }
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
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $addToSet: { comments: idComment }},
      {new: true})
  }

  public async deleteCommentId(
    idArticle: mongoose.Types.ObjectId, 
    idComment: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $pull: { comments: idComment }},
      {new: true})
  }

  public async addLikeId(
    idArticle: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $addToSet: { likes: idLike } },
      {new: true})
  }

  public async deleteLikeId(    
    idArticle: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $pull: { likes: idLike}},
      { new: true })
  }

}

export default new ArticleRepository()