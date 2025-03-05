import { CommentModel, CommentSchema } from '../models/comment.model'
import articleRepository from './article.repository'
import mongoose, { DeleteResult } from 'mongoose'
import { ContentType } from '../models/comment.model'

class CommentRepository {

  public async addComment(
    author: mongoose.Types.ObjectId,
    contentType: ContentType, 
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

  public async updateComment() {

  }

  public async deleteComment() {

  }

  public async deleteAllCommentsByTargetId(targetId: mongoose.Types.ObjectId):  Promise<DeleteResult> {
    return await CommentModel.deleteMany({ targetId })
  }

}

export default new CommentRepository()