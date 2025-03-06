import { CommentModel, CommentSchema } from '../models/comment.model'
import articleRepository from './article.repository'
import mongoose, { DeleteResult } from 'mongoose'
import { CommentContentType } from '../models/comment.model'
import likeRepository from './like.repository'
import { LikeContentType } from '../models/like.model'

/**
 * Repository class for managing comments. Provides comprehensive functions for creating, updating,
 * deleting, and querying comments within the database, as well as managing related likes and nested comments.
 */
export class CommentRepository {

  /**
   * Adds a new comment to the database and associates it with a target content.
   * If the content type is an article, it also adds the comment ID to the corresponding article.
   * @param author - The ObjectId of the comment's author.
   * @param contentType - The type of the content (e.g., Article, Comment) the comment is associated with.
   * @param targetId - The ObjectId of the target content the comment is associated with.
   * @param content - The textual content of the comment.
   * @param parentComment - Optional ObjectId of a parent comment, making this comment a nested reply.
   * @returns The saved comment document.
   */
  public async addComment(
    author: mongoose.Types.ObjectId,
    contentType: CommentContentType, 
    targetId: mongoose.Types.ObjectId, 
    content: string,
    parentComment?: mongoose.Types.ObjectId
  ): Promise<CommentSchema> {

    const comment = new CommentModel({author, contentType, targetId, content})
    if (parentComment) { comment.parentComment = parentComment }
    await comment.save()
    if (contentType === 'Article') {
      await articleRepository.addCommentId(targetId, comment._id)
    }
    return comment
  } 

  /**
   * Updates the content of an existing comment.
   * @param commentId - The ObjectId of the comment to update.
   * @param author - The ObjectId of the comment's author to ensure only the author can update the comment.
   * @param content - The new content to update in the comment.
   * @returns The updated comment document or null if no comment was found.
   */
  public async updateComment(
    commentId: mongoose.Types.ObjectId, 
    author: mongoose.Types.ObjectId, 
    content: string
  ): Promise<CommentSchema | null> {

    return await CommentModel.findOneAndUpdate({ _id: commentId, author }, { content }, { new: true })
  }

  /**
   * Deletes a comment by its ID and author. Also removes all related likes and nested comments.
   * @param commentId - The ObjectId of the comment to delete.
   * @param author - The ObjectId of the author to ensure only the author can delete the comment.
   * @param contentType - The type of the content to which the comment is associated for likes deletion.
   * @returns An object containing the result of the deletion operation.
   */
  public async deleteCommentById(
    commentId: mongoose.Types.ObjectId, 
    author: mongoose.Types.ObjectId,
    contentType: LikeContentType
  ): Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID

    const comment = await CommentModel.deleteOne({ _id: commentId, author })
    if (comment.deletedCount > 0) {
      await likeRepository.deleteAllLikesByTargetId(commentId, contentType)
      await this.deleteAllCommentByParentComment(commentId)
    }
    return comment
  }

  /**
   * Deletes all comments that are replies to a given parent comment.
   * @param parentComment - The ObjectId of the parent comment.
   * @returns The result of the deletion operation.
   */
  public async deleteAllCommentByParentComment(parentComment: mongoose.Types.ObjectId) {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID

    const comments = await CommentModel.find({ parentComment })
    const likeIds = comments.reduce((acc: mongoose.Types.ObjectId[], comment) => {
      acc.push(...comment.likes as mongoose.Types.ObjectId[])
      return acc
    }, [])
    if (likeIds.length > 0) {
      await likeRepository.deleteAllLikesByIds(likeIds, 'Comment' as LikeContentType);
    }
    return await CommentModel.deleteMany({ parentComment })
  }

  /**
   * Deletes all comments associated with a specific target content ID across all content types.
   * This method also handles the deletion of all likes associated with those comments to maintain data integrity.
   * The logic checks if there are any parent comments and recursively deletes any nested comments.
   * @param targetId - The ObjectId of the target content.
   * @param contentType - The type of the content associated with the comments to manage related likes.
   * @returns The result of the deletion operation, including the count of comments deleted.
   */
  public async deleteAllCommentsByTargetId(
    targetId: mongoose.Types.ObjectId, 
    contentType: LikeContentType
  ):  Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID

    const comments = await CommentModel.find({ targetId })

    // Est-ce utile dans cette logique de chercher le parent vu qu'on supprrime tout avec targetId?
    for (const comment of comments) {
      await this.deleteAllCommentByParentComment(comment.parentComment as mongoose.Types.ObjectId)
    }

    const likeIds = comments.reduce((acc: mongoose.Types.ObjectId[], comment) => {
      acc.push(...comment.likes as mongoose.Types.ObjectId[])
      return acc
    }, [])
    if (likeIds.length > 0) {
      await likeRepository.deleteAllLikesByIds(likeIds, contentType);
    }
    return await CommentModel.deleteMany({ targetId })
  }

  /**
   * Adds a like ID to a specific comment, ensuring no duplicates through the $addToSet operator.
   * @param idComment - The ObjectId of the comment to which the like is being added.
   * @param idLike - The ObjectId of the like to add.
   * @returns The updated comment document or null if the comment doesn't exist.
   */
  public async addLikeId(
    idComment: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<CommentSchema | null> {

    return await CommentModel.findByIdAndUpdate(
      idComment,
      { $addToSet: { likes: idLike } },
      {new: true})
  } 

  /**
   * Removes a like ID from a specific comment using the $pull operator to ensure the like is removed accurately.
   * @param idComment - The ObjectId of the comment from which the like is being removed.
   * @param idLike - The ObjectId of the like to remove.
   * @returns The updated comment document or null if the comment doesn't exist.
   */
  public async deleteLikeId(    
    idComment: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<CommentSchema | null> {

    return await CommentModel.findByIdAndUpdate(
      idComment,
      { $pull: { likes: idLike}},
      { new: true })
  }

}

export default new CommentRepository()