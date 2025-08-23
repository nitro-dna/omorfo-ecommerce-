'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/cart/cart-provider'

export default function TestCartPage() {
  const { data: session, status } = useSession()
  const { state, addItem, removeItem, updateItem, clearCart, syncFromDatabase } = useCart()
  const [message, setMessage] = useState('')

  const testAddToCart = async () => {
    if (!session) {
      setMessage('❌ Please sign in first')
      return
    }

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
      setMessage('✅ Added product to cart successfully!')
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
      setMessage('✅ Removed item from cart successfully!')
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

  const testSyncFromDatabase = async () => {
    try {
      await syncFromDatabase()
      setMessage('✅ Cart synced from database successfully!')
    } catch (error) {
      setMessage(`❌ Error syncing cart: ${error}`)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Cart Test Page</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
              </div>
            ) : (
              <div className="text-red-600">
                No session found. Please sign in to test cart functionality.
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
      </div>

      {/* Test Controls */}
      <div className="mt-8 bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={testAddToCart}
            disabled={state.isLoading || !session}
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
        </div>
        
        <div className="mt-4">
          <button
            onClick={testSyncFromDatabase}
            disabled={state.isLoading || !session}
            className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 disabled:opacity-50"
          >
            Sync from Database
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
        <h3 className="text-lg font-semibold mb-3 text-blue-800">Instructions</h3>
        <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
          <li>Sign in to your account first</li>
          <li>Use "Add to Cart" to add a test product</li>
          <li>Use "Remove Item" to remove the first item</li>
          <li>Use "Update Quantity" to increase quantity</li>
          <li>Use "Clear Cart" to remove all items</li>
          <li>Use "Sync from Database" to reload cart from database</li>
          <li>Reload the page to test persistence</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Troubleshooting</h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>If you get "Authentication required", make sure you're signed in</li>
          <li>If you get "User not found", the user might not exist in the users table</li>
          <li>If you get "Product not found", check if products exist in the database</li>
          <li>If cart items disappear on reload, run the fix-cart-schema.sql script</li>
          <li>Check the browser console for detailed error messages</li>
        </ul>
      </div>
    </div>
  )
}
