'use client'

import { useState, useEffect } from 'react'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingCart, 
  Users, 
  Eye,
  BarChart3,
  PieChart,
  Calendar,
  Download,
  RefreshCw,
  Filter
} from 'lucide-react'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface AnalyticsData {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  totalViews: number
  salesGrowth: number
  ordersGrowth: number
  customersGrowth: number
  viewsGrowth: number
  topProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  salesByCategory: Array<{
    category: string
    sales: number
    revenue: number
  }>
  salesByDay: Array<{
    date: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    customer: string
    amount: number
    status: string
    date: string
  }>
}

interface AnalyticsDashboardProps {
  className?: string
}

export function AnalyticsDashboard({ className = '' }: AnalyticsDashboardProps) {
  const { data: session } = useSession()
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  // Load analytics data
  const loadAnalyticsData = async () => {
    if (!session?.user?.email) return

    try {
      setIsLoading(true)

      // Get user ID for admin access
      const { data: user } = await supabase
        .from('users')
        .select('id, role')
        .eq('email', session.user.email)
        .single()

      if (!user || user.role !== 'admin') {
        toast.error('Admin access required')
        return
      }

      // Calculate date range
      const endDate = new Date()
      const startDate = new Date()
      switch (timeRange) {
        case '7d':
          startDate.setDate(endDate.getDate() - 7)
          break
        case '30d':
          startDate.setDate(endDate.getDate() - 30)
          break
        case '90d':
          startDate.setDate(endDate.getDate() - 90)
          break
        case '1y':
          startDate.setFullYear(endDate.getFullYear() - 1)
          break
      }

      // Fetch orders data
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())

      // Fetch products data
      const { data: products } = await supabase
        .from('products')
        .select('*')

      // Fetch users data
      const { data: users } = await supabase
        .from('users')
        .select('*')
        .gte('created_at', startDate.toISOString())

      // Calculate analytics
      const analyticsData = calculateAnalytics(orders || [], products || [], users || [], timeRange)
      setData(analyticsData)
      setLastUpdated(new Date())

    } catch (error) {
      console.error('Analytics error:', error)
      toast.error('Failed to load analytics data')
    } finally {
      setIsLoading(false)
    }
  }

  // Calculate analytics from raw data
  const calculateAnalytics = (
    orders: any[],
    products: any[],
    users: any[],
    range: string
  ): AnalyticsData => {
    // Calculate totals
    const totalSales = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    const totalOrders = orders.length
    const totalCustomers = new Set(orders.map(order => order.user_id)).size
    const totalViews = products.reduce((sum, product) => sum + (product.view_count || 0), 0)

    // Calculate growth (simplified - in real app you'd compare with previous period)
    const salesGrowth = 12.5 // Mock data
    const ordersGrowth = 8.3
    const customersGrowth = 15.7
    const viewsGrowth = 22.1

    // Top products
    const productSales = orders.reduce((acc: any, order) => {
      order.items?.forEach((item: any) => {
        if (!acc[item.product_id]) {
          acc[item.product_id] = { sales: 0, revenue: 0 }
        }
        acc[item.product_id].sales += item.quantity
        acc[item.product_id].revenue += item.price * item.quantity
      })
      return acc
    }, {})

    const topProducts = Object.entries(productSales)
      .map(([productId, data]: [string, any]) => {
        const product = products.find(p => p.id === productId)
        return {
          id: productId,
          name: product?.name || 'Unknown Product',
          sales: data.sales,
          revenue: data.revenue
        }
      })
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5)

    // Sales by category
    const categorySales = orders.reduce((acc: any, order) => {
      order.items?.forEach((item: any) => {
        const product = products.find(p => p.id === item.product_id)
        const category = product?.category_id || 'Unknown'
        if (!acc[category]) {
          acc[category] = { sales: 0, revenue: 0 }
        }
        acc[category].sales += item.quantity
        acc[category].revenue += item.price * item.quantity
      })
      return acc
    }, {})

    const salesByCategory = Object.entries(categorySales)
      .map(([category, data]: [string, any]) => ({
        category,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)

    // Sales by day
    const dailySales = orders.reduce((acc: any, order) => {
      const date = new Date(order.created_at).toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { sales: 0, revenue: 0 }
      }
      acc[date].sales += 1
      acc[date].revenue += order.total_amount || 0
      return acc
    }, {})

    const salesByDay = Object.entries(dailySales)
      .map(([date, data]: [string, any]) => ({
        date,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Recent orders
    const recentOrders = orders
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10)
      .map(order => ({
        id: order.id,
        customer: order.customer_name || 'Unknown Customer',
        amount: order.total_amount || 0,
        status: order.status || 'pending',
        date: new Date(order.created_at).toLocaleDateString()
      }))

    return {
      totalSales,
      totalOrders,
      totalCustomers,
      totalViews,
      salesGrowth,
      ordersGrowth,
      customersGrowth,
      viewsGrowth,
      topProducts,
      salesByCategory,
      salesByDay,
      recentOrders
    }
  }

  // Load data on mount and time range change
  useEffect(() => {
    loadAnalyticsData()
  }, [session, timeRange])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      loadAnalyticsData()
    }, 5 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500"></div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className={`p-6 ${className}`}>
        <div className="text-center text-gray-500">
          <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No analytics data available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h2>
          <p className="text-gray-600">Real-time insights into your business performance</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={loadAnalyticsData}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Updated {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Sales"
          value={`€${data.totalSales.toLocaleString()}`}
          change={data.salesGrowth}
          icon={DollarSign}
          color="green"
        />
        <MetricCard
          title="Total Orders"
          value={data.totalOrders.toLocaleString()}
          change={data.ordersGrowth}
          icon={ShoppingCart}
          color="blue"
        />
        <MetricCard
          title="Total Customers"
          value={data.totalCustomers.toLocaleString()}
          change={data.customersGrowth}
          icon={Users}
          color="purple"
        />
        <MetricCard
          title="Total Views"
          value={data.totalViews.toLocaleString()}
          change={data.viewsGrowth}
          icon={Eye}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Sales Trend</h3>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 flex items-end justify-between space-x-2">
            {data.salesByDay.map((day, index) => (
              <div key={day.date} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-accent-500 rounded-t"
                  style={{
                    height: `${(day.revenue / Math.max(...data.salesByDay.map(d => d.revenue))) * 200}px`
                  }}
                ></div>
                <span className="text-xs text-gray-500 mt-2">
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Products</h3>
            <button className="p-2 text-gray-600 hover:text-gray-800">
              <PieChart className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {data.topProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500' :
                    index === 1 ? 'bg-gray-400' :
                    index === 2 ? 'bg-orange-500' : 'bg-gray-300'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sold</p>
                  </div>
                </div>
                <span className="font-semibold text-gray-900">
                  €{product.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>
          <button className="text-sm text-accent-600 hover:text-accent-700">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Order ID</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {data.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">#{order.id.slice(0, 8)}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">{order.customer}</td>
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">
                    €{order.amount.toFixed(2)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' :
                      order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'pending' ? 'bg-gray-100 text-gray-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
interface MetricCardProps {
  title: string
  value: string
  change: number
  icon: any
  color: 'green' | 'blue' | 'purple' | 'orange'
}

function MetricCard({ title, value, change, icon: Icon, color }: MetricCardProps) {
  const colorClasses = {
    green: 'text-green-600 bg-green-100',
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    orange: 'text-orange-600 bg-orange-100'
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        {change >= 0 ? (
          <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm font-medium ${
          change >= 0 ? 'text-green-600' : 'text-red-600'
        }`}>
          {change >= 0 ? '+' : ''}{change.toFixed(1)}%
        </span>
        <span className="text-sm text-gray-500 ml-1">from last period</span>
      </div>
    </div>
  )
}
