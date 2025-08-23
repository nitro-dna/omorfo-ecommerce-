'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function TestSearchPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const testQueries = [
    'abstract',
    'nature',
    'typography',
    'vintage',
    'minimalist',
    'geometric',
    'landscape',
    'modern'
  ]

  const handleSearch = (query: string) => {
    setIsLoading(true)
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  const handleAdvancedSearch = (query: string, filters: Record<string, string>) => {
    setIsLoading(true)
    const params = new URLSearchParams()
    params.set('q', query)
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Search Functionality Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the search functionality with different queries and filters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Search Tests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Search Tests</h2>
            
            <div className="space-y-3">
              {testQueries.map((query) => (
                <Button
                  key={query}
                  onClick={() => handleSearch(query)}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full justify-start"
                >
                  {isLoading ? <LoadingSpinner /> : `Search for "${query}"`}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Search Tests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Advanced Search Tests</h2>
            
            <div className="space-y-4">
              <Button
                onClick={() => handleAdvancedSearch('abstract', { category: 'abstract', sort: 'price_low' })}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-start"
              >
                {isLoading ? <LoadingSpinner /> : 'Abstract + Price Low to High'}
              </Button>

              <Button
                onClick={() => handleAdvancedSearch('nature', { minPrice: '20', maxPrice: '50', rating: '4' })}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-start"
              >
                {isLoading ? <LoadingSpinner /> : 'Nature + Price €20-50 + 4+ Stars'}
              </Button>

              <Button
                onClick={() => handleAdvancedSearch('vintage', { sort: 'rating', inStock: 'true' })}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-start"
              >
                {isLoading ? <LoadingSpinner /> : 'Vintage + Highest Rated + In Stock'}
              </Button>

              <Button
                onClick={() => handleAdvancedSearch('minimalist', { sort: 'newest' })}
                disabled={isLoading}
                variant="outline"
                className="w-full justify-start"
              >
                {isLoading ? <LoadingSpinner /> : 'Minimalist + Newest First'}
              </Button>
            </div>
          </div>
        </div>

        {/* Search API Test */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Search API Test</h2>
          
          <div className="space-y-4">
            <Button
              onClick={() => {
                setIsLoading(true)
                fetch('/api/search?q=abstract&limit=5')
                  .then(res => res.json())
                  .then(data => {
                    console.log('Search API Response:', data)
                    alert(`Found ${data.data?.length || 0} results for "abstract"`)
                  })
                  .catch(err => {
                    console.error('Search API Error:', err)
                    alert('Search API Error - check console')
                  })
                  .finally(() => setIsLoading(false))
              }}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingSpinner /> : 'Test Search API (check console)'}
            </Button>

            <Button
              onClick={() => {
                setIsLoading(true)
                fetch('/api/search?q=nonexistent&limit=5')
                  .then(res => res.json())
                  .then(data => {
                    console.log('Empty Search API Response:', data)
                    alert(`Found ${data.data?.length || 0} results for "nonexistent"`)
                  })
                  .catch(err => {
                    console.error('Search API Error:', err)
                    alert('Search API Error - check console')
                  })
                  .finally(() => setIsLoading(false))
              }}
              disabled={isLoading}
              variant="outline"
              className="w-full"
            >
              {isLoading ? <LoadingSpinner /> : 'Test Empty Search Results'}
            </Button>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => router.push('/search?q=abstract')}
              variant="outline"
              className="w-full"
            >
              Go to Search Results
            </Button>

            <Button
              onClick={() => router.push('/shop')}
              variant="outline"
              className="w-full"
            >
              Go to Shop
            </Button>

            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="w-full"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
