'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, Filter, Grid, List, ChevronLeft, ChevronRight } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  images: string[]
  category: string
  rating: number
  reviewCount: number
  stockCount: number
  inStock: boolean
  tags: string[]
  dimensions: {
    width: number
    height: number
  }
  createdAt: string
  updatedAt: string
}

interface SearchResultsProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    inStock?: string
    size?: string
    color?: string
    sort?: string
    page?: string
  }
}

export function SearchResults({ searchParams }: SearchResultsProps) {
  const router = useRouter()
  const urlSearchParams = useSearchParams()
  
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0
  })
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    category: searchParams.category || '',
    minPrice: searchParams.minPrice || '',
    maxPrice: searchParams.maxPrice || '',
    rating: searchParams.rating || '',
    inStock: searchParams.inStock === 'true',
    size: searchParams.size || '',
    color: searchParams.color || '',
    sort: searchParams.sort || 'relevance'
  })

  const query = searchParams.q || ''

  useEffect(() => {
    if (query) {
      performSearch()
    }
  }, [query, searchParams.page, searchParams.sort])

  const performSearch = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set('q', query)
      params.set('page', searchParams.page || '1')
      params.set('limit', '12')

      // Add filters
      if (filters.category) params.set('category', filters.category)
      if (filters.minPrice) params.set('minPrice', filters.minPrice)
      if (filters.maxPrice) params.set('maxPrice', filters.maxPrice)
      if (filters.rating) params.set('rating', filters.rating)
      if (filters.inStock) params.set('inStock', 'true')
      if (filters.size) params.set('size', filters.size)
      if (filters.color) params.set('color', filters.color)
      if (filters.sort) params.set('sort', filters.sort)

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Search failed')
      }

      setProducts(data.data || [])
      setPagination(data.pagination || {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0
      })
    } catch (err) {
      console.error('Search error:', err)
      setError(err instanceof Error ? err.message : 'Search failed')
      toast.error('Failed to perform search')
    } finally {
      setIsLoading(false)
    }
  }

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters }
    setFilters(updatedFilters)
    
    // Update URL
    const params = new URLSearchParams(urlSearchParams)
    params.set('q', query)
    params.set('page', '1') // Reset to first page

    // Add filters to URL
    Object.entries(updatedFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString())
      } else {
        params.delete(key)
      }
    })

    router.push(`/search?${params.toString()}`)
  }

  const clearFilters = () => {
    setFilters({
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      inStock: false,
      size: '',
      color: '',
      sort: 'relevance'
    })
    
    const params = new URLSearchParams()
    params.set('q', query)
    router.push(`/search?${params.toString()}`)
  }

  const goToPage = (page: number) => {
    const params = new URLSearchParams(urlSearchParams)
    params.set('page', page.toString())
    router.push(`/search?${params.toString()}`)
  }

  if (!query) {
    return (
      <div className="text-center py-12">
        <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">No search query</h2>
        <p className="text-gray-600">Please enter a search term to find products.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-2">
              Search Results
            </h1>
            <p className="text-lg text-gray-600">
              {isLoading ? 'Searching...' : `${pagination.total} results for "${query}"`}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2"
            >
              <Filter className="w-4 h-4" />
              <span>Filters</span>
            </Button>
            
            <div className="flex items-center border border-gray-300 rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.category || filters.minPrice || filters.maxPrice || filters.rating || filters.inStock || filters.size || filters.color || filters.sort !== 'relevance') && (
          <div className="flex items-center flex-wrap gap-2 mb-4">
            <span className="text-sm text-gray-600">Active filters:</span>
            {filters.category && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Category: {filters.category}
              </span>
            )}
            {filters.minPrice && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Min: €{filters.minPrice}
              </span>
            )}
            {filters.maxPrice && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Max: €{filters.maxPrice}
              </span>
            )}
            {filters.rating && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Rating: {filters.rating}+
              </span>
            )}
            {filters.inStock && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                In Stock
              </span>
            )}
            {filters.size && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Size: {filters.size}
              </span>
            )}
            {filters.color && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Color: {filters.color}
              </span>
            )}
            {filters.sort !== 'relevance' && (
              <span className="px-2 py-1 bg-accent-100 text-accent-800 text-sm rounded-full">
                Sort: {filters.sort}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-red-600 hover:text-red-700"
            >
              Clear All
            </Button>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => updateFilters({ category: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">All Categories</option>
                <option value="abstract">Abstract</option>
                <option value="nature">Nature</option>
                <option value="typography">Typography</option>
                <option value="vintage">Vintage</option>
                <option value="minimalist">Minimalist</option>
                <option value="urban">Urban</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilters({ minPrice: e.target.value })}
                  className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilters({ maxPrice: e.target.value })}
                  className="w-1/2 p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                />
              </div>
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Minimum Rating
              </label>
              <select
                value={filters.rating}
                onChange={(e) => updateFilters({ rating: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="3">3+ Stars</option>
                <option value="2">2+ Stars</option>
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Stock Filter */}
          <div className="mt-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.inStock}
                onChange={(e) => updateFilters({ inStock: e.target.checked })}
                className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
              />
              <span className="ml-2 text-sm text-gray-700">In Stock Only</span>
            </label>
          </div>
        </div>
      )}

      {/* Results */}
      {isLoading ? (
        <div className="text-center py-12">
          <LoadingSpinner />
          <p className="text-gray-600 mt-4">Searching for products...</p>
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={performSearch}>Try Again</Button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">No results found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find any products matching "{query}"
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Try:</p>
            <ul className="text-sm text-gray-500 space-y-1">
              <li>• Using different keywords</li>
              <li>• Checking your spelling</li>
              <li>• Using more general terms</li>
              <li>• Removing some filters</li>
            </ul>
          </div>
        </div>
      ) : (
        <>
          {/* Products Grid */}
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  description: product.description,
                  price: product.price,
                  salePrice: product.salePrice,
                  images: product.images,
                  category: { name: product.category } as any,
                  rating: product.rating,
                  reviewCount: product.reviewCount,
                  stockCount: product.stockCount,
                  inStock: product.inStock,
                  tags: product.tags,
                  dimensions: product.dimensions,
                  categoryId: (product as any).categoryId || '',
                  materials: (product as any).materials || [],
                  featured: (product as any).featured || false,
                  sizes: (product as any).sizes || [],
                  frames: (product as any).frames || [],
                  createdAt: new Date(product.createdAt),
                  updatedAt: new Date(product.updatedAt)
                }}
              />
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-12 flex items-center justify-center">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <Button
                        key={page}
                        variant={page === pagination.page ? 'primary' : 'outline'}
                        size="sm"
                        onClick={() => goToPage(page)}
                        className="w-8 h-8 p-0"
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
