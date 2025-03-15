import fs from 'fs'
import path from 'path'
import slugify from 'speakingurl'


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
   * @param pathName The directory from which the images should be deleted.
   * @param imageNames An array of image filenames to delete.
   * @returns A Promise that resolves when all delete operations have completed.
   */
  public async deleteImages(pathName: string, imageNames: string[]): Promise<void> {
    await Promise.all(imageNames.map(imageName => {
      return fs.promises.unlink(`images/${pathName}/${imageName}`)
    }))
  }

  /**
   * Saves a single image file to the specified directory path with a sanitized and timestamped filename.
   * This method takes an image file from the request, sanitizes the original file name to create a unique filename,
   * and then writes the file to the designated directory in the server's filesystem.
   * @param pathName - The directory path within the server where the image file will be saved.
   * @param imageFile - The image file object received from the client, expected to be of type Express.Multer.File.
   * @returns The filename under which the image was saved, constructed by appending a timestamp and a sanitized version of the original filename to ensure uniqueness.
   * @throws This method can throw errors related to file write operations, such as permission issues or disk full errors.
   */
  public async saveImage(pathName: string, imageFile: Express.Multer.File): Promise<string> {
      const originalName = imageFile.originalname
      const fileExtension = path.extname(originalName)
      const baseName = path.basename(originalName, fileExtension)
      const sanitizeFilename = slugify(baseName)
      const imageName = `${Date.now()}-${sanitizeFilename}${fileExtension}`
      await fs.promises.writeFile(`images/${pathName}/${imageName}`, imageFile.buffer)
      return imageName
  }

  /**
   * Saves multiple image files to the specified directory path. This method can handle both an array of image files or
   * an object with properties as arrays of image files. Each file is processed in parallel to improve performance,
   * and each is saved with a unique, sanitized, and timestamped filename.
   * @param pathName - The directory path within the server where the image files will be saved.
   * @param imageFiles - Either an array of image files or an object with properties as arrays of image files.
   *                      Each file should be of type Express.Multer.File.
   * @returns An array of filenames under which the images were saved. Each filename is constructed by appending a timestamp
   *          and a sanitized version of the original filename to ensure uniqueness.
   * @throws This method can throw errors related to file operations, especially if the input is not as expected or if there are
   *         issues with the filesystem such as permission errors or insufficient storage space.
   */
  public async saveImages(
    pathName: string, 
    imageFiles: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[]
  ): Promise<string[]> {

    const imageNames = [];
    if (Array.isArray(imageFiles)) {
      const promises = imageFiles.map(imageFile => this.saveImage(pathName, imageFile));
      return await Promise.all(promises);
    } else {
      for (const field in imageFiles) {
        const files = imageFiles[field]
        const promises = files.map(file => this.saveImage(pathName, file))
        const names = await Promise.all(promises)
        imageNames.push(...names);
      }
      return imageNames
    }
  }


}

export default new imageService()
