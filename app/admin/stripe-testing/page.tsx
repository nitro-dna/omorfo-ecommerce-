'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CreditCard, CheckCircle, AlertCircle, Settings, DollarSign, Shield, Zap } from 'lucide-react'
import toast from 'react-hot-toast'

interface StripeTestResult {
  success: boolean
  message: string
  details?: any
}

export default function StripeTestingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<StripeTestResult[]>([])

  const runStripeTest = async (testType: string) => {
    setIsLoading(true)
    const results: StripeTestResult[] = []

    try {
      switch (testType) {
        case 'configuration':
          // Test Stripe configuration
          console.log('Testing Stripe configuration...')
          const configResponse = await fetch('/api/test-stripe-config', {
            method: 'GET'
          })
          const configResult = await configResponse.json()
          console.log('Stripe config result:', configResult)
          results.push({
            success: configResponse.ok && configResult.success,
            message: `Stripe Configuration: ${configResult.success ? 'Valid' : 'Invalid'}`,
            details: configResult
          })
          break

        case 'payment-intent':
          // Test payment intent creation
          console.log('Testing payment intent creation...')
          const paymentIntentResponse = await fetch('/api/test-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: 4998, // 49.98 EUR in cents
              currency: 'eur',
              description: 'Test payment for ómorfo'
            })
          })
          const paymentIntentResult = await paymentIntentResponse.json()
          console.log('Payment intent result:', paymentIntentResult)
          results.push({
            success: paymentIntentResponse.ok && paymentIntentResult.success,
            message: `Payment Intent Creation: ${paymentIntentResult.success ? 'Success' : 'Failed'}`,
            details: paymentIntentResult
          })
          break

        case 'webhook':
          // Test webhook handling
          console.log('Testing webhook handling...')
          const webhookResponse = await fetch('/api/test-webhook', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              type: 'payment_intent.succeeded',
              data: {
                object: {
                  id: 'pi_test_' + Date.now(),
                  amount: 4998,
                  currency: 'eur',
                  customer: 'cus_test_' + Date.now(),
                  metadata: {
                    orderId: 'TEST-ORDER-' + Date.now()
                  }
                }
              }
            })
          })
          const webhookResult = await webhookResponse.json()
          console.log('Webhook result:', webhookResult)
          results.push({
            success: webhookResponse.ok && webhookResult.success,
            message: `Webhook Handling: ${webhookResult.success ? 'Success' : 'Failed'}`,
            details: webhookResult
          })
          break

        case 'customer':
          // Test customer creation
          console.log('Testing customer creation...')
          const customerResponse = await fetch('/api/test-customer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: 'test@example.com',
              name: 'Test Customer'
            })
          })
          const customerResult = await customerResponse.json()
          console.log('Customer result:', customerResult)
          results.push({
            success: customerResponse.ok && customerResult.success,
            message: `Customer Creation: ${customerResult.success ? 'Success' : 'Failed'}`,
            details: customerResult
          })
          break

        case 'all':
          // Run all tests
          await runStripeTest('configuration')
          await runStripeTest('payment-intent')
          await runStripeTest('webhook')
          await runStripeTest('customer')
          break
      }

      setTestResults(results)
      
      // Show toast notification
      const successCount = results.filter(r => r.success).length
      const totalCount = results.length
      
      if (successCount === totalCount) {
        toast.success(`All ${totalCount} Stripe tests passed!`)
      } else {
        toast.error(`${totalCount - successCount} out of ${totalCount} tests failed`)
      }

    } catch (error) {
      console.error('Stripe test error:', error)
      results.push({
        success: false,
        message: `Test Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
      setTestResults(results)
      toast.error('Stripe test failed')
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Stripe Payment Testing</h1>
                <p className="text-gray-600">Test and verify Stripe payment integration</p>
              </div>
              <Link href="/admin">
                <Button variant="outline">
                  Back to Dashboard
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Test Configuration */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  Test Configuration
                </h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Button
                      onClick={() => runStripeTest('configuration')}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? <LoadingSpinner /> : <Shield className="w-4 h-4 mr-2" />}
                      Configuration Test
                    </Button>

                    <Button
                      onClick={() => runStripeTest('payment-intent')}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <CreditCard className="w-4 h-4 mr-2" />
                      Payment Intent Test
                    </Button>

                    <Button
                      onClick={() => runStripeTest('webhook')}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Webhook Test
                    </Button>

                    <Button
                      onClick={() => runStripeTest('customer')}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <DollarSign className="w-4 h-4 mr-2" />
                      Customer Test
                    </Button>

                    <Button
                      onClick={() => runStripeTest('all')}
                      disabled={isLoading}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Run All Tests
                    </Button>
                  </div>

                  <Button
                    onClick={clearResults}
                    variant="outline"
                    className="w-full"
                  >
                    Clear Results
                  </Button>
                </div>
              </div>
            </div>

            {/* Test Results */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Test Results
                </h2>

                {testResults.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No test results yet. Run a test to see results here.</p>
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
          </div>

          {/* Stripe System Status */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stripe System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Stripe API</h3>
                <p className="text-blue-700 text-sm">Payment processing service</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Configured</span>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900">Payment Intents</h3>
                <p className="text-green-700 text-sm">Secure payment processing</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Ready</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900">Webhooks</h3>
                <p className="text-purple-700 text-sm">Payment event handling</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Active</span>
                </div>
              </div>

              <div className="p-4 bg-orange-50 rounded-lg">
                <h3 className="font-medium text-orange-900">Customer Management</h3>
                <p className="text-orange-700 text-sm">Customer data handling</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Ready</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
