import { Request } from 'express'
import multer from 'multer'

const typesAllowed: {[key: string]: string} = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
}

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
 * Creates and configures an instance of multer with memory storage and a file filter.
 * @param multiple - An optional parameter that determines the maximum number of files to upload.
 * @returns Returns either a middleware for a single file or a middleware for multiple files.
 */
export default (multiple?: number) => {
  const upload = multer({
  fileFilter: fileFilter,
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 1024 * 1024 * 5
  }})
  return multiple ? upload.array('images', multiple) : upload.single('image')
}