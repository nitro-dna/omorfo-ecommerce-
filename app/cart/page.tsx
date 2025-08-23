import { Suspense } from 'react'
import { CartContent } from '@/components/cart/cart-content'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Shopping Cart - ómorfo',
  description: 'Review your cart items and proceed to checkout.',
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Shopping Cart
          </h1>
          <p className="text-lg text-gray-600">
            Review your items and proceed to checkout
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CartContent />
        </Suspense>
      </div>
    </div>
  )
}

