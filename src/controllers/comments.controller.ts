import { Request, Response } from 'express'
import commentRepository from '../repositories/comment.repository'

class CommentsController {

  public async addComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    const { contentType, targetId, content } = req.body
    await commentRepository.addComment(author, contentType, targetId, content)
    res.status(201).json({ message: 'Comment created successfully.' })
  } 

  public async updateComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    await commentRepository.updateComment()
  }

  public async deleteComment(req: Request, res: Response): Promise<void> {
    const author = req.user!._id 
    await commentRepository.deleteComment()
  }
  
}

export default new CommentsController()