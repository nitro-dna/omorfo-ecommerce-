import { Suspense } from 'react'
import { CheckoutForm } from '@/components/checkout/checkout-form'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Checkout - ómorfo',
  description: 'Complete your purchase with secure checkout.',
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Checkout
          </h1>
          <p className="text-lg text-gray-600">
            Complete your purchase securely
          </p>
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  )
}

