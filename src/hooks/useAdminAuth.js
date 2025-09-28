'use client'

import { useState, useEffect } from 'react'

// Client-side admin auth hook
export function useAdminAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/admin/auth/check')
      const result = await response.json()

      if (result.success) {
        setUser(result.data)
      } else {
        setError(result.error)
        setUser(null)
      }
    } catch (err) {
      console.error('Admin auth check error:', err)
      setError('Failed to verify admin access')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/signout', { method: 'POST' })
      setUser(null)
      window.location.href = '/admin/login'
    } catch (err) {
      console.error('Logout error:', err)
    }
  }

  return {
    user,
    loading,
    error,
    checkAuth: checkAdminAuth,
    logout
  }
}
