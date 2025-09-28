'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  
  // Check if current route is an admin route
  const isAdminRoute = pathname?.startsWith('/admin')
  
  // For admin routes, don't show navbar and footer
  if (isAdminRoute) {
    return <main className="flex-grow">{children}</main>
  }
  
  // For regular routes, show navbar and footer
  return (
    <>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </>
  )
}
