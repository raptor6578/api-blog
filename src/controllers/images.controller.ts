import { Request, Response } from 'express'
import sharp from 'sharp'
import fs from 'fs'
import responseService from '../services/response.service'

/**
 * The `ImagesController` class provides methods to manage image retrieval and manipulation.
 */
export class ImagesController {

  /**
   * Retrieves an image, resizes it to the specified dimensions, and returns it to the client.
   * 
   * @param req The HTTP request object, expected to include `path`, `width`, `height`, and `imageName` parameters.
   * @param res The HTTP response object used to send back the image or an error message.
   * 
   * @remarks
   * The method first constructs the file path using the provided `path` and `imageName`, and checks if the image exists.
   * If the image does not exist, it responds with a 404 status and a message indicating the image is not found.
   * If the `width` or `height` parameters are not valid integers, it responds with a 400 status and an error message.
   * Otherwise, it uses the `sharp` library to resize the image to the requested dimensions with a white background,
   * maintains the aspect ratio, and sends the resized image back to the client in its original format.
   */
  public getImage = async(req: Request, res: Response): Promise<void> => {
    const { path, width, height, imageName } = req.params
    const imagePath = `./images/${path}/${imageName}`

    if (!fs.existsSync(imagePath)) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('images', 'getImage', 'notFound')
      res.status(statusCode).json({ message })
      return
    }
    if (!/^\d+$/.test(width) || !/^\d+$/.test(height)) {
      const { statusCode, message } = responseService.getStatusCodeAndMessage('images', 'getImage', 'invalidDimensions')
      res.status(statusCode).json({ message })
      return
    }
    const widthNumber = parseInt(width)
    const heightNumber = parseInt(height)
    const image = await sharp(imagePath)
      .resize({
        width: widthNumber, 
        height: heightNumber,
        fit: sharp.fit.contain,
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toBuffer()

    const metadata = await sharp(image).metadata()
    res.type(`image/${metadata.format}`).status(200).send(image)
    return
  }
}

export default new ImagesController
