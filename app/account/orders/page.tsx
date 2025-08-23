'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { OrdersContent } from '@/components/orders/orders-content'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <section className="bg-white border-b border-primary-200">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-display font-semibold text-primary-800 mb-2">
                My Orders
              </h1>
              <p className="text-primary-600">
                Track your orders and view order history
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-8">
        <div className="container-custom">
          <Suspense fallback={
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          }>
            <OrdersContent />
          </Suspense>
        </div>
      </section>
    </div>
  )
}
