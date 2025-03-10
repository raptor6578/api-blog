import { Request } from 'express'
import multer from 'multer'
import slugify from 'speakingurl'
import path from 'path'

/**
 * A mapping of MIME types to their corresponding file extensions.
 */
const typesAllowed: {[key: string]: string} = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

/**
 * A file filter function that checks if the uploaded file's MIME type is supported.
 * 
 * @param req - The request object.
 * @param file - The uploaded file.
 * @param callback - A callback function to indicate whether the file should be accepted.
 *                   Pass an error if the file should be rejected.
 */
const fileFilter = (
  req: Request, 
  file: Express.Multer.File, 
  callback: multer.FileFilterCallback
) => {
  const mimeType = file.mimetype
  if (!typesAllowed[mimeType]) {
    callback(new Error('Unsupported file type.'))
    return
  }
  callback(null, true)
}

/**
 * Configuration for multer disk storage, to specify the destination and filename of the uploaded files.
 */
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images/temp')
  },
  filename: (req, file, callback) => {
    const originalName = file.originalname
    const fileExtension = path.extname(originalName)
    const baseName = path.basename(originalName, fileExtension)
    const sanitizeFilename = slugify(baseName)
    const newName = `${Date.now()}-${sanitizeFilename}${fileExtension}`
    if (!req.imageNames) {
      req.imageNames = []
    }
    req.imageNames.push(newName)
    callback(null, newName)
  }
}) 

/**
 * Multer configuration to handle images uploads using the specified storage configuration,
 * file filter function, and file size limit.
 */
export default multer({
  fileFilter: fileFilter,
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  }
})
.array('images', 20)
