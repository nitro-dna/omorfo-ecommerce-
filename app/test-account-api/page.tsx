'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface AccountStats {
  totalOrders: number
  totalSpent: number
  wishlistItems: number
  savedAddresses: number
}

interface RecentOrder {
  id: string
  date: string
  status: string
  total: number
  items: number
}

export default function TestAccountAPIPage() {
  const { data: session, status } = useSession()
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')

  const testAccountStats = async () => {
    if (!session) {
      setMessage('❌ Please sign in first')
      return
    }

    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/supabase/account/stats')
      const data = await response.json()
      
      if (response.ok) {
        setStats(data.data)
        setMessage(`✅ Account stats loaded successfully!`)
      } else {
        setMessage(`❌ Failed to load account stats: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRecentOrders = async () => {
    if (!session) {
      setMessage('❌ Please sign in first')
      return
    }

    setIsLoading(true)
    setMessage('')
    
    try {
      const response = await fetch('/api/supabase/account/recent-orders')
      const data = await response.json()
      
      if (response.ok) {
        setRecentOrders(data.data)
        setMessage(`✅ Recent orders loaded successfully! Found ${data.data.length} orders`)
      } else {
        setMessage(`❌ Failed to load recent orders: ${data.error}`)
      }
    } catch (error) {
      setMessage(`❌ Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Account API Test Page</h1>
      
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
                No session found. Please sign in to test account APIs.
              </div>
            )}
          </div>
        </div>

        {/* Test Controls */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
          
          <div className="space-y-4">
            <button
              onClick={testAccountStats}
              disabled={isLoading || !session}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Test Account Stats API'}
            </button>
            
            <button
              onClick={testRecentOrders}
              disabled={isLoading || !session}
              className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
            >
              {isLoading ? 'Loading...' : 'Test Recent Orders API'}
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

      {/* Account Stats */}
      {stats && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Account Statistics</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded border">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalOrders}</div>
                <div className="text-sm text-gray-600">Total Orders</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">€{stats.totalSpent.toFixed(2)}</div>
                <div className="text-sm text-gray-600">Total Spent</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.wishlistItems}</div>
                <div className="text-sm text-gray-600">Wishlist Items</div>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded border">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.savedAddresses}</div>
                <div className="text-sm text-gray-600">Saved Addresses</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Orders */}
      {recentOrders.length > 0 && (
        <div className="mt-8 bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">Recent Orders ({recentOrders.length})</h3>
          
          <div className="space-y-4">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-white p-4 rounded border">
                <div className="flex justify-between items-center">
                  <div>
                    <strong>Order ID:</strong> {order.id}
                    <div className="text-sm text-gray-600">
                      <strong>Date:</strong> {order.date} | 
                      <strong>Status:</strong> {order.status} | 
                      <strong>Items:</strong> {order.items}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold">€{order.total.toFixed(2)}</div>
                  </div>
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
          <li>Click "Test Account Stats API" to load account statistics</li>
          <li>Click "Test Recent Orders API" to load recent orders</li>
          <li>Check the results for any error messages</li>
          <li>If APIs work, the account page should display real data</li>
        </ol>
      </div>

      {/* Troubleshooting */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Troubleshooting</h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>If you get "Authentication required", make sure you're signed in</li>
          <li>If you get "User not found", the user might not exist in the users table</li>
          <li>If you get database errors, check if the required tables exist</li>
          <li>If stats show 0, there might be no data in the database yet</li>
          <li>Check the browser console for detailed error messages</li>
        </ul>
      </div>
    </div>
  )
}
