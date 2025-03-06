import { Request, Response } from 'express'
import commentRepository from '../repositories/comment.repository'

class CommentsController {

  public async addComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { contentType, targetId, content, parentComment } = req.body
    await commentRepository.addComment(author, contentType, targetId, content, parentComment)
    res.status(201).json({ message: 'Comment created successfully.' })
  } 

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