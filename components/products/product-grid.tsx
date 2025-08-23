'use client'

import { useState, useEffect } from 'react'
import { useQuery } from 'react-query'
import { ProductCard } from './product-card'
import { ProductSort } from './product-sort'
import { Pagination } from '@/components/ui/pagination'


interface ProductGridProps {
  category?: string
  searchQuery?: string
}

export function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [sortBy, setSortBy] = useState('newest')
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    category: category || '',
    priceRange: '',
    size: '',
    color: '',
  })

  const itemsPerPage = 12

  // Fetch products from Supabase API
  const { data: products, isLoading, error } = useQuery(
    ['products', filters, sortBy, currentPage],
    async () => {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      })

      if (filters.category) {
        params.append('category', filters.category)
      }

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      const response = await fetch(`/api/supabase/products?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch products')
      }

      const data = await response.json()
      
      // Apply client-side sorting
      let sortedProducts = [...data.data]
      switch (sortBy) {
        case 'price-low':
          sortedProducts.sort((a: any, b: any) => a.price - b.price)
          break
        case 'price-high':
          sortedProducts.sort((a: any, b: any) => b.price - a.price)
          break
        case 'popular':
          sortedProducts.sort((a: any, b: any) => b.rating - a.rating)
          break
        case 'newest':
        default:
          sortedProducts.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
          break
      }

      return {
        products: sortedProducts,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages,
      }
    },
    {
      keepPreviousData: true,
    }
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 aspect-[3/4] rounded-lg mb-4"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Error loading products. Please try again.</p>
      </div>
    )
  }

  if (!products?.products.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No products found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Sort and Results Count */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <ProductSort value={sortBy} onChange={setSortBy} />
        <p className="text-sm text-gray-600 mt-2 sm:mt-0">
          Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, products.total)} of {products.total} products
        </p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {products.products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Pagination */}
      {products.totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={products.totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  )
}
