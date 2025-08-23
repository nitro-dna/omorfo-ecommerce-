'use client'

import { useState } from 'react'
import { StripePayment } from '@/components/checkout/stripe-payment'

export default function TestPayPalPage() {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [amount, setAmount] = useState<number>(1000)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<string>('')

  const createPaymentIntent = async () => {
    setIsLoading(true)
    setResult('')
    
    try {
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount / 100, // Convert cents to euros
          currency: 'eur',
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setClientSecret(data.clientSecret)
        setResult(`✅ Payment Intent created successfully!
Payment Intent ID: ${data.paymentIntentId}
Payment Methods: ${data.paymentMethodTypes?.join(', ') || 'None'}
Is Mock: ${data.isMock}`)
      } else {
        setResult(`❌ Error: ${data.error}`)
      }
    } catch (error) {
      setResult(`❌ Network Error: ${error}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handlePaymentSuccess = (paymentIntentId: string) => {
    setResult(`🎉 Payment successful! Payment Intent ID: ${paymentIntentId}`)
  }

  const handlePaymentError = (error: string) => {
    setResult(`❌ Payment failed: ${error}`)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">PayPal + Stripe Integration Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Test Controls */}
        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount (in cents)
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-accent-500"
                  placeholder="1000"
                />
                <p className="text-sm text-gray-500 mt-1">
                  €{(amount / 100).toFixed(2)}
                </p>
              </div>

              <button
                onClick={createPaymentIntent}
                disabled={isLoading}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Payment Intent'}
              </button>
            </div>
          </div>

          {/* Results */}
          {result && (
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Results</h3>
              <pre className="text-sm bg-white p-3 rounded border overflow-auto">
                {result}
              </pre>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3 text-blue-800">Instructions</h3>
            <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
              <li>Set the amount you want to test</li>
              <li>Click "Create Payment Intent"</li>
              <li>If successful, the payment form will appear</li>
              <li>Choose PayPal or Card as payment method</li>
              <li>Complete the payment process</li>
              <li>Check the results below</li>
            </ol>
          </div>
        </div>

        {/* Payment Form */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Payment Form</h2>
            
            {clientSecret ? (
              <StripePayment
                clientSecret={clientSecret}
                amount={amount / 100}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>Create a payment intent to see the payment form</p>
              </div>
            )}
          </div>

          {/* Current Payment Methods */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">Available Payment Methods</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-gray-200 rounded border"></div>
                <span className="text-sm">Credit/Debit Cards</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-blue-100 rounded border flex items-center justify-center">
                  <span className="text-xs font-bold text-blue-600">P</span>
                </div>
                <span className="text-sm">PayPal (if enabled in Stripe dashboard)</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-4 bg-gray-200 rounded border"></div>
                <span className="text-sm">Other local payment methods</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 bg-yellow-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Important Notes</h3>
        <ul className="text-sm text-yellow-700 space-y-2 list-disc list-inside">
          <li>PayPal must be enabled in your Stripe dashboard to appear as a payment option</li>
          <li>Test mode uses Stripe's test environment - no real charges</li>
          <li>PayPal availability depends on your Stripe account country</li>
          <li>For production, ensure business verification is complete</li>
        </ul>
      </div>
    </div>
  )
}
