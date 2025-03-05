import { Request, Response } from 'express'
import likeRepository from "../repositories/like.repository"

class LikeController {
  public async addLike(req: Request, res: Response): Promise<void> {
    const voter = req.user!._id 
    const { targetId, contentType, value } = req.body
    await likeRepository.addLike(targetId, voter, contentType, value)
    res.status(201).json({ message: 'successfully liked.' })
  }

  public async deleteLike(req: Request, res: Response): Promise<void> {
    const voter = req.user!._id 
    const { targetId } = req.body
    const like = await likeRepository.deleteLikeById(targetId, voter)
    if (!like) {
      res.status(404).json({ message: 'Like not found or not authorized to delete.' })
      return
    }
    res.status(200).send({ message: 'Like deleted successfully.' })
  }

}

export default new LikeController()