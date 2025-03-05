import { DeleteResult } from 'mongoose'
import { LikeModel, LikeSchema, LikeContentType, ValueType } from '../models/like.model'
import articleRepository from './article.repository'
import commentRepository from './comment.repository'
import mongoose from 'mongoose'

class LikeRepository {

  public async addLike(
    targetId: mongoose.Types.ObjectId,
    voter: mongoose.Types.ObjectId, 
    contentType: LikeContentType, 
    value: ValueType
  ): Promise<LikeSchema> {

    const like = new LikeModel({targetId, voter, contentType, value})
    await like.save()
    if (contentType === 'Article') {
      await articleRepository.addLikeId(targetId, like._id)
    }
    if (contentType === 'Comment') {
      await commentRepository.addLikeId(targetId, like._id)
    }
    return like
  }

  public async deleteLikeById(
    likeId: mongoose.Types.ObjectId, 
    voter: mongoose.Types.ObjectId
  ): Promise<LikeSchema | null> {

    const like = await LikeModel.findOneAndDelete({_id: likeId, voter})
    if (like) {
      if (like.contentType === 'Article') {
        await articleRepository.deleteLikeId(like.targetId, likeId)
      }
      if (like.contentType === 'Comment') {
        await commentRepository.deleteLikeId(like.targetId, likeId)
      }
    }
    return like
  }

  public async deleteAllLikesByTargetId(
    targetId: mongoose.Types.ObjectId, 
    contentType: LikeContentType
  ):  Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID

    return await LikeModel.deleteMany({ targetId })
  }

  public async deleteAllLikesByIds(
    likeIds: Array<mongoose.Types.ObjectId>, 
    contentType: LikeContentType
  ): Promise<DeleteResult> {

    // TODO: Verifier si targetId existe toujours et si oui supprimer les ID

    return await LikeModel.deleteMany({ _id: { $in: likeIds } });
  }

}

export default new LikeRepository()