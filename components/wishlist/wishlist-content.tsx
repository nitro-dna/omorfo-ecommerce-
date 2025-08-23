'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Eye,
  Star,
  Package
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useCart } from '@/components/cart/cart-provider'
import { useSession } from 'next-auth/react'
import { normalizeProduct } from '@/lib/utils'
import toast from 'react-hot-toast'

interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product: any
}

export function WishlistContent() {
  const { data: session } = useSession()
  const { addItem } = useCart()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch wishlist items
  const fetchWishlist = async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch('/api/supabase/wishlist')
      if (!response.ok) {
        throw new Error('Failed to fetch wishlist')
      }
      
      const data = await response.json()
      setWishlistItems(data.data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch wishlist')
    } finally {
      setIsLoading(false)
    }
  }

  // Remove item from wishlist
  const removeFromWishlist = async (productId: string) => {
    try {
      const response = await fetch(`/api/supabase/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove from wishlist')
      }
      
      setWishlistItems(items => items.filter(item => item.product_id !== productId))
      setSelectedItems(items => items.filter(id => id !== productId))
      toast.success('Removed from wishlist')
    } catch (err) {
      toast.error('Failed to remove from wishlist')
    }
  }

  // Remove selected items
  const removeSelectedItems = async () => {
    try {
      const promises = selectedItems.map(productId => 
        fetch(`/api/supabase/wishlist?productId=${productId}`, {
          method: 'DELETE',
        })
      )
      
      await Promise.all(promises)
      
      setWishlistItems(items => items.filter(item => !selectedItems.includes(item.product_id)))
      setSelectedItems([])
      toast.success(`${selectedItems.length} items removed from wishlist`)
    } catch (err) {
      toast.error('Failed to remove selected items')
    }
  }

  // Toggle item selection
  const toggleItemSelection = (productId: string) => {
    setSelectedItems(items => 
      items.includes(productId) 
        ? items.filter(id => id !== productId)
        : [...items, productId]
    )
  }

  // Toggle all items
  const toggleAllItems = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(wishlistItems.map(item => item.product_id))
    }
  }

  // Add to cart
  const addToCart = (item: WishlistItem) => {
    const product = normalizeProduct(item.product)
    
    addItem({
      id: `${product.id}-${Date.now()}`,
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0],
      quantity: 1,
      size: product.sizes[0],
      frame: product.frames[0],
      product: product
    })
    toast.success('Added to cart!')
  }

  // Add selected to cart
  const addSelectedToCart = () => {
    selectedItems.forEach(productId => {
      const item = wishlistItems.find(wishlistItem => wishlistItem.product_id === productId)
      if (item) {
        addToCart(item)
      }
    })
    if (selectedItems.length > 0) {
      toast.success(`${selectedItems.length} items added to cart!`)
    }
  }

  // Fetch wishlist on mount
  useEffect(() => {
    if (session) {
      fetchWishlist()
    }
  }, [session])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={fetchWishlist}
          className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Show empty state
  if (wishlistItems.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-primary-800 mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-primary-600 mb-6">
          Start adding items to your wishlist while browsing
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <>
      {/* Bulk Actions */}
      <div className="bg-white rounded-lg shadow-sm border border-primary-200 p-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedItems.length === wishlistItems.length}
                onChange={toggleAllItems}
                className="w-4 h-4 text-accent-500 border-primary-300 rounded focus:ring-accent-500"
              />
              <span className="text-sm font-medium text-primary-700">
                Select All ({selectedItems.length}/{wishlistItems.length})
              </span>
            </label>
          </div>
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-3">
              <button
                onClick={addSelectedToCart}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add Selected to Cart
              </button>
              <button
                onClick={removeSelectedItems}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Remove Selected
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Wishlist Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item) => {
          const product = normalizeProduct(item.product)
          const isSelected = selectedItems.includes(item.product_id)
          
          return (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-primary-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              {/* Item Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
                {!product.inStock && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
                    Out of Stock
                  </div>
                )}
                <div className="absolute top-3 left-3">
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleItemSelection(item.product_id)}
                    className="w-4 h-4 text-accent-500 border-primary-300 rounded focus:ring-accent-500"
                  />
                </div>
              </div>

              {/* Item Details */}
              <div className="p-4">
                <div className="mb-2">
                  <span className="text-xs text-primary-500 uppercase tracking-wide">
                    {product.category?.name || 'Uncategorized'}
                  </span>
                </div>
                
                <h3 className="font-semibold text-primary-800 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center space-x-2 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product.rating || 0)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-primary-600">
                    ({product.reviewCount || 0})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-lg font-semibold text-primary-800">
                    ${(product.salePrice || product.price).toFixed(2)}
                  </span>
                  {product.salePrice && product.salePrice < product.price && (
                    <span className="text-sm text-primary-500 line-through">
                      ${product.price.toFixed(2)}
                    </span>
                  )}
                </div>

                {/* Available Options */}
                <div className="mb-4">
                  <div className="text-xs text-primary-600 mb-1">Available Sizes:</div>
                  <div className="flex flex-wrap gap-1">
                    {product.sizes?.map((size: string) => (
                      <span
                        key={size}
                        className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded"
                      >
                        {size}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/products/${product.slug}`}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  <button
                    onClick={() => addToCart(item)}
                    disabled={!product.inStock}
                    className="flex-1 inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(item.product_id)}
                    className="inline-flex items-center justify-center px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Summary */}
      <div className="mt-8 bg-white rounded-lg shadow-sm border border-primary-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-primary-800">
              Wishlist Summary
            </h3>
            <p className="text-sm text-primary-600">
              {wishlistItems.length} items in your wishlist
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-primary-800">
              Total Value: ${wishlistItems.reduce((sum, item) => {
                const product = normalizeProduct(item.product)
                return sum + (product.salePrice || product.price)
              }, 0).toFixed(2)}
            </div>
            <div className="text-sm text-primary-600">
              {wishlistItems.filter(item => {
                const product = normalizeProduct(item.product)
                return product.salePrice && product.salePrice < product.price
              }).length} items on sale
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
