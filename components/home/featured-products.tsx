'use client'

import { useQuery } from 'react-query'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { ProductCard } from '@/components/products/product-card'
import { formatPrice } from '@/lib/utils'

export function FeaturedProducts() {
  const { data: response, isLoading, error } = useQuery(
    'featured-products',
    async () => {
      const res = await fetch('/api/supabase/products?featured=true&limit=6')
      if (!res.ok) {
        throw new Error('Failed to fetch featured products')
      }
      return res.json()
    },
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  const products = response?.data || []

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-gray-200 rounded-lg h-64 mb-4" />
            <div className="h-4 bg-gray-200 rounded mb-2" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Failed to load featured products. Please try again later.</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No featured products available at the moment.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
