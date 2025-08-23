'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/cart/cart-provider'

export default function TestHybridCartPage() {
  const { data: session, status } = useSession()
  const { state, addItem, removeItem, updateItem, clearCart, mergeWithDatabase } = useCart()
  const [message, setMessage] = useState('')
  const [localStorageData, setLocalStorageData] = useState('')

  // Check localStorage content
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const cart = localStorage.getItem('cart')
      setLocalStorageData(cart || 'No cart data in localStorage')
    }
  }, [state.items])

  const testAddToCart = async () => {
    try {
      // First, get a product from the API
      const productsResponse = await fetch('/api/supabase/products?limit=1')
      const productsData = await productsResponse.json()
      
      if (!productsResponse.ok || !productsData.length) {
        setMessage('❌ No products found')
        return
      }
      
      const product = productsData[0]
      
      const cartItem = {
        id: `${product.id}-${Date.now()}`,
        productId: product.id,
        name: product.name,
        price: product.sale_price || product.price,
        image: product.images?.[0] || '',
        quantity: 1,
        size: 'A3',
        frame: 'No Frame',
        product: product,
      }

      await addItem(cartItem)
      setMessage(`✅ Added "${product.name}" to cart successfully!`)
    } catch (error) {
      setMessage(`❌ Error adding to cart: ${error}`)
    }
  }

  const testRemoveFromCart = async () => {
    if (state.items.length === 0) {
      setMessage('❌ No items in cart to remove')
      return
    }

    try {
      const firstItem = state.items[0]
      await removeItem(firstItem.id)
      setMessage(`✅ Removed "${firstItem.name}" from cart successfully!`)
    } catch (error) {
      setMessage(`❌ Error removing from cart: ${error}`)
    }
  }

  const testUpdateQuantity = async () => {
    if (state.items.length === 0) {
      setMessage('❌ No items in cart to update')
      return
    }

    try {
      const firstItem = state.items[0]
      const newQuantity = firstItem.quantity + 1
      await updateItem(firstItem.id, newQuantity)
      setMessage(`✅ Updated quantity to ${newQuantity} successfully!`)
    } catch (error) {
      setMessage(`❌ Error updating cart: ${error}`)
    }
  }

  const testClearCart = async () => {
    if (state.items.length === 0) {
      setMessage('❌ Cart is already empty')
      return
    }

    try {
      await clearCart()
      setMessage('✅ Cart cleared successfully!')
    } catch (error) {
      setMessage(`❌ Error clearing cart: ${error}`)
    }
  }

  const testMergeCarts = async () => {
    if (!session) {
      setMessage('❌ Please sign in to test cart merging')
      return
    }

    try {
      await mergeWithDatabase()
      setMessage('✅ Cart merging completed!')
    } catch (error) {
      setMessage(`❌ Error merging carts: ${error}`)
    }
  }

  const clearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart')
      setLocalStorageData('No cart data in localStorage')
      setMessage('✅ localStorage cleared!')
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Hybrid Cart Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Session Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          
          <div className="space-y-4">
            <div>
              <strong>Status:</strong> {status}
            </div>
            
            {session ? (
              <div>
                <strong>User:</strong> {session.user?.email}
                <div className="text-green-600 text-sm mt-1">
                  ✅ Authenticated - Cart saved to database
                </div>
              </div>
            ) : (
              <div>
                <div className="text-blue-600 text-sm">
                  👤 Guest user - Cart saved to localStorage
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cart State */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Cart State</h2>
          
          <div className="space-y-2">
            <div><strong>Items:</strong> {state.items.length}</div>
            <div><strong>Total Items:</strong> {state.itemCount}</div>
            <div><strong>Total Price:</strong> €{state.total.toFixed(2)}</div>
            <div><strong>Loading:</strong> {state.isLoading ? 'Yes' : 'No'}</div>
          </div>
        </div>

        {/* LocalStorage Info */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">LocalStorage</h2>
          
          <div className="space-y-2">
            <div className="text-sm">
              <strong>Content:</strong>
              <div className="mt-2 p-2 bg-white rounded border text-xs overflow-auto max-h-32">
                {localStorageData}
              </div>
            </div>
            <button
              onClick={clearLocalStorage}
              className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600"
            >
              Clear localStorage
            </button>
          </div>
        </div>
      </div>

      {/* Test Controls */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <button
            onClick={testAddToCart}
            disabled={state.isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
          >
            Add to Cart
          </button>
          
          <button
            onClick={testRemoveFromCart}
            disabled={state.isLoading || state.items.length === 0}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 disabled:opacity-50"
          >
            Remove Item
          </button>
          
          <button
            onClick={testUpdateQuantity}
            disabled={state.isLoading || state.items.length === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            Update Quantity
          </button>
          
          <button
            onClick={testClearCart}
            disabled={state.isLoading || state.items.length === 0}
            className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 disabled:opacity-50"
          >
            Clear Cart
          </button>
          
          <button
            onClick={testMergeCarts}
            disabled={state.isLoading || !session}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            Merge Carts
          </button>
        </div>
      </div>

      {/* Results */}
      {message && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Results</h3>
          <div className={`p-3 rounded ${
            message.includes('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {message}
          </div>
        </div>
      )}

      {/* Cart Items */}
      {state.items.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Cart Items ({state.items.length})</h3>
          
          <div className="space-y-4">
            {state.items.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Name:</strong> {item.name}
                    <div className="text-sm text-gray-600">
                      <strong>Price:</strong> €{item.price.toFixed(2)} | 
                      <strong>Quantity:</strong> {item.quantity} | 
                      <strong>Size:</strong> {item.size} | 
                      <strong>Frame:</strong> {item.frame}
                    </div>
                    <div className="text-sm text-gray-500">
                      ID: {item.id}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={state.isLoading}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm hover:bg-red-600 disabled:opacity-50"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-blue-800">How to Test Hybrid Cart</h3>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li><strong>Guest Mode:</strong> Add items while not signed in - they save to localStorage</li>
          <li><strong>Sign In:</strong> Sign in to merge localStorage cart with database cart</li>
          <li><strong>Authenticated Mode:</strong> Add items while signed in - they save to database</li>
          <li><strong>Sign Out:</strong> Sign out to return to localStorage mode</li>
          <li><strong>Reload:</strong> Test persistence by reloading the page</li>
          <li><strong>Cross-Device:</strong> Database cart syncs across devices when signed in</li>
        </ol>
      </div>

      {/* Features */}
      <div className="mt-8 bg-green-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-green-800">Hybrid Cart Features</h3>
        <ul className="text-sm text-green-700 space-y-2 list-disc list-inside">
          <li><strong>Guest Shopping:</strong> Add items without signing up</li>
          <li><strong>Seamless Login:</strong> Cart merges when you sign in</li>
          <li><strong>Cross-Device Sync:</strong> Database cart works on all devices</li>
          <li><strong>Local Persistence:</strong> Guest cart survives page reloads</li>
          <li><strong>Smart Merging:</strong> Combines quantities for duplicate items</li>
          <li><strong>Automatic Cleanup:</strong> Removes localStorage after successful merge</li>
        </ul>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Troubleshooting</h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>If cart doesn't persist, check if localStorage is enabled</li>
          <li>If merge fails, try signing out and back in</li>
          <li>If database errors occur, check your Supabase connection</li>
          <li>Clear localStorage if you want to start fresh</li>
          <li>Check browser console for detailed error messages</li>
        </ul>
      </div>
    </div>
  )
}
