'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { User, Package, Heart, MapPin, Settings, LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { formatPrice } from '@/lib/utils'

interface AccountDashboardProps {
  user: any
}

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

export function AccountDashboard({ user }: AccountDashboardProps) {
  const [stats, setStats] = useState<AccountStats | null>(null)
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccountData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch account statistics
        const statsResponse = await fetch('/api/supabase/account/stats')
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData.data)
        } else {
          console.error('Failed to fetch account stats')
        }

        // Fetch recent orders
        const ordersResponse = await fetch('/api/supabase/account/recent-orders')
        if (ordersResponse.ok) {
          const ordersData = await ordersResponse.json()
          setRecentOrders(ordersData.data)
        } else {
          console.error('Failed to fetch recent orders')
        }
      } catch (error) {
        console.error('Error fetching account data:', error)
        setError('Failed to load account data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccountData()
  }, [])

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* User Info */}
          <div className="text-center mb-6 pb-6 border-b border-gray-200">
            <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-8 h-8 text-accent-600" />
            </div>
            <h3 className="font-semibold text-gray-900">{user?.name || 'User'}</h3>
            <p className="text-sm text-gray-600">{user?.email}</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            <Link
              href="/account"
              className="flex items-center space-x-3 px-3 py-2 text-sm font-medium text-accent-700 bg-accent-50 rounded-lg"
            >
              <User className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>Orders</span>
            </Link>
            <Link
              href="/account/wishlist"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Wishlist</span>
            </Link>
            <Link
              href="/account/addresses"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
            >
              <MapPin className="w-4 h-4" />
              <span>Addresses</span>
            </Link>
            <Link
              href="/account/settings"
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-accent-700 hover:bg-accent-50 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Sign Out */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors w-full"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3 space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-green-600">€</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatPrice(stats?.totalSpent || 0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Wishlist Items</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.wishlistItems || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Saved Addresses</p>
                <p className="text-2xl font-bold text-gray-900">{stats?.savedAddresses || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
              <Link
                href="/account/orders"
                className="text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                View all orders
              </Link>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">{order.date}</p>
                        </div>
                        <div>
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            order.status === 'completed' ? 'bg-green-100 text-green-800' :
                            order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {order.items} item{order.items !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatPrice(order.total)}</p>
                      <Link
                        href={`/account/orders/${order.id}`}
                        className="text-sm text-accent-600 hover:text-accent-700"
                      >
                        View details
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center">
                <p className="text-gray-500">No orders yet</p>
                <Link
                  href="/shop"
                  className="text-sm text-accent-600 hover:text-accent-700 mt-2 inline-block"
                >
                  Start shopping
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/shop">
              <Button variant="outline" className="w-full justify-start">
                <Package className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
            <Link href="/account/wishlist">
              <Button variant="outline" className="w-full justify-start">
                <Heart className="w-4 h-4 mr-2" />
                View Wishlist
              </Button>
            </Link>
            <Link href="/account/addresses">
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="w-4 h-4 mr-2" />
                Manage Addresses
              </Button>
            </Link>
            <Link href="/account/settings">
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Account Settings
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

