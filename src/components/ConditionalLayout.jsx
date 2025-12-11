'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  // During SSR/static generation, return just children wrapped in a div
  // This prevents client components (Navbar/Footer) from being rendered during SSR
  // which can cause "Cannot read properties of undefined" errors during static generation
  if (!mounted) {
    return <div>{children}</div>
  }
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // Check if it's the home page (carousel handles its own positioning)
  const isHomePage = pathname === '/'
  
  // For admin routes, don't show navbar and footer
  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>
  }
  
  // For regular routes, show navbar and footer
  return (
    <>
      <Navbar />
      <main className={`flex-grow ${isHomePage ? 'pt-0' : 'pt-[180px] lg:pt-[200px]'}`}>{children}</main>
      <Footer />
    </>
  )
}
