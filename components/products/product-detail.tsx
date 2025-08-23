'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Star, Heart, Share2, Truck, Shield, CheckCircle } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { Product } from '@/types'
import { formatPrice, normalizeProduct } from '@/lib/utils'
import toast from 'react-hot-toast'

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product: rawProduct }: ProductDetailProps) {
  // Normalize product data to handle both camelCase and snake_case
  const product = normalizeProduct(rawProduct)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedSize, setSelectedSize] = useState(product.sizes[0])
  const [selectedFrame, setSelectedFrame] = useState(product.frames[0])
  const [quantity, setQuantity] = useState(1)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: `${product.id}-${Date.now()}`, // Generate unique ID
      productId: product.id,
      name: product.name,
      price: product.salePrice || product.price,
      image: product.images[0] || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
      size: selectedSize,
      frame: selectedFrame,
      quantity,
      product: product,
    })
    
    toast.success(`${product.name} added to cart!`)
  }

  const handleAddToWishlist = () => {
    toast.success(`${product.name} added to wishlist!`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === index
                      ? 'border-accent-500'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.name} - View ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 25vw, 12.5vw"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-sm text-gray-500">{product.category.name}</span>
              {product.featured && (
                <span className="px-2 py-1 text-xs bg-accent-100 text-accent-700 rounded-full">
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl font-display font-semibold text-gray-900 mb-2">
              {product.name}
            </h1>
            <p className="text-lg text-gray-600">{product.description}</p>
          </div>

          {/* Rating */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-3">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.salePrice && (
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
            {product.salePrice && (
              <span className="px-2 py-1 text-sm bg-red-100 text-red-700 rounded-full">
                {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
              </span>
            )}
          </div>

          {/* Size Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.sizes.map((size: string) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    selectedSize === size
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Frame Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Frame</h3>
            <div className="grid grid-cols-2 gap-2">
              {product.frames.map((frame: string) => (
                <button
                  key={frame}
                  onClick={() => setSelectedFrame(frame)}
                  className={`px-4 py-2 text-sm border rounded-lg transition-colors ${
                    selectedFrame === frame
                      ? 'border-accent-500 bg-accent-50 text-accent-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  {frame}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 mb-3">Quantity</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                -
              </button>
              <span className="w-12 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="w-full"
              disabled={!product.inStock}
            >
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={handleAddToWishlist}
                className="flex-1"
              >
                <Heart className="w-4 h-4 mr-2" />
                Wishlist
              </Button>
              <Button
                variant="outline"
                onClick={handleShare}
                className="flex-1"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="border-t border-gray-200 pt-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center space-x-3">
                <Truck className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
              </div>
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">30-day money-back guarantee</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm text-gray-600">Premium quality print</span>
              </div>
            </div>
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
