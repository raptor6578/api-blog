import { Request, Response } from 'express'
import commentRepository from '../repositories/comment.repository'
import responseService from '../services/response.service'

/**
 * Controller for managing comments.
 */
export class CommentsController {

  /**
   * Adds a new comment to the system. Expects the comment details to be provided in the request body,
   * including the type of content being commented on, the target ID of the content, the comment content,
   * and optionally, a parent comment ID for nested comments.
   * @param req - The Express request object, which must include `contentType`, `targetId`, `content`, and optionally `parentComment` in `req.body`.
   * @param res - The Express response object.
   * @returns A JSON response with a status of 201 indicating successful comment creation or an error message.
   */
  public async addComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { contentType, targetId, content, parentComment } = req.body
    const doesTargetAvailable = await commentRepository.doesTargetAvailable(targetId, contentType)
    if (!doesTargetAvailable) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('comments', 'addComment', 'targetIdOrContentTypeIsNotAvailable')
      res.status(statusCode).json({message})
      return
    } 
    if (parentComment) {
      const doesParentAvailable = await commentRepository.doesCommentAvailable(parentComment, targetId)
      if (!doesParentAvailable) {
        const { statusCode, message } = responseService.getStatusCodeAndMessage('comments', 'addComment', 'parentCommentIsNotFound')
        res.status(statusCode).json({message})
        return
      } 
    }
    await commentRepository.addComment(author, contentType, targetId, content, {session: req.session, parentComment})
    const { statusCode, message } = responseService.getStatusCodeAndMessage('comments', 'addComment', 'success')
    res.status(statusCode).json({message})
  } 

  /**
   * Updates an existing comment by its ID. Only the author of the comment can update it.
   * @param req - The Express request object, which must include `commentId` and `content` in `req.body`.
   * @param res - The Express response object.
   * @returns Sends the updated comment or an error message if the comment is not found.
   */
  public async updateComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { commentId, content } = req.body
    const comment = await commentRepository.updateComment(commentId, author, content, { session: req.session })
    if (!comment) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('comments', 'updateComment', 'commentNotFound')
      res.status(statusCode).json({message})
      return
    }
    res.status(200).send(comment)
  }

  /**
   * Deletes a comment by its ID. Verifies that the requester is the author or has appropriate permissions
   * before deleting the comment. Also requires the type of content associated with the comment.
   * @param req - The Express request object, which must include `commentId` and `contentType` in `req.body`.
   * @param res - The Express response object.
   * @returns A JSON response indicating success or failure of the comment deletion.
   */
  public async deleteComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { commentId, contentType } = req.body
    const comment = await commentRepository.deleteCommentById(commentId, author, contentType, { session: req.session })
    if (!comment) {
      const { statusCode, message } = responseService
        .getStatusCodeAndMessage('comments', 'deleteComment', 'commentNotFoundOrNotAuthorizedToDelete')
      res.status(statusCode).json({message})
      return
    }
    const { statusCode, message } = responseService.getStatusCodeAndMessage('comments', 'deleteComment', 'success')
    res.status(statusCode).json({message})
  }

}

export default new CommentsController()