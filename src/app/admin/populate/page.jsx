'use client'

import { useState } from 'react'
import { useAlert } from '@/contexts/AlertContext'

export default function PopulatePage() {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)
  const { showSuccess, showError } = useAlert()

  const populateDatabase = async () => {
    try {
      setLoading(true)
      setStatus(null)
      
      const response = await fetch('/api/populate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
        showSuccess("Database Populated!", "Sample products and categories have been added successfully!")
      } else {
        throw new Error(result.error || 'Failed to populate database')
      }
    } catch (error) {
      console.error('Error populating database:', error)
      showError("Population Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  const checkStatus = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/populate')
      const result = await response.json()
      
      if (result.success) {
        setStatus(result.data)
      } else {
        throw new Error(result.error || 'Failed to check status')
      }
    } catch (error) {
      console.error('Error checking status:', error)
      showError("Status Error", error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Database Population
            </h1>
            <p className="text-gray-600">
              Populate your database with sample products, categories, and business settings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                What will be created:
              </h3>
              <ul className="text-blue-800 space-y-1">
                <li>• 6 Product Categories</li>
                <li>• 9 Sample Products</li>
                <li>• 18+ Product Images</li>
                <li>• 7 Business Settings</li>
              </ul>
            </div>

            <div className="bg-green-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                Product Categories:
              </h3>
              <ul className="text-green-800 space-y-1">
                <li>• Sarees</li>
                <li>• Lehengas</li>
                <li>• Gowns</li>
                <li>• Kurtis</li>
                <li>• Salwar Suits</li>
                <li>• Ethnic Sets</li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={populateDatabase}
              disabled={loading}
              className="flex-1 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Populating...
                </>
              ) : (
                'Populate Database'
              )}
            </button>

            <button
              onClick={checkStatus}
              disabled={loading}
              className="flex-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              Check Status
            </button>
          </div>

          {status && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Database Status:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {status.categories || 0}
                  </div>
                  <div className="text-sm text-gray-600">Categories</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {status.products || 0}
                  </div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {status.images || 0}
                  </div>
                  <div className="text-sm text-gray-600">Images</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-amber-600">
                    {status.settings || 0}
                  </div>
                  <div className="text-sm text-gray-600">Settings</div>
                </div>
              </div>
              
              {status.isPopulated && (
                <div className="mt-4 p-4 bg-green-100 border border-green-300 rounded-lg">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-green-800 font-medium">
                      Database is populated and ready to use!
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2">
              ⚠️ Important Notes:
            </h4>
            <ul className="text-yellow-700 text-sm space-y-1">
              <li>• This will add sample data to your database</li>
              <li>• Existing data will be updated if conflicts occur</li>
              <li>• Make sure your database is properly configured</li>
              <li>• Business settings can be modified later in the admin panel</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
