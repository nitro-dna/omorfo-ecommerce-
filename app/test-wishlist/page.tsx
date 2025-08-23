'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

export default function TestWishlistPage() {
  const { data: session, status } = useSession()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testWishlistAPI = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/supabase/wishlist')
      const data = await response.json()
      
      if (response.ok) {
        setWishlistItems(data.data || [])
        setMessage(`✅ Wishlist API working! Found ${data.count} items`)
      } else {
        setMessage(`❌ Wishlist API error: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const addTestItem = async () => {
    setIsLoading(true)
    setMessage('')
    
    try {
      // First, get a product ID from the products table
      const productsResponse = await fetch('/api/supabase/products?limit=1')
      const productsData = await productsResponse.json()
      
      if (!productsResponse.ok || !productsData.length) {
        setMessage('❌ No products found to add to wishlist')
        return
      }
      
      const productId = productsData[0].id
      
      const response = await fetch('/api/supabase/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Added product ${productId} to wishlist successfully!`)
        testWishlistAPI() // Refresh the list
      } else {
        setMessage(`❌ Failed to add to wishlist: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const removeTestItem = async (productId: string) => {
    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch(`/api/supabase/wishlist?productId=${productId}`, {
        method: 'DELETE',
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setMessage(`✅ Removed product ${productId} from wishlist successfully!`)
        testWishlistAPI() // Refresh the list
      } else {
        setMessage(`❌ Failed to remove from wishlist: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Wishlist Test Page</h1>
      
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
                No session found. Please sign in to test wishlist functionality.
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={testWishlistAPI}
              disabled={isLoading || !session}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Testing...' : 'Test Wishlist API'}
            </button>
            
            <button
              onClick={addTestItem}
              disabled={isLoading || !session}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Adding...' : 'Add Test Item to Wishlist'}
            </button>
          </div>
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

      {/* Wishlist Items */}
      {wishlistItems.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Wishlist Items ({wishlistItems.length})</h3>
          
          <div className="space-y-4">
            {wishlistItems.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Product ID:</strong> {item.product_id}
                    {item.product && (
                      <div className="text-sm text-gray-600">
                        <strong>Name:</strong> {item.product.name}
                      </div>
                    )}
                    <div className="text-sm text-gray-500">
                      Added: {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                  
                  <button
                    onClick={() => removeTestItem(item.product_id)}
                    disabled={isLoading}
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
          <li>Click "Test Wishlist API" to check if the API is working</li>
          <li>Click "Add Test Item to Wishlist" to add a product</li>
          <li>Use "Remove" buttons to remove items from wishlist</li>
          <li>Check the results for any error messages</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Troubleshooting</h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>If you get "Authentication required", make sure you're signed in</li>
          <li>If you get "User not found", the user might not exist in the users table</li>
          <li>If you get "Product not found", check if products exist in the database</li>
          <li>If you get database errors, run the fix-wishlist-schema.sql script</li>
        </ul>
      </div>
    </div>
  )
}
