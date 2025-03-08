import { Request, Response } from 'express'
import likeRepository from "../repositories/like.repository"

/**
 * Controller for managing likes associated with various content types.
 */
export class LikeController {

  /**
   * Adds a like to a specific content by a user. Checks if the user has already liked the content before,
   * preventing duplicate likes. The content to be liked is identified by its `targetId`.
   * @param req - The Express request object, which must include `targetId`, `contentType`, and `value` in `req.body`.
   * @param res - The Express response object.
   * @returns A JSON response with a status of 201 indicating that the like was successfully added or 409 if the like already exists.
   */
  public async addLike(req: Request, res: Response): Promise<void> {
    const voter = req.user!._id 
    const { targetId, contentType, value } = req.body

    // TODO: verifier l'existance de targetID

    const isLikeExist = await likeRepository.doesLikeExist(targetId, voter)
    if (isLikeExist) {
      res.status(409).json({ message: "You have already voted for this ID." })
      return
    }
    await likeRepository.addLike(targetId, voter, contentType, value, { session: req.session })
    res.status(201).json({ message: 'successfully liked.' })
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
      res.status(404).json({ message: 'Like not found or not authorized to delete.' })
      return
    }
    res.status(200).send({ message: 'Like deleted successfully.' })
  }

}

export default new LikeController()