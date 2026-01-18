import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

export const config = {
  api: {
    bodyParser: false,
  },
}

/**
 * Parse form data including files
 * @param {Request} req - Next.js request object
 * @param {Object} options - Upload options
 * @returns {Promise<{fields: Object, files: Object}>}
 */
export const parseForm = async (req, options = {}) => {
  const uploadDir = options.uploadDir || path.join(process.cwd(), 'public', 'uploads', 'temp')
  
  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: options.maxFileSize || 10 * 1024 * 1024, // 10MB default
    multiples: options.multiples || true,
    filename: (name, ext, part) => {
      // Generate unique filename: timestamp-random-originalname.ext
      const timestamp = Date.now()
      const random = Math.random().toString(36).substring(2, 8)
      const originalName = part.originalFilename?.replace(/[^a-zA-Z0-9.-]/g, '_') || 'file'
      return `${timestamp}-${random}-${originalName}`
    }
  })

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      resolve({ fields, files })
    })
  })
}

/**
 * Move uploaded file to specific folder
 * @param {Object} file - File object from formidable
 * @param {string} destinationFolder - Destination folder name (products, categories, etc.)
 * @returns {string} Public URL of the uploaded file
 */
export const moveUploadedFile = (file, destinationFolder) => {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', destinationFolder)
  
  // Ensure destination directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true })
  }

  const filename = path.basename(file.filepath)
  const destinationPath = path.join(uploadDir, filename)
  
  // Move file from temp to destination
  fs.renameSync(file.filepath, destinationPath)
  
  // Return public URL
  return `/uploads/${destinationFolder}/${filename}`
}

/**
 * Delete uploaded file
 * @param {string} fileUrl - Public URL of the file to delete
 * @returns {boolean} Success status
 */
export const deleteUploadedFile = (fileUrl) => {
  try {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return false
    
    const filePath = path.join(process.cwd(), 'public', fileUrl)
    
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
      return true
    }
    return false
  } catch (error) {
    console.error('Error deleting file:', error)
    return false
  }
}

/**
 * Validate image file type
 * @param {Object} file - File object
 * @param {Array} allowedTypes - Allowed MIME types
 * @returns {boolean}
 */
export const validateImageType = (file, allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']) => {
  return allowedTypes.includes(file.mimetype)
}

/**
 * Get file size in MB
 * @param {Object} file - File object
 * @returns {number} File size in MB
 */
export const getFileSizeInMB = (file) => {
  return (file.size / (1024 * 1024)).toFixed(2)
}

