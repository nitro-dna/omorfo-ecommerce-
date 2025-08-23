'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

export function CartContent() {
  const { state, updateItem, removeItem, clearCart } = useCart()
  const { items, total, itemCount } = state
  const [isUpdating, setIsUpdating] = useState<string | null>(null)

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsUpdating(itemId)
    try {
      await updateItem(itemId, newQuantity)
      toast.success('Cart updated!')
    } catch (error) {
      toast.error('Failed to update cart')
    } finally {
      setIsUpdating(null)
    }
  }

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId)
    toast.success('Item removed from cart')
  }

  const handleClearCart = () => {
    clearCart()
    toast.success('Cart cleared')
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet.</p>
        <Link href="/shop">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart Items */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Cart Items ({itemCount})
              </h2>
              <button
                onClick={handleClearCart}
                className="text-sm text-red-600 hover:text-red-700 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6">
                <div className="flex items-start space-x-4">
                  {/* Product Image */}
                  <div className="relative w-20 h-20 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="80px"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900 mb-1">
                          <Link href={`/products/${item.id}`} className="hover:text-accent-500">
                            {item.name}
                          </Link>
                        </h3>
                        <div className="text-sm text-gray-500 space-y-1">
                          <p>Size: {item.size}</p>
                          <p>Frame: {item.frame}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                            disabled={isUpdating === item.id}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            -
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">
                            {isUpdating === item.id ? '...' : item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={isUpdating === item.id}
                            className="px-3 py-1 text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatPrice(item.price)} each
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
          
          <div className="space-y-3 mb-6">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal ({itemCount} items)</span>
              <span className="text-gray-900">{formatPrice(total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t border-gray-200 pt-3">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Link href="/checkout">
              <Button size="lg" className="w-full">
                Proceed to Checkout
              </Button>
            </Link>
            
            <Link href="/shop">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>

          {/* Shipping Info */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Information</h3>
            <div className="text-xs text-gray-600 space-y-1">
              <p>• Free shipping on orders over $50</p>
              <p>• Standard delivery: 3-5 business days</p>
              <p>• Express delivery: 1-2 business days</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
