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

    const comment = await CommentModel.deleteOne({ _id: commentId, author })
    if (comment.deletedCount > 0) {
      await likeRepository.deleteAllLikesByTargetId(commentId, contentType)
      await this.deleteAllCommentByParentComment(commentId)
    }
    return comment
  }

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