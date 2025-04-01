import { Request, Response } from 'express'
import likeRepository from "../repositories/like.repository"
import responseService from '../services/response.service'
import articleRepository from '../repositories/article.repository'
import commentRepository from '../repositories/comment.repository'

/**
 * Controller for managing likes associated with various content types.
 */
export class LikeController {


  /**
   * Adds a like to a specific content (article or comment) by a user. The content is identified by its `targetId`.
   * The user must not have already liked the content.
   * @param req - The Express request object, which must include `targetId`, `contentType`, and `value` in `req.body`.
   * @param res - The Express response object.
   * @returns A JSON response containing the newly created like or an error message.
   */
  public async addLike(req: Request, res: Response): Promise<void> {
    const voter = req.user!._id 
    const { targetId, contentType, value } = req.body
    if (contentType === 'Article') {
      const doesArticleExist = await articleRepository.doesArticleExist(targetId)
      if (!doesArticleExist) {
        const { statusCode, message } = responseService.getStatusCodeAndMessage('likes', 'addLike', 'articleNotFound') 
        res.status(statusCode).json({message})
        return
      }
    } else if (contentType === 'Comment') {
      const doesCommentExist = await commentRepository.doesCommentExist(targetId)
      if (!doesCommentExist) {
        const { statusCode, message } = responseService.getStatusCodeAndMessage('likes', 'addLike', 'commentNotFound')
        res.status(statusCode).json({message})
        return
      }
    }
    const isLikeExist = await likeRepository.doesLikeExist(targetId, voter)
    if (isLikeExist) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('likes', 'addLike', 'youHaveAlreadyVoted')
      res.status(statusCode).json({message})
      return
    }
    const like = await likeRepository.addLike(targetId, voter, contentType, value, { session: req.session })
    res.status(201).json(like)
  }

  /**
   * Deletes a like from a specific content by a user. The content from which the like is being removed is identified by its `targetId`.
   * Only the user who added the like can delete it.
   * @param req - The Express request object, which must include `targetId` in `req.body`.
   * @param res - The Express response object.
   * @returns A JSON response indicating whether the like was successfully deleted or not found/authorized.
   */
  public async deleteLike(req: Request, res: Response): Promise<void> {
    const voter = req.user!._id 
    const { targetId } = req.body
    const like = await likeRepository.deleteLikeById(targetId, voter, { session: req.session })
    if (!like) {
      const { statusCode, message } = responseService
        .getStatusCodeAndMessage('likes', 'deleteLike', 'LikeNotFoundOrNotAuthorizedToDelete')
      res.status(statusCode).json({message})
      return
    }
    const { statusCode, message } = responseService.getStatusCodeAndMessage('likes', 'deleteLike', 'success')
    res.status(statusCode).json({message})
  }

}

export default new LikeController()