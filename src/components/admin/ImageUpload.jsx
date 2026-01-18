'use client'

import { useState, useRef } from 'react'
import { useAlert } from '@/contexts/AlertContext'
import Image from 'next/image'

const ImageUpload = ({ 
  onUploadComplete, 
  type = 'products', 
  currentImage = null,
  label = 'Upload Image',
  className = ''
}) => {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState(currentImage)
  const fileInputRef = useRef(null)
  const { showSuccess, showError } = useAlert()

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(file.type)) {
      showError('Invalid File Type', 'Please upload a JPEG, PNG, WebP, or GIF image')
      return
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (file.size > maxSize) {
      showError('File Too Large', 'Image size must be less than 10MB')
      return
    }

    // Show preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload to server
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const result = await response.json()

      if (result.success) {
        showSuccess('Upload Successful', 'Image uploaded successfully')
        onUploadComplete(result.data.url)
      } else {
        showError('Upload Failed', result.error || 'Failed to upload image')
        setPreview(currentImage) // Reset preview on error
      }
    } catch (error) {
      console.error('Upload error:', error)
      showError('Upload Failed', 'An error occurred while uploading the image')
      setPreview(currentImage) // Reset preview on error
    } finally {
      setUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onUploadComplete('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      <div className="flex items-start gap-4">
        {/* Upload Button */}
        <div className="flex-shrink-0">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
            id={`file-upload-${type}`}
          />
          <label
            htmlFor={`file-upload-${type}`}
            className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium transition-all duration-200 ${
              uploading 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {uploading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                Choose File
              </>
            )}
          </label>
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative group">
            <div className="relative w-32 h-32 border-2 border-gray-200 rounded-lg overflow-hidden">
              <Image
                src={preview}
                alt="Preview"
                fill
                sizes="128px"
                className="object-cover"
                unoptimized={preview.startsWith('data:')}
              />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors duration-200 shadow-lg"
              title="Remove image"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Supported formats: JPEG, PNG, WebP, GIF • Max size: 10MB
      </p>
    </div>
  )
}

export default ImageUpload

