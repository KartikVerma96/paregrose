'use client'

import { useEffect } from 'react'

export default function DynamicTitle() {
  useEffect(() => {
    // Function to update page title from settings
    const updateTitle = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        const result = await response.json()
        
        if (result.success && result.data.seo?.metaTitle) {
          document.title = result.data.seo.metaTitle
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error)
      }
    }

    // Update title on component mount
    updateTitle()

    // Listen for storage events (when settings are updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'seo-settings-updated') {
        updateTitle()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return null // This component doesn't render anything
}
