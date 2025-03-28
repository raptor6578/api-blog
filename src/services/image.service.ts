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
   * Saves a single image file to the specified directory path. The filename is sanitized and can be made unique by
   * appending a timestamp to it. The image is saved in the server's filesystem.
   * @param pathName - The directory path within the server where the image file will be saved.
   * @param imageFile - The image file to save, which should be of type Express.Multer.File.
   * @param unique - A boolean indicating whether to make the filename unique by appending a timestamp.
   * @returns The filename under which the image was saved. This includes a sanitized version of the original filename,
   *          optionally with a timestamp for uniqueness.
   * @throws This method can throw errors related to file operations, especially if the input is not as expected or if there are
   *         issues with the filesystem such as permission errors or insufficient storage space.
   */
  public async saveImage(pathName: string, imageFile: Express.Multer.File, unique = true): Promise<string> {
      const originalName = imageFile.originalname
      const fileExtension = path.extname(originalName)
      const baseName = path.basename(originalName, fileExtension)
      const sanitizeFilename = slugify(baseName)
      let imageName = `${sanitizeFilename}${fileExtension}`
      if (unique) {
        imageName = `${Date.now()}-${sanitizeFilename}${fileExtension}`
      }
      await fs.promises.writeFile(`images/${pathName}/${imageName}`, imageFile.buffer)
      return imageName
  }

  /**
   * Saves multiple image files to the specified directory path. The filenames are sanitized and can be made unique by
   * appending a timestamp to them. The images are saved in the server's filesystem.
   * @param pathName - The directory path within the server where the image files will be saved.
   * @param imageFiles - An array of image files to save, which should be of type Express.Multer.File.
   * @param unique - A boolean indicating whether to make the filenames unique by appending a timestamp.
   * @returns An array of filenames under which the images were saved. These include sanitized versions of the original filenames,
   *          optionally with timestamps for uniqueness.
   */
  public async saveImages(
    pathName: string, 
    imageFiles: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[],
    unique = true
  ): Promise<string[]> {

    const imageNames = []
    if (Array.isArray(imageFiles)) {
      const promises = imageFiles.map(imageFile => this.saveImage(pathName, imageFile, unique))
      return await Promise.all(promises);
    } else {
      for (const field in imageFiles) {
        const files = imageFiles[field]
        const promises = files.map(file => this.saveImage(pathName, file, unique))
        const names = await Promise.all(promises)
        imageNames.push(...names);
      }
      return imageNames
    }
  }


  /**
   * Creates a new directory or resets an existing one by removing its contents.
   * This method first checks if the directory exists, and if it does, it removes all its contents recursively.
   * After that, it creates a new directory with the specified path.
   * @param dirPath - The path of the directory to create or reset.
   * @returns A Promise that resolves to true if the operation was successful.
   */
  public async createOrResetFolder(dirPath: string): Promise<boolean> {
    try {
      await fs.promises.access(`images/${dirPath}`);
      await fs.promises.rm(`images/${dirPath}`, { recursive: true, force: true })
    } catch (err: any) {
      if (err.code !== 'ENOENT') {
        throw err
      }
    }
    await fs.promises.mkdir(`images/${dirPath}`, { recursive: true })
    return true
  }
  

}

export default new imageService()
