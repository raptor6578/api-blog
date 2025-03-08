import { DeleteResult } from 'mongoose'
import { LikeModel, LikeSchema, ValueType } from '../models/like.model'
import articleRepository from './article.repository'
import commentRepository from './comment.repository'
import mongoose from 'mongoose'
import { ContentType } from '../enums/contentType.enum'

/**
 * Repository class for managing like entities. Provides functionality for adding, checking,
 * and deleting likes in relation to different content types such as articles and comments.
 */
export class LikeRepository {

  /**
   * Adds a like to a specific content (article or comment) and records the voter's action.
   * This method also updates the corresponding article or comment to reflect the new like.
   * @param targetId - The ObjectId of the content being liked.
   * @param voter - The ObjectId of the user who is liking the content.
   * @param contentType - The type of content being liked (Article or Comment).
   * @param value - The type of vote (Up = 1, Down = -1).
   * @param options - Optional parameters for the operation.
   * @param options.session - An optional MongoDB session for transactions.
   * @returns The saved like document.
   */
  public async addLike(
    targetId: mongoose.Types.ObjectId,
    voter: mongoose.Types.ObjectId, 
    contentType: ContentType, 
    value: ValueType,
    options: { session?: mongoose.ClientSession }
  ): Promise<LikeSchema> {

    const like = new LikeModel({targetId, voter, contentType, value})
    await like.save()
    switch (contentType) {
      case 'Article':
        await articleRepository.addLikeId(targetId, like._id, options)
        break
      case 'Comment':
        await commentRepository.addLikeId(targetId, like._id, options)
        break
    }
    return like
  }

  /**
   * Checks if a like already exists for a given target content and voter.
   * @param targetId - The ObjectId of the content.
   * @param voter - The ObjectId of the user.
   * @returns A boolean indicating whether the like exists.
   */
  public async doesLikeExist(
    targetId: mongoose.Types.ObjectId,
    voter: mongoose.Types.ObjectId,
  ): Promise<boolean> {

    const like = await LikeModel.findOne({ targetId, voter })
    return !!like
  }

  /**
   * Deletes a like by its ID and associated voter. Also updates the corresponding content
   * to remove the reference to the deleted like.
   * @param likeId - The ObjectId of the like to delete.
   * @param voter - The ObjectId of the user who added the like.
   * @param options - Optional parameters for the operation.
   * @param options.session - An optional MongoDB session for transactions.
   * @returns The deleted like document or null if it was not found.
   */
  public async deleteLikeById(
    likeId: mongoose.Types.ObjectId, 
    voter: mongoose.Types.ObjectId,
    options: { session?: mongoose.ClientSession }
  ): Promise<LikeSchema | null> {

    const like = await LikeModel.findOneAndDelete({_id: likeId, voter}, { session: options.session })
    if (like) {
      switch (like.contentType) {
        case 'Article':
          await articleRepository.deleteLikeId(like.targetId, likeId, options)
          break
        case 'Comment':
          await commentRepository.deleteLikeId(like.targetId, likeId, options)
          break
      }
    }
    return like
  }

  /**
   * Deletes all likes associated with a particular target ID.
   * Warning: Use with caution, it does not delete parent model references.
   * @param targetId - The ObjectId of the content from which all likes are to be removed.
   * @param contentType - The type of the content.
   * @param options - Optional parameters for the operation.
   * @param options.session - An optional MongoDB session for transactions.
   * @returns An object containing the result of the deletion operation.
   */
  public async deleteAllLikesByTargetId(
    targetId: mongoose.Types.ObjectId, 
    contentType: ContentType,
    options: { session?: mongoose.ClientSession }
  ):  Promise<DeleteResult> {

    return await LikeModel.deleteMany({ targetId }, { session: options.session })
  }

  /**
   * Deletes multiple likes based on an array of like IDs.
   * Warning: Use with caution, it does not delete parent model references.
   * @param likeIds - Array of ObjectId representing the likes to delete.
   * @param contentType - The type of the content associated with the likes (used for logging or additional checks).
   * @param options - Optional parameters for the operation.
   * @param options.session - An optional MongoDB session for transactions.
   * @returns An object containing the result of the deletion operation.
   */
  public async deleteAllLikesByIds(
    likeIds: Array<mongoose.Types.ObjectId>, 
    contentType: ContentType,
    options: { session?: mongoose.ClientSession }
  ): Promise<DeleteResult> {

    return await LikeModel.deleteMany({ _id: { $in: likeIds } }, { session: options.session });
  }

}

export default new LikeRepository()