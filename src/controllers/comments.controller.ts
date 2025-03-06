import { Request, Response } from 'express'
import commentRepository from '../repositories/comment.repository'

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
   * @returns A JSON response with a status of 201 indicating successful comment creation.
   */
  public async addComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { contentType, targetId, content, parentComment } = req.body

    // TODO: verifier l'existance de targetID

    await commentRepository.addComment(author, contentType, targetId, content, parentComment)
    res.status(201).json({ message: 'Comment created successfully.' })
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
    const comment = await commentRepository.updateComment(commentId, author, content)
    if (!comment) {
      res.status(404).json({ message: 'Comment not found.' })
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
    const comment = await commentRepository.deleteCommentById(commentId, author, contentType)
    if (comment.deletedCount === 0) {
      res.status(404).json({ message: 'Comment not found or not authorized to delete.' })
      return
    }
    res.status(200).send({ message: 'Comment deleted successfully.' })
  }

}

export default new CommentsController()