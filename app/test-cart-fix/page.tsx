'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/cart/cart-provider'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function TestCartFixPage() {
  const { data: session, status } = useSession()
  const { state, addItem, updateItem, removeItem, clearCart } = useCart()
  const [isLoading, setIsLoading] = useState(false)

  const testItem = {
    id: `test-${Date.now()}`,
    productId: 'test-product-1',
    name: 'Test Poster',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    quantity: 1,
    size: 'A3',
    frame: 'No Frame',
    product: {
      id: 'test-product-1',
      name: 'Test Poster',
      price: 29.99,
    }
  }

  const handleAddItem = async () => {
    setIsLoading(true)
    try {
      await addItem(testItem)
    } catch (error) {
      console.error('Error adding item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    setIsLoading(true)
    try {
      await updateItem(itemId, newQuantity)
    } catch (error) {
      console.error('Error updating item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRemoveItem = async (itemId: string) => {
    setIsLoading(true)
    try {
      await removeItem(itemId)
    } catch (error) {
      console.error('Error removing item:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleClearCart = async () => {
    setIsLoading(true)
    try {
      await clearCart()
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Cart Fix Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Test the cart functionality after fixes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Session Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Session Status</h2>
            <div className="space-y-2">
              <p><strong>Status:</strong> {status}</p>
              <p><strong>Email:</strong> {session?.user?.email || 'Not signed in'}</p>
              <p><strong>Name:</strong> {session?.user?.name || 'Not signed in'}</p>
            </div>
          </div>

          {/* Cart State */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart State</h2>
            <div className="space-y-2">
              <p><strong>Items Count:</strong> {state.itemCount}</p>
              <p><strong>Total:</strong> €{state.total.toFixed(2)}</p>
              <p><strong>Loading:</strong> {state.isLoading ? 'Yes' : 'No'}</p>
              <p><strong>Items:</strong> {state.items.length}</p>
            </div>
          </div>
        </div>

        {/* Test Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button
              onClick={handleAddItem}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? <LoadingSpinner /> : 'Add Test Item'}
            </Button>

            <Button
              onClick={handleClearCart}
              disabled={isLoading || state.items.length === 0}
              variant="outline"
              className="w-full"
            >
              {isLoading ? <LoadingSpinner /> : 'Clear Cart'}
            </Button>

            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              className="w-full"
            >
              Reload Page
            </Button>

            <Button
              onClick={() => window.open('/cart', '_blank')}
              variant="outline"
              className="w-full"
            >
              Open Cart Page
            </Button>
          </div>
        </div>

        {/* Cart Items */}
        {state.items.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
            
            <div className="space-y-4">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Frame: {item.frame}
                    </p>
                    <p className="text-sm text-gray-600">
                      Price: €{item.price.toFixed(2)} | Quantity: {item.quantity}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                      disabled={isLoading}
                    >
                      -
                    </Button>
                    
                    <span className="w-8 text-center">{item.quantity}</span>
                    
                    <Button
                      size="sm"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={isLoading}
                    >
                      +
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={isLoading}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Debug Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Debug Info</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">localStorage Cart:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {typeof window !== 'undefined' ? localStorage.getItem('cart') || 'No cart data' : 'Server side'}
              </pre>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Current Cart State:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(state, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
