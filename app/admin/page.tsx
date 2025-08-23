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
