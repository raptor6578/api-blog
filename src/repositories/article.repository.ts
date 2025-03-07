import mongoose from 'mongoose'
import { ArticleModel, ArticleSchema } from '../models/article.model'
import commentRepository from '../repositories/comment.repository'
import likeRepository from './like.repository'
import { LikeContentType } from '../models/like.model'

/**
 * Repository class for managing articles. Provides functions for creating, updating, deleting,
 * and querying articles within the database, as well as managing related comments and likes.
 */
export class ArticleRepository {

  /**
   * Creates a new article with given title, content, and author.
   * @param title - Title of the article.
   * @param content - Content of the article.
   * @param author - ObjectId of the author creating the article.
   * @param session - Optional ClientSession for the transaction.
   * @returns The saved article document.
   */
  public async newArticle(
    title: string, 
    content: string, 
    author: mongoose.Types.ObjectId,
  ): Promise<ArticleSchema> {

    const article = new ArticleModel({ title, content, author })
    await article.save()
    return article
  }

  /**
   * Deletes an article based on its slug and author.
   * Also deletes all associated comments and likes.
   * @param slug - Slug of the article to be deleted.
   * @param author - ObjectId of the author of the article.
   * @returns The deleted article document or null if not found.
   */
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

  /**
   * Retrieves all articles from the database, populated with author, comments, and likes.
   * @returns An array of article documents.
   */
  public async getAll(): Promise<ArticleSchema[]> {
    return await ArticleModel.find()
        .populate('author')
        .populate('comments')
        .populate('likes')
  }

  /**
   * Retrieves a single article by its slug, populated with author and detailed comment and like information.
   * @param slug - Slug of the article to retrieve.
   * @returns The found article document or null if not found.
   */
  public async getArticleBySlug(slug: string): Promise<ArticleSchema | null> {
   return await ArticleModel.findOne({ slug })
      .populate('author')
      .populate({
        path: 'comments',
        populate: { path: 'author likes' }
      })
      .populate('likes')
  }

  /**
   * Updates an article's title and content based on its slug and author.
   * @param slug - Slug of the article to update.
   * @param title - New title for the article.
   * @param content - New content for the article.
   * @param author - ObjectId of the author of the article.
   * @returns The updated article document or null if not found.
   */
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

  /**
   * Adds a comment ID to the specified article. This method uses the MongoDB $addToSet operation
   * to ensure the comment ID is added without duplication.
   * @param idArticle - The ObjectId of the article to which the comment is being added.
   * @param idComment - The ObjectId of the comment to add to the article.
   * @returns The updated article document or null if the article doesn't exist.
   */
  public async addCommentId(
    idArticle: mongoose.Types.ObjectId, 
    idComment: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $addToSet: { comments: idComment }},
      {new: true})
  }

  /**
   * Removes a comment ID from the specified article. This method uses the MongoDB $pull operation
   * to remove the comment ID from the article's comments array.
   * @param idArticle - The ObjectId of the article from which the comment is being removed.
   * @param idComment - The ObjectId of the comment to remove from the article.
   * @returns The updated article document or null if the article doesn't exist.
   */
  public async deleteCommentId(
    idArticle: mongoose.Types.ObjectId, 
    idComment: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $pull: { comments: idComment }},
      {new: true})
  }

  /**
   * Adds a like ID to the specified article. This method uses the MongoDB $addToSet operation
   * to ensure the like ID is added without duplication.
   * @param idArticle - The ObjectId of the article to which the like is being added.
   * @param idLike - The ObjectId of the like to add to the article.
   * @returns The updated article document or null if the article doesn't exist.
   */
  public async addLikeId(
    idArticle: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<ArticleSchema | null> {

    return await ArticleModel.findByIdAndUpdate(
      idArticle,
      { $addToSet: { likes: idLike } },
      {new: true})
  }

  /**
   * Removes a like ID from the specified article. This method uses the MongoDB $pull operation
   * to remove the like ID from the article's likes array.
   * @param idArticle - The ObjectId of the article from which the like is being removed.
   * @param idLike - The ObjectId of the like to remove from the article.
   * @returns The updated article document or null if the article doesn't exist.
   */
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

export default new ArticleRepository