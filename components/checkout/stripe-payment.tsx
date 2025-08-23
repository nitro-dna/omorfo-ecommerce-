'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = (() => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY
  console.log('Stripe publishable key available:', !!publishableKey)
  console.log('Stripe publishable key starts with:', publishableKey?.substring(0, 10))
  
  if (!publishableKey) {
    console.error('Stripe publishable key not found. Please check your environment variables.')
    return null
  }
  
  try {
    return loadStripe(publishableKey)
  } catch (error) {
    console.error('Failed to load Stripe:', error)
    return null
  }
})()

interface StripePaymentProps {
  clientSecret: string
  amount: number
  onSuccess: (paymentIntentId: string) => void
  onError: (error: string) => void
}

function CheckoutForm({ amount, onSuccess, onError }: Omit<StripePaymentProps, 'clientSecret'>) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsProcessing(true)
    setMessage('')

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      })

      if (error) {
        setMessage(error.message || 'An error occurred')
        onError(error.message || 'Payment failed')
        toast.error('Payment failed. Please try again.')
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        setMessage('Payment successful!')
        onSuccess(paymentIntent.id)
        toast.success('Payment successful!')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setMessage('An unexpected error occurred')
      onError('Payment failed')
      toast.error('Payment failed. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <p className="text-sm text-gray-600 mb-4">
          Your payment information is secure and encrypted. We accept credit cards and PayPal.
        </p>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-8 h-6 bg-gray-200 rounded border"></div>
            <div className="w-8 h-6 bg-gray-200 rounded border"></div>
            <div className="w-8 h-6 bg-gray-200 rounded border"></div>
            <div className="w-8 h-6 bg-gray-200 rounded border"></div>
          </div>
          <span className="text-xs text-gray-500">Secure payment powered by Stripe</span>
        </div>
        <div className="mt-2 flex items-center space-x-2">
          <div className="w-8 h-6 bg-blue-100 rounded border flex items-center justify-center">
            <span className="text-xs font-bold text-blue-600">P</span>
          </div>
          <span className="text-xs text-gray-500">PayPal accepted</span>
        </div>
      </div>

      <PaymentElement 
        options={{
          layout: 'tabs',
          paymentMethodOrder: ['paypal', 'card'],
        }}
      />

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes('successful') 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Pay ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'EUR',
        }).format(amount)}`}
      </Button>
    </form>
  )
}

export function StripePayment({ clientSecret, amount, onSuccess, onError }: StripePaymentProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500"></div>
      </div>
    )
  }

  // Check if Stripe is available
  if (!stripePromise) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-medium text-red-800">
              Stripe Configuration Error
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>Stripe is not properly configured. Please check:</p>
              <ul className="list-disc list-inside mt-1 space-y-1">
                <li>Environment variables are set correctly</li>
                <li>Stripe publishable key is valid</li>
                <li>Network connection is stable</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#f97316', // accent-500
            colorBackground: '#ffffff',
            colorText: '#374151',
            colorDanger: '#ef4444',
            fontFamily: 'Inter, system-ui, sans-serif',
            spacingUnit: '4px',
            borderRadius: '8px',
          },
        },
        loader: 'always',
      }}
    >
      <CheckoutForm amount={amount} onSuccess={onSuccess} onError={onError} />
    </Elements>
  )
}
