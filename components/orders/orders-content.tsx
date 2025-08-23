'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  Eye,
  Download
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { useSession } from 'next-auth/react'
import { normalizeProduct } from '@/lib/utils'
import { formatPrice } from '@/lib/utils'
import toast from 'react-hot-toast'

interface OrderItem {
  id: string
  order_id: string
  product_id: string
  quantity: number
  price: number
  size: string
  frame: string
  options: any
  product: any
}

interface Order {
  id: string
  user_id: string
  status: string
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  promo_code: string | null
  payment_intent_id: string | null
  shipping_address: any
  billing_address: any
  notes: string | null
  tracking_number: string | null
  created_at: string
  updated_at: string
  order_items: OrderItem[]
}

const getStatusIcon = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />
    case 'processing':
      return <Package className="w-5 h-5 text-blue-500" />
    case 'shipped':
      return <Truck className="w-5 h-5 text-purple-500" />
    case 'delivered':
      return <CheckCircle className="w-5 h-5 text-green-500" />
    case 'cancelled':
      return <CheckCircle className="w-5 h-5 text-red-500" />
    default:
      return <Clock className="w-5 h-5 text-gray-500" />
  }
}

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'processing':
      return 'bg-blue-100 text-blue-800'
    case 'shipped':
      return 'bg-purple-100 text-purple-800'
    case 'delivered':
      return 'bg-green-100 text-green-800'
    case 'cancelled':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export function OrdersContent() {
  const { data: session } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Fetch orders
  const fetchOrders = async (page = 1) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`/api/supabase/orders?page=${page}&limit=10`)
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.data || [])
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  // Download invoice
  const downloadInvoice = (order: Order) => {
    const invoiceContent = `
INVOICE - ómorfo

Order ID: ${order.id}
Date: ${new Date(order.created_at).toLocaleDateString()}
Status: ${order.status.toUpperCase()}

BILLING ADDRESS:
${order.billing_address?.name || 'N/A'}
${order.billing_address?.address || 'N/A'}
${order.billing_address?.city || 'N/A'}, ${order.billing_address?.state || 'N/A'} ${order.billing_address?.zip || 'N/A'}
${order.billing_address?.country || 'N/A'}

SHIPPING ADDRESS:
${order.shipping_address?.name || 'N/A'}
${order.shipping_address?.address || 'N/A'}
${order.shipping_address?.city || 'N/A'}, ${order.shipping_address?.state || 'N/A'} ${order.shipping_address?.zip || 'N/A'}
${order.shipping_address?.country || 'N/A'}

ITEMS:
${order.order_items.map(item => {
  const product = normalizeProduct(item.product)
  return `${product.name} - ${item.size} - ${item.frame} - Qty: ${item.quantity} - ${formatPrice(item.price)}`
}).join('\n')}

SUBTOTAL: ${formatPrice(order.subtotal)}
TAX: ${formatPrice(order.tax)}
SHIPPING: ${formatPrice(order.shipping)}
DISCOUNT: ${formatPrice(order.discount)}
TOTAL: ${formatPrice(order.total)}

${order.notes ? `NOTES: ${order.notes}` : ''}
${order.tracking_number ? `TRACKING: ${order.tracking_number}` : ''}

Thank you for your order!
ómorfo - Custom Posters
    `.trim()

    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${order.id}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Invoice downloaded')
  }

  // Fetch orders on mount
  useEffect(() => {
    if (session) {
      fetchOrders(currentPage)
    }
  }, [session, currentPage])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchOrders(currentPage)}
          className="inline-flex items-center px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Show empty state
  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-primary-300 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-primary-800 mb-2">
          No Orders Yet
        </h2>
        <p className="text-primary-600 mb-6">
          Start shopping to see your orders here
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Orders List */}
      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-white rounded-lg shadow-sm border border-primary-200 overflow-hidden"
        >
          {/* Order Header */}
          <div className="p-6 border-b border-primary-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-primary-800">
                    Order #{order.id.slice(-8)}
                  </h3>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{order.status}</span>
                  </span>
                </div>
                <p className="text-sm text-primary-600">
                  Placed on {new Date(order.created_at).toLocaleDateString()}
                </p>
                {order.tracking_number && (
                  <p className="text-sm text-primary-600 mt-1">
                    Tracking: {order.tracking_number}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => downloadInvoice(order)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-primary-700 bg-primary-100 rounded-lg hover:bg-primary-200 transition-colors"
                >
                  <Download className="w-4 h-4 mr-1" />
                  Invoice
                </button>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-accent-500 rounded-lg hover:bg-accent-600 transition-colors"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Link>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="p-6">
            <div className="space-y-4">
              {order.order_items.map((item) => {
                const product = normalizeProduct(item.product)
                
                return (
                  <div
                    key={item.id}
                    className="flex items-center space-x-4"
                  >
                    {/* Product Image */}
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-primary-800 truncate">
                        {product.name}
                      </h4>
                      <p className="text-sm text-primary-600">
                        Size: {item.size} | Frame: {item.frame} | Qty: {item.quantity}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="text-right">
                      <p className="font-medium text-primary-800">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Order Summary */}
            <div className="mt-6 pt-6 border-t border-primary-200">
              <div className="flex justify-between text-sm">
                <span className="text-primary-600">Subtotal:</span>
                <span className="text-primary-800">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-600">Tax:</span>
                <span className="text-primary-800">{formatPrice(order.tax)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-primary-600">Shipping:</span>
                <span className="text-primary-800">{formatPrice(order.shipping)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-primary-600">Discount:</span>
                  <span className="text-primary-800">-{formatPrice(order.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-lg font-semibold mt-2 pt-2 border-t border-primary-200">
                <span className="text-primary-800">Total:</span>
                <span className="text-primary-800">{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center space-x-2">
          <button
            onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="px-3 py-2 text-sm text-primary-600">
            Page {currentPage} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 text-sm font-medium text-primary-700 bg-white border border-primary-300 rounded-lg hover:bg-primary-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
