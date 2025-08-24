import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link href="/admin/add-product">
                <div className="bg-accent-50 border border-accent-200 rounded-lg p-6 hover:bg-accent-100 transition-colors">
                  <h2 className="text-xl font-semibold text-accent-900 mb-2">Add Product</h2>
                  <p className="text-accent-700">Create a new product listing</p>
                </div>
              </Link>
              
              <Link href="/admin/products">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors">
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">Manage Products</h2>
                  <p className="text-blue-700">View and edit existing products</p>
                </div>
              </Link>
              
              <Link href="/admin/categories">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 hover:bg-green-100 transition-colors">
                  <h2 className="text-xl font-semibold text-green-900 mb-2">Categories</h2>
                  <p className="text-green-700">Manage product categories</p>
                </div>
              </Link>
              
              <Link href="/admin/orders">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors">
                  <h2 className="text-xl font-semibold text-purple-900 mb-2">Orders</h2>
                  <p className="text-purple-700">View and manage orders</p>
                </div>
              </Link>
              
              <Link href="/admin/customers">
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 hover:bg-orange-100 transition-colors">
                  <h2 className="text-xl font-semibold text-orange-900 mb-2">Customers</h2>
                  <p className="text-orange-700">Manage customer accounts</p>
                </div>
              </Link>
              
              <Link href="/admin/analytics">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 hover:bg-red-100 transition-colors">
                  <h2 className="text-xl font-semibold text-red-900 mb-2">Analytics</h2>
                  <p className="text-red-700">View sales and performance data</p>
                </div>
              </Link>
              
              <Link href="/admin/email-testing">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 hover:bg-indigo-100 transition-colors">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-2">Email Testing</h2>
                  <p className="text-indigo-700">Test and verify email functionality</p>
                </div>
              </Link>
              
              <Link href="/admin/email-logs">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 hover:bg-teal-100 transition-colors">
                  <h2 className="text-xl font-semibold text-teal-900 mb-2">Email Logs</h2>
                  <p className="text-teal-700">Track and manage all sent emails</p>
                </div>
              </Link>
              
              <Link href="/test-real-order">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 hover:bg-amber-100 transition-colors">
                  <h2 className="text-xl font-semibold text-amber-900 mb-2">Real Order Test</h2>
                  <p className="text-amber-700">Test complete order process with emails</p>
                </div>
              </Link>
              
              <Link href="/admin/stripe-testing">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 hover:bg-indigo-100 transition-colors">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-2">Stripe Testing</h2>
                  <p className="text-indigo-700">Test Stripe payment integration</p>
                </div>
              </Link>
              
              <Link href="/test-live-payment">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6 hover:bg-emerald-100 transition-colors">
                  <h2 className="text-xl font-semibold text-emerald-900 mb-2">Live Payment Test</h2>
                  <p className="text-emerald-700">Test real Stripe payments</p>
                </div>
              </Link>
              
              <Link href="/admin/analytics-dashboard">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 hover:bg-blue-100 transition-colors">
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">Analytics Dashboard</h2>
                  <p className="text-blue-700">Comprehensive business insights</p>
                </div>
              </Link>
              
              <Link href="/admin/advanced-analytics">
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-6 hover:bg-indigo-100 transition-colors">
                  <h2 className="text-xl font-semibold text-indigo-900 mb-2">Advanced Analytics</h2>
                  <p className="text-indigo-700">Deep insights with interactive charts</p>
                </div>
              </Link>
              
              <Link href="/admin/customer-management">
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 hover:bg-purple-100 transition-colors">
                  <h2 className="text-xl font-semibold text-purple-900 mb-2">Customer Management</h2>
                  <p className="text-purple-700">Manage and analyze customers</p>
                </div>
              </Link>
              
              <Link href="/admin/order-tracking">
                <div className="bg-teal-50 border border-teal-200 rounded-lg p-6 hover:bg-teal-100 transition-colors">
                  <h2 className="text-xl font-semibold text-teal-900 mb-2">Order Tracking</h2>
                  <p className="text-teal-700">Track and manage orders</p>
                </div>
              </Link>
              
              <Link href="/admin/bulk-operations">
                <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-6 hover:bg-cyan-100 transition-colors">
                  <h2 className="text-xl font-semibold text-cyan-900 mb-2">Bulk Operations</h2>
                  <p className="text-cyan-700">Manage multiple items at once</p>
                </div>
              </Link>
              
              <Link href="/admin/email-templates">
                <div className="bg-pink-50 border border-pink-200 rounded-lg p-6 hover:bg-pink-100 transition-colors">
                  <h2 className="text-xl font-semibold text-pink-900 mb-2">Email Templates</h2>
                  <p className="text-pink-700">Create and manage email templates</p>
                </div>
              </Link>
              
              <Link href="/admin/notification-center">
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 hover:bg-amber-100 transition-colors">
                  <h2 className="text-xl font-semibold text-amber-900 mb-2">Notification Center</h2>
                  <p className="text-amber-700">Manage system notifications</p>
                </div>
              </Link>
            </div>
            
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link href="/">
                <Button variant="outline">
                  Back to Store
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
