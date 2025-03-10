import fs from 'fs';

/**
 * A service class for managing image files.
 * Provides functionality to move and delete images stored in the filesystem.
 */
export class imageService {

  /**
   * Moves a list of images from a temporary directory to a new path.
   * This operation is performed asynchronously and uses Promise.all to handle multiple move operations concurrently.
   * 
   * @param imageNames An array of image filenames to move.
   * @param newPath The destination path where the images should be moved.
   * @returns A Promise that resolves when all move operations have completed.
   */
  public async moveTempTo(imageNames: string[], newPath: string): Promise<void> {
    await Promise.all(imageNames.map(imageName => {
      const oldPath = `images/temp/${imageName}`
      const destinationPath = `images/${newPath}/${imageName}`
      return fs.promises.rename(oldPath, destinationPath) 
    }))
  }

  /**
   * Deletes a list of images from a specified directory.
   * This operation is also asynchronous and handles multiple delete operations concurrently using Promise.all.
   * 
   * @param imageNames An array of image filenames to delete.
   * @param path The directory from which the images should be deleted.
   * @returns A Promise that resolves when all delete operations have completed.
   */
  public async deleteImages(imageNames: string[], path: string): Promise<void> {
    await Promise.all(imageNames.map(imageName => {
      return fs.promises.unlink(`images/${path}/${imageName}`)
    }))
  }

}

export default new imageService()
