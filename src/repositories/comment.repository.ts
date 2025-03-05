import { CommentModel, CommentSchema } from '../models/comment.model'
import articleRepository from './article.repository'
import mongoose, { DeleteResult } from 'mongoose'
import { CommentContentType } from '../models/comment.model'
import likeRepository from './like.repository'
import { LikeContentType } from '../models/like.model'

class CommentRepository {

  public async addComment(
    author: mongoose.Types.ObjectId,
    contentType: CommentContentType, 
    targetId: mongoose.Types.ObjectId, 
    content: string
  ): Promise<CommentSchema> {

    const comment = new CommentModel({author, contentType, targetId, content})
    await comment.save()
    if (contentType === 'Article') {
      await articleRepository.addCommentId(targetId, comment._id)
    }
    return comment
  } 

  public async updateComment(
    commentId: mongoose.Types.ObjectId, 
    author: mongoose.Types.ObjectId, 
    content: string
  ): Promise<CommentSchema | null> {

    return await CommentModel.findOneAndUpdate({ _id: commentId, author }, { content }, { new: true })
  }

  public async deleteCommentById(
    commentId: mongoose.Types.ObjectId, 
    author: mongoose.Types.ObjectId,
    contentType: LikeContentType
  ): Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID
    // Verifier si il existe des commentaires avec pour parent "commentId"

    const comment = await CommentModel.deleteOne({ _id: commentId, author })
    if (comment.deletedCount > 0) {
      await likeRepository.deleteAllLikesByTargetId(commentId, contentType)
    }
    return comment
  }

  public async deleteAllCommentsByTargetId(
    targetId: mongoose.Types.ObjectId, 
    contentType: LikeContentType
  ):  Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID
    // Verifier si il existe des commentaires avec pour parent les "commentId"

    const comments = await CommentModel.find({ targetId })
    const likeIds = comments.reduce((acc: mongoose.Types.ObjectId[], comment) => {
      acc.push(...comment.likes as mongoose.Types.ObjectId[])
      return acc
    }, [])
    if (likeIds.length > 0) {
      await likeRepository.deleteAllLikesByIds(likeIds, contentType);
    }
    return await CommentModel.deleteMany({ targetId })
  }

  public async addLikeId(
    idComment: mongoose.Types.ObjectId, 
    idLike: mongoose.Types.ObjectId
  ): Promise<CommentSchema | null> {

    return await CommentModel.findByIdAndUpdate(
      idComment,
      { $addToSet: { likes: idLike } },
      {new: true})
  } 

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