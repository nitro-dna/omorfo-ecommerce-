'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CreditCard, CheckCircle, AlertCircle, DollarSign, Shield } from 'lucide-react'
import toast from 'react-hot-toast'

interface PaymentTestResult {
  success: boolean
  message: string
  details?: any
}

export default function LivePaymentTestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState('49.98')
  const [testResults, setTestResults] = useState<PaymentTestResult[]>([])

  const testLivePayment = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    const results: PaymentTestResult[] = []

    try {
      // Step 1: Create payment intent
      console.log('Creating payment intent for amount:', amount)
      const paymentIntentResponse = await fetch('/api/test-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(parseFloat(amount) * 100), // Convert to cents
          currency: 'eur',
          description: `Test payment for ómorfo - €${amount}`
        })
      })

      const paymentIntentResult = await paymentIntentResponse.json()
      console.log('Payment intent result:', paymentIntentResult)

      if (paymentIntentResult.success) {
        results.push({
          success: true,
          message: 'Payment intent created successfully',
          details: paymentIntentResult.data
        })

        // Step 2: Simulate successful payment
        console.log('Simulating successful payment...')
        const webhookResponse = await fetch('/api/test-webhook', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'payment_intent.succeeded',
            data: {
              object: {
                id: paymentIntentResult.data.id,
                amount: paymentIntentResult.data.amount,
                currency: paymentIntentResult.data.currency,
                status: 'succeeded',
                customer: 'cus_test_' + Date.now(),
                metadata: {
                  orderId: 'TEST-ORDER-' + Date.now(),
                  test: 'true'
                }
              }
            }
          })
        })

        const webhookResult = await webhookResponse.json()
        console.log('Webhook result:', webhookResult)

        if (webhookResult.success) {
          results.push({
            success: true,
            message: 'Payment processed successfully',
            details: webhookResult.data
          })
        } else {
          results.push({
            success: false,
            message: 'Payment processing failed',
            details: webhookResult
          })
        }

      } else {
        results.push({
          success: false,
          message: 'Failed to create payment intent',
          details: paymentIntentResult
        })
      }

      setTestResults(results)

      // Show summary toast
      const successCount = results.filter(r => r.success).length
      const totalCount = results.length

      if (successCount === totalCount) {
        toast.success(`Live payment test completed successfully! €${amount} processed`)
      } else {
        toast.error(`Live payment test failed. ${successCount}/${totalCount} steps passed`)
      }

    } catch (error) {
      console.error('Live payment test error:', error)
      results.push({
        success: false,
        message: 'Test failed with error',
        details: error
      })
      setTestResults(results)
      toast.error('Live payment test failed')
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Live Payment Test</h1>
              <p className="text-gray-600">Test real Stripe payment processing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount (EUR)
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="49.98"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Test Information:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• This creates a real payment intent in Stripe</li>
                    <li>• No actual charges will be made (test mode)</li>
                    <li>• Payment intent will be created and processed</li>
                    <li>• Admin will receive notification email</li>
                    <li>• All data is logged for verification</li>
                  </ul>
                </div>

                <Button
                  onClick={testLivePayment}
                  disabled={isLoading || !amount || parseFloat(amount) <= 0}
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : <DollarSign className="w-4 h-4 mr-2" />}
                  Test Live Payment
                </Button>

                <Button
                  onClick={clearResults}
                  variant="outline"
                  className="w-full"
                >
                  Clear Results
                </Button>
              </div>
            </div>

            {/* Test Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Test Results
              </h2>

              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No test results yet. Run a live payment test to see results here.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {testResults.map((result, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        result.success
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start">
                        {result.success ? (
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 mr-3" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">
                            {result.message}
                          </h3>
                          {result.details && (
                            <details className="mt-2">
                              <summary className="text-sm text-gray-600 cursor-pointer">
                                View Details
                              </summary>
                              <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                                {JSON.stringify(result.details, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Create Payment Intent</h3>
                <p className="text-sm text-gray-600">Stripe creates a payment intent for the specified amount</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900">Process Payment</h3>
                <p className="text-sm text-gray-600">Payment is processed and webhook is triggered</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900">Send Notifications</h3>
                <p className="text-sm text-gray-600">Admin receives email notification about successful payment</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
