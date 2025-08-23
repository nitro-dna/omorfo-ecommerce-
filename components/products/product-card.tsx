'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react'
import { ProductStockIndicator } from '@/components/ui/stock-indicator'
import { CompactReviews } from '@/components/reviews/live-reviews'
import { ProductImage } from '@/components/ui/optimized-image'
import { Product } from '@/types'
import { formatPrice, calculateDiscount, normalizeProduct } from '@/lib/utils'
import { useCart } from '@/components/cart/cart-provider'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  showQuickView?: boolean
}

export function ProductCard({ product: rawProduct, showQuickView = true }: ProductCardProps) {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

    // Normalize product data to handle both camelCase and snake_case
  const product = normalizeProduct(rawProduct)
  
  // Check if product is in wishlist on mount
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (!session) return
      
      try {
        const response = await fetch('/api/supabase/wishlist')
        if (response.ok) {
          const data = await response.json()
          const isInWishlist = data.data?.some((item: any) => item.product_id === product.id)
          setIsWishlisted(isInWishlist)
        }
      } catch (error) {
        // Silently fail - wishlist status is not critical
      }
    }
    
    checkWishlistStatus()
  }, [session, product.id])
  
  const handleAddToCart = async () => {
    setIsLoading(true)
    try {
      const cartItem = {
        id: `${product.id}-${Date.now()}`, // Generate unique ID
        productId: product.id,
        name: product.name,
        price: product.salePrice || product.price,
        image: product.images[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        quantity: 1,
        size: 'A3', // Default size
        frame: 'No Frame', // Default frame
        product: product,
      }

      await addItem(cartItem)
    } catch (error) {
      toast.error('Failed to add to cart')
    } finally {
      setIsLoading(false)
    }
  }

  const handleWishlist = async () => {
    if (!session) {
      toast.error('Please sign in to add items to wishlist')
      return
    }
    
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/supabase/wishlist?productId=${product.id}`, {
          method: 'DELETE',
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Wishlist remove error:', errorData)
          throw new Error(errorData.error || 'Failed to remove from wishlist')
        }
        
        setIsWishlisted(false)
        toast.success('Removed from wishlist')
      } else {
        // Add to wishlist
        const response = await fetch('/api/supabase/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('Wishlist add error:', errorData)
          
          if (errorData.error === 'Item already in wishlist') {
            setIsWishlisted(true)
            toast.success('Already in wishlist')
            return
          }
          
          if (errorData.error === 'Authentication required') {
            toast.error('Please sign in to add items to wishlist')
            return
          }
          
          throw new Error(errorData.error || 'Failed to add to wishlist')
        }
        
        setIsWishlisted(true)
        toast.success('Added to wishlist')
      }
    } catch (error) {
      console.error('Wishlist error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update wishlist')
    }
  }

  const discount = product.salePrice ? calculateDiscount(product.price, product.salePrice) : 0

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border border-primary-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Image Container */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Link href={`/products/${product.slug}`}>
          <ProductImage
            src={product.images[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop'}
            alt={product.name}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority={false}
          />
        </Link>

        {/* Sale Badge */}
        {product.salePrice && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            -{discount}%
          </div>
        )}

        {/* Stock Badge */}
        <ProductStockIndicator product={product} />

        {/* Action Buttons */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex space-x-2">
            {showQuickView && (
              <button
                className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-primary-100 transition-colors"
                aria-label="Quick view"
              >
                <Eye className="w-4 h-4 text-primary-700" />
              </button>
            )}
            
            <button
              onClick={handleAddToCart}
              disabled={!product.inStock || isLoading}
              className="w-10 h-10 bg-accent-500 rounded-full flex items-center justify-center hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
            
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                isWishlisted
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-white hover:bg-primary-100'
              }`}
              aria-label="Add to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'text-white fill-white' : 'text-primary-700'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Category */}
        <div className="text-xs text-primary-500 uppercase tracking-wide mb-1">
          {product.category?.name}
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold text-primary-800 mb-2 hover:text-accent-500 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <CompactReviews product={product} />

        {/* Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {product.salePrice ? (
              <>
                <span className="text-lg font-semibold text-accent-500">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-sm text-primary-500 line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-lg font-semibold text-primary-800">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Size */}
          <div className="text-xs text-primary-500">
            {product.dimensions.width}×{product.dimensions.height}cm
          </div>
        </div>
      </div>
    </div>
  )
}
