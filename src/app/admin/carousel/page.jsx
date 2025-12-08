'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useAlert } from '@/contexts/AlertContext'
import { Search, Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUpload from '@/components/admin/ImageUpload'

export default function CarouselPage() {
  const [slides, setSlides] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingSlide, setEditingSlide] = useState(null)
  const [errors, setErrors] = useState({})
  const [formData, setFormData] = useState({
    image_url: '',
    alt_text: '',
    title: '',
    subtext: '',
    offer_text: '',
    button_text: 'Shop Now',
    button_link: '/shop',
    is_active: true,
    sort_order: 0,
  })
  const { showSuccess, showError } = useAlert()

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/carousel')
      const result = await response.json()

      if (result.success) {
        setSlides(result.data)
      } else {
        showError('Error', result.error || 'Failed to fetch carousel slides')
      }
    } catch (error) {
      console.error('Error fetching slides:', error)
      showError('Error', 'Failed to fetch carousel slides')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})

    // Validation
    const newErrors = {}
    if (!formData.image_url) newErrors.image_url = 'Image URL is required'
    if (!formData.title) newErrors.title = 'Title is required'

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      const url = editingSlide
        ? `/api/admin/carousel/${editingSlide.id}`
        : '/api/admin/carousel'
      const method = editingSlide ? 'PUT' : 'POST'

      console.log('Submitting carousel slide:', formData)

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (result.success) {
        showSuccess(
          'Success',
          editingSlide
            ? 'Carousel slide updated successfully'
            : 'Carousel slide created successfully'
        )
        setShowModal(false)
        resetForm()
        fetchSlides()
      } else {
        console.error('API Error:', result)
        const errorMessage = result.error || result.message || 'Failed to save carousel slide'
        const errorDetails = result.details ? `\n\nDetails: ${result.details}` : ''
        showError('Error', `${errorMessage}${errorDetails}`)
        
        // If it's a Prisma model error, show helpful message
        if (errorMessage.includes('carousel_slides') || errorMessage.includes('model')) {
          showError(
            'Database Error', 
            'Prisma client needs to be regenerated. Please stop the dev server and run: npx prisma generate'
          )
        }
      }
    } catch (error) {
      console.error('Error saving slide:', error)
      showError('Error', error.message || 'Failed to save carousel slide. Please check console for details.')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this carousel slide?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/carousel/${id}`, {
        method: 'DELETE',
      })

      const result = await response.json()

      if (result.success) {
        showSuccess('Success', 'Carousel slide deleted successfully')
        fetchSlides()
      } else {
        showError('Error', result.error || 'Failed to delete carousel slide')
      }
    } catch (error) {
      console.error('Error deleting slide:', error)
      showError('Error', 'Failed to delete carousel slide')
    }
  }

  const handleEdit = (slide) => {
    setEditingSlide(slide)
    setFormData({
      image_url: slide.image_url || '',
      alt_text: slide.alt_text || '',
      title: slide.title || '',
      subtext: slide.subtext || '',
      offer_text: slide.offer_text || '',
      button_text: slide.button_text || 'Shop Now',
      button_link: slide.button_link || '/shop',
      is_active: slide.is_active !== undefined ? slide.is_active : true,
      sort_order: slide.sort_order || 0,
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setEditingSlide(null)
    setFormData({
      image_url: '',
      alt_text: '',
      title: '',
      subtext: '',
      offer_text: '',
      button_text: 'Shop Now',
      button_link: '/shop',
      is_active: true,
      sort_order: 0,
    })
    setErrors({})
  }

  const handleToggleActive = async (slide) => {
    try {
      const response = await fetch(`/api/admin/carousel/${slide.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...slide,
          is_active: !slide.is_active,
        }),
      })

      const result = await response.json()

      if (result.success) {
        showSuccess('Success', 'Carousel slide updated successfully')
        fetchSlides()
      } else {
        showError('Error', result.error || 'Failed to update carousel slide')
      }
    } catch (error) {
      console.error('Error updating slide:', error)
      showError('Error', 'Failed to update carousel slide')
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Carousel Slides</h1>
          <button
            onClick={() => {
              resetForm()
              setShowModal(true)
            }}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
            <Plus size={20} />
            Add Slide
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-500">Loading carousel slides...</div>
          </div>
        ) : slides.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">No carousel slides found</div>
            <button
              onClick={() => {
                resetForm()
                setShowModal(true)
              }}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Add First Slide
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {slides.map((slide) => (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <div className="relative h-48 bg-gray-100">
                  <img
                    src={slide.image_url}
                    alt={slide.alt_text || slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    {slide.is_active ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-gray-500 text-white text-xs rounded">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{slide.title}</h3>
                  {slide.subtext && (
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{slide.subtext}</p>
                  )}
                  {slide.offer_text && (
                    <p className="text-xs text-amber-600 mb-2">{slide.offer_text}</p>
                  )}
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-xs text-gray-500">Order: {slide.sort_order}</span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleToggleActive(slide)}
                        className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                        {slide.is_active ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button
                        onClick={() => handleEdit(slide)}
                        className="p-2 text-blue-600 hover:text-blue-800 transition-colors">
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(slide.id)}
                        className="p-2 text-red-600 hover:text-red-800 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowModal(false)
                resetForm()
              }}>
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-4">
                    {editingSlide ? 'Edit Carousel Slide' : 'Add Carousel Slide'}
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <ImageUpload
                        type="carousel"
                        currentImage={formData.image_url}
                        onUploadComplete={(url) => setFormData({ ...formData, image_url: url })}
                        label="Image URL *"
                      />
                      {errors.image_url && (
                        <p className="text-red-500 text-sm mt-1">{errors.image_url}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={formData.alt_text}
                        onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        required
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtext
                      </label>
                      <input
                        type="text"
                        value={formData.subtext}
                        onChange={(e) => setFormData({ ...formData, subtext: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Offer Text
                      </label>
                      <input
                        type="text"
                        value={formData.offer_text}
                        onChange={(e) => setFormData({ ...formData, offer_text: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Text
                        </label>
                        <input
                          type="text"
                          value={formData.button_text}
                          onChange={(e) =>
                            setFormData({ ...formData, button_text: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Button Link
                        </label>
                        <input
                          type="text"
                          value={formData.button_link}
                          onChange={(e) =>
                            setFormData({ ...formData, button_link: e.target.value })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Sort Order
                        </label>
                        <input
                          type="number"
                          value={formData.sort_order}
                          onChange={(e) =>
                            setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) =>
                              setFormData({ ...formData, is_active: e.target.checked })
                            }
                            className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                          />
                          <span className="text-sm font-medium text-gray-700">Active</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowModal(false)
                          resetForm()
                        }}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
                        {editingSlide ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}

