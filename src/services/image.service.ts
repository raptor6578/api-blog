import fs from 'fs';

/**
 * Service for managing image operations.
 */
export class imageService {

  /**
   * Moves a list of images from a temporary directory to a new path.
   * This method operates synchronously, which may block the Node.js thread if the operation is lengthy.
   * Use this method with caution in production environments.
   *
   * @param imageNames An array containing the names of the image files to be moved.
   * @param newPath The path to the destination folder where the images will be moved.
   *                This path should be relative to the `images/` directory.
   */
  public async moveTempTo(imageNames: string[], newPath: string): Promise<void> {
    for (const imageName of imageNames) {
      const oldPath = `images/temp/${imageName}`
      const destinationPath = `images/${newPath}/${imageName}`
      fs.renameSync(oldPath, destinationPath)
    }
  }

}

export default new imageService()