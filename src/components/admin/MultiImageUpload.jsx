'use client'

import { useState, useRef } from 'react'
import { useAlert } from '@/contexts/AlertContext'
import Image from 'next/image'

const MultiImageUpload = ({ 
  images = [], 
  onImagesChange, 
  type = 'products',
  maxImages = 5
}) => {
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  const { showSuccess, showError } = useAlert()

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Check max images limit
    if (images.length + files.length > maxImages) {
      showError('Too Many Images', `You can upload maximum ${maxImages} images`)
      return
    }

    // Validate each file
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        showError('Invalid File Type', `${file.name} is not a valid image format`)
        return
      }
      if (file.size > maxSize) {
        showError('File Too Large', `${file.name} exceeds 10MB limit`)
        return
      }
    }

    setUploading(true)
    const uploadedImages = []

    try {
      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('type', type)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        })

        const result = await response.json()

        if (result.success) {
          uploadedImages.push({
            url: result.data.url,
            alt: '',
            isPrimary: images.length === 0 && uploadedImages.length === 0,
            sortOrder: images.length + uploadedImages.length + 1
          })
        } else {
          showError('Upload Failed', result.error || `Failed to upload ${file.name}`)
        }
      }

      if (uploadedImages.length > 0) {
        showSuccess('Upload Successful', `${uploadedImages.length} image(s) uploaded successfully`)
        onImagesChange([...images, ...uploadedImages])
      }
    } catch (error) {
      console.error('Upload error:', error)
      showError('Upload Failed', 'An error occurred while uploading images')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    // If we removed the primary image, make the first one primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true
    }
    onImagesChange(newImages)
  }

  const handleSetPrimary = (index) => {
    const newImages = images.map((img, i) => ({
      ...img,
      isPrimary: i === index  // Only the selected image is primary, all others are false
    }))
    
    console.log('🖼️ Setting primary image:', index);
    console.log('📦 Updated images:', newImages.map((img, i) => ({
      index: i,
      isPrimary: img.isPrimary,
      url: img.url.substring(0, 50)
    })));
    
    onImagesChange(newImages)
  }

  const handleAltChange = (index, alt) => {
    const newImages = images.map((img, i) => 
      i === index ? { ...img, alt } : img
    )
    onImagesChange(newImages)
  }

  const handleReorder = (index, direction) => {
    const newImages = [...images]
    const newIndex = direction === 'up' ? index - 1 : index + 1
    
    if (newIndex >= 0 && newIndex < images.length) {
      [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
      // Update sort orders
      newImages.forEach((img, i) => {
        img.sortOrder = i + 1
      })
      onImagesChange(newImages)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Product Images ({images.length}/{maxImages})
        </label>
        {images.length < maxImages && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              onChange={handleFileSelect}
              multiple
              className="hidden"
              id="multi-file-upload"
            />
            <label
              htmlFor="multi-file-upload"
              className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                uploading 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-md hover:shadow-lg'
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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Images
                </>
              )}
            </label>
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 mb-4">
        Supported formats: JPEG, PNG, WebP, GIF • Max size: 10MB per file • Max {maxImages} images
      </p>

      {/* Images Grid */}
      {images.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className={`relative border-2 rounded-lg p-4 transition-all duration-200 ${
                image.isPrimary 
                  ? 'border-amber-500 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              {/* Primary Badge */}
              {image.isPrimary && (
                <div className="absolute top-2 left-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full z-10 shadow-md flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  PRIMARY
                </div>
              )}
              
              {/* Image Index Badge */}
              <div className="absolute top-2 right-2 bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded-full z-10">
                #{index + 1}
              </div>

              {/* Image Preview */}
              <div className="relative w-full h-48 mb-3 bg-gray-100 rounded-lg overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt || `Image ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized={image.url.startsWith('data:')}
                />
              </div>

              {/* Alt Text */}
              <div className="mb-3">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Alt Text
                </label>
                <input
                  type="text"
                  value={image.alt || ''}
                  onChange={(e) => handleAltChange(index, e.target.value)}
                  placeholder="Describe this image"
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-2">
                {/* Reorder Buttons */}
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => handleReorder(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move up"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleReorder(index, 'down')}
                    disabled={index === images.length - 1}
                    className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Move down"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Primary & Delete */}
                <div className="flex gap-2">
                  {!image.isPrimary ? (
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(index)}
                      className="px-3 py-1 text-xs font-medium bg-amber-100 text-amber-700 hover:bg-amber-200 rounded transition-colors duration-200 flex items-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Set Primary
                    </button>
                  ) : (
                    <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-700 rounded flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Is Primary
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="px-3 py-1 text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 rounded transition-colors duration-200"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-gray-600 mb-2">No images uploaded yet</p>
          <p className="text-xs text-gray-500">Click "Add Images" to upload product images</p>
        </div>
      )}
    </div>
  )
}

export default MultiImageUpload

