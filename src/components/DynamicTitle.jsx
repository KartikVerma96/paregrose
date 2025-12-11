'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

export default function DynamicTitle() {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  useEffect(() => {
    if (!mounted) return
    
    // Only update title on home page, not on specific product/category pages
    // Pages like /product/[id], /cart, /wishlist have their own metadata
    const isHomePage = pathname === '/' || pathname === '/home'
    
    if (!isHomePage) {
      console.log('🚫 DynamicTitle: Skipping title update for non-home page:', pathname)
      return
    }
    
    // Function to update page title from settings
    const updateTitle = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        const result = await response.json()
        
        if (result.success && result.data.seo?.metaTitle) {
          console.log('📄 DynamicTitle: Updating home page title:', result.data.seo.metaTitle)
          document.title = result.data.seo.metaTitle
        }
      } catch (error) {
        console.error('Error fetching SEO settings:', error)
      }
    }

    // Update title on component mount (only for home page)
    updateTitle()

    // Listen for storage events (when settings are updated in another tab)
    const handleStorageChange = (e) => {
      if (e.key === 'seo-settings-updated') {
        updateTitle()
      }
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)

      return () => {
        window.removeEventListener('storage', handleStorageChange)
      }
    }
  }, [pathname, mounted])

  return null // This component doesn't render anything
}
