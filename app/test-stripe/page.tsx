'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

export default function TestStripePage() {
  const [stripeStatus, setStripeStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    testStripeConfiguration()
  }, [])

  const testStripeConfiguration = async () => {
    try {
      // Check environment variables
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY
      const secretKey = process.env.STRIPE_SECRET_KEY
      
      setEnvVars({
        publishableKey: publishableKey ? `${publishableKey.substring(0, 10)}...` : 'Not found',
        secretKey: secretKey ? `${secretKey.substring(0, 10)}...` : 'Not found',
        hasPublishableKey: !!publishableKey,
        hasSecretKey: !!secretKey,
        isLiveKey: publishableKey?.startsWith('pk_live_'),
        isTestKey: publishableKey?.startsWith('pk_test_'),
      })

      if (!publishableKey) {
        setStripeStatus('error')
        setErrorMessage('Stripe publishable key not found in environment variables')
        return
      }

      // Test loading Stripe
      console.log('Testing Stripe loading...')
      const stripe = await loadStripe(publishableKey)
      
      if (stripe) {
        console.log('Stripe loaded successfully:', stripe)
        setStripeStatus('success')
      } else {
        setStripeStatus('error')
        setErrorMessage('Failed to load Stripe - returned null')
      }
    } catch (error) {
      console.error('Stripe test error:', error)
      setStripeStatus('error')
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error occurred')
    }
  }

  const retryTest = () => {
    setStripeStatus('loading')
    setErrorMessage('')
    testStripeConfiguration()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Stripe Configuration Test
          </h1>
          <p className="text-lg text-gray-600">
            Test and diagnose Stripe.js loading issues
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stripe Test Results */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Stripe Loading Test</h2>
            
            <div className="space-y-4">
              {stripeStatus === 'loading' && (
                <div className="flex items-center space-x-3">
                  <LoadingSpinner />
                  <span className="text-gray-600">Testing Stripe configuration...</span>
                </div>
              )}

              {stripeStatus === 'success' && (
                <div className="flex items-center space-x-3 text-green-600">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Stripe loaded successfully!</span>
                </div>
              )}

              {stripeStatus === 'error' && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-red-600">
                    <XCircle className="w-5 h-5" />
                    <span className="font-medium">Stripe loading failed</span>
                  </div>
                  {errorMessage && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700">{errorMessage}</p>
                    </div>
                  )}
                </div>
              )}

              <Button
                onClick={retryTest}
                disabled={stripeStatus === 'loading'}
                className="w-full"
              >
                {stripeStatus === 'loading' ? <LoadingSpinner /> : 'Retry Test'}
              </Button>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Environment Variables</h2>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Publishable Key:</span>
                <span className={`text-sm font-medium ${envVars.hasPublishableKey ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.publishableKey}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Secret Key:</span>
                <span className={`text-sm font-medium ${envVars.hasSecretKey ? 'text-green-600' : 'text-red-600'}`}>
                  {envVars.secretKey}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Key Type:</span>
                <span className="text-sm font-medium">
                  {envVars.isLiveKey ? (
                    <span className="text-orange-600">Live Key</span>
                  ) : envVars.isTestKey ? (
                    <span className="text-blue-600">Test Key</span>
                  ) : (
                    <span className="text-gray-600">Unknown</span>
                  )}
                </span>
              </div>
            </div>

            {envVars.isLiveKey && (
              <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 text-orange-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">Live Key Detected</p>
                    <p className="text-xs text-orange-700 mt-1">
                      You're using a live Stripe key. Make sure this is intentional for production use.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Troubleshooting Guide */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Troubleshooting Guide</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. Check Environment Variables</h3>
              <p className="text-sm text-gray-600">
                Ensure your <code className="bg-gray-100 px-1 rounded">.env.local</code> file contains:
              </p>
              <pre className="bg-gray-100 p-3 rounded-lg text-xs mt-2 overflow-x-auto">
{`STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Restart Development Server</h3>
              <p className="text-sm text-gray-600">
                After updating environment variables, restart your Next.js development server:
              </p>
              <pre className="bg-gray-100 p-3 rounded-lg text-xs mt-2">
{`npm run dev`}
              </pre>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. Check Network Connection</h3>
              <p className="text-sm text-gray-600">
                Ensure your browser can access Stripe's CDN. Check for any network restrictions or firewall issues.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">4. Verify Stripe Account</h3>
              <p className="text-sm text-gray-600">
                Make sure your Stripe account is active and the API keys are valid. You can check this in your Stripe Dashboard.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
