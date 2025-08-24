'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package, 
  Calendar,
  Filter,
  Download,
  RefreshCw,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AnalyticsOverview } from '@/components/charts/analytics-overview'

interface AnalyticsData {
  revenue: {
    total: number
    monthly: number
    weekly: number
    daily: number
  }
  orders: {
    total: number
    pending: number
    completed: number
    cancelled: number
  }
  customers: {
    total: number
    new: number
    active: number
  }
  products: {
    total: number
    inStock: number
    lowStock: number
  }
  charts: {
    revenueByMonth: Array<{ month: string; revenue: number }>
    ordersByStatus: Array<{ status: string; count: number }>
    topProducts: Array<{ name: string; sales: number }>
    customerGrowth: Array<{ month: string; customers: number }>
  }
}

export default function AdvancedAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [timeRange, setTimeRange] = useState('30d')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/admin/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      
      if (data.success) {
        setAnalyticsData(data.data)
        setLastUpdated(new Date())
        toast.success('Analytics data updated')
      } else {
        toast.error('Failed to fetch analytics data')
      }
    } catch (error) {
      console.error('Analytics fetch error:', error)
      toast.error('Failed to fetch analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('de-DE', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('de-DE').format(num)
  }

  if (isLoading && !analyticsData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="mt-4 text-gray-600">Loading advanced analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Analytics</h1>
                <p className="text-gray-600">Deep insights and detailed business analytics</p>
              </div>
              <div className="flex items-center space-x-4">
                <select
                  value={timeRange}
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="7d">Last 7 days</option>
                  <option value="30d">Last 30 days</option>
                  <option value="90d">Last 90 days</option>
                  <option value="1y">Last year</option>
                </select>
                <Button onClick={fetchAnalytics} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Link href="/admin">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
            {lastUpdated && (
              <p className="text-sm text-gray-500 mt-2">
                Last updated: {lastUpdated.toLocaleString('de-DE')}
              </p>
            )}
          </div>

          {analyticsData && (
            <>
              {/* Key Performance Indicators */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-sm p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <DollarSign className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Total Revenue</p>
                      <p className="text-2xl font-bold">
                        {formatCurrency(analyticsData.revenue.total)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm opacity-90">+12.5% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-sm p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <ShoppingCart className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Total Orders</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(analyticsData.orders.total)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm opacity-90">+8.2% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-sm p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <Users className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Total Customers</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(analyticsData.customers.total)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm opacity-90">+15.3% from last month</span>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-sm p-6 text-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium opacity-90">Total Products</p>
                      <p className="text-2xl font-bold">
                        {formatNumber(analyticsData.products.total)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className="text-sm opacity-90">+5.7% from last month</span>
                  </div>
                </div>
              </div>

              {/* Advanced Charts */}
              <div className="mb-6">
                <AnalyticsOverview 
                  revenueData={analyticsData.charts.revenueByMonth}
                  ordersData={analyticsData.charts.ordersByStatus}
                  productsData={analyticsData.charts.topProducts}
                  customerGrowthData={analyticsData.charts.customerGrowth}
                />
              </div>

              {/* Additional Insights */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Conversion Rate */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Activity className="w-5 h-5 mr-2" />
                    Conversion Rate
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600 mb-2">3.2%</div>
                    <p className="text-sm text-gray-600">Website visitors to customers</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '32%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Average Order Value */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2" />
                    Average Order Value
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {formatCurrency(analyticsData.revenue.total / Math.max(analyticsData.orders.total, 1))}
                    </div>
                    <p className="text-sm text-gray-600">Per order</p>
                    <div className="mt-4">
                      <span className="text-sm text-green-600">+5.2% from last month</span>
                    </div>
                  </div>
                </div>

                {/* Customer Retention */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <PieChart className="w-5 h-5 mr-2" />
                    Customer Retention
                  </h3>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-purple-600 mb-2">87%</div>
                    <p className="text-sm text-gray-600">Repeat customers</p>
                    <div className="mt-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Link href="/admin/orders">
                    <Button variant="outline" className="w-full">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View Orders
                    </Button>
                  </Link>
                  <Link href="/admin/customers">
                    <Button variant="outline" className="w-full">
                      <Users className="w-4 h-4 mr-2" />
                      Manage Customers
                    </Button>
                  </Link>
                  <Link href="/admin/products">
                    <Button variant="outline" className="w-full">
                      <Package className="w-4 h-4 mr-2" />
                      Manage Products
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export Report
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
