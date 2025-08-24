'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { ShoppingCart, Mail, CheckCircle, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

interface OrderTestResult {
  success: boolean
  message: string
  details?: any
}

export default function TestRealOrderPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [testResults, setTestResults] = useState<OrderTestResult[]>([])

  const simulateRealOrder = async () => {
    if (!customerEmail || !customerName) {
      toast.error('Bitte füllen Sie alle Felder aus')
      return
    }

    setIsLoading(true)
    const results: OrderTestResult[] = []

    try {
      // Step 1: Create a test order using simplified API
      console.log('Creating test order...')
      const orderResponse = await fetch('/api/test-order-simulation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail,
          customerName
        })
      })

      const orderResult = await orderResponse.json()
      console.log('Order creation result:', orderResult)

      if (orderResult.success) {
        results.push({
          success: true,
          message: 'Order created successfully',
          details: { orderId: orderResult.orderId }
        })

        // Check email results
        if (orderResult.emails?.customer?.success) {
          results.push({
            success: true,
            message: 'Customer confirmation email sent successfully',
            details: orderResult.emails.customer
          })
        } else {
          results.push({
            success: false,
            message: 'Customer confirmation email failed',
            details: orderResult.emails?.customer
          })
        }

        if (orderResult.emails?.admin?.success) {
          results.push({
            success: true,
            message: 'Admin notification email sent successfully',
            details: orderResult.emails.admin
          })
        } else {
          results.push({
            success: false,
            message: 'Admin notification email failed',
            details: orderResult.emails?.admin
          })
        }

      } else {
        results.push({
          success: false,
          message: 'Failed to create order',
          details: orderResult
        })
      }

      setTestResults(results)

      // Show summary toast
      const successCount = results.filter(r => r.success).length
      const totalCount = results.length

      if (successCount === totalCount) {
        toast.success(`Real order test completed successfully! ${successCount}/${totalCount} steps passed`)
      } else {
        toast.error(`Real order test completed with issues. ${successCount}/${totalCount} steps passed`)
      }

    } catch (error) {
      console.error('Real order test error:', error)
      results.push({
        success: false,
        message: 'Test failed with error',
        details: error
      })
      setTestResults(results)
      toast.error('Real order test failed')
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Real Order Test</h1>
              <p className="text-gray-600">Simulate a complete order process and test email notifications</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Configuration */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShoppingCart className="w-5 h-5 mr-2" />
                Order Configuration
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Name
                  </label>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Customer Email
                  </label>
                  <Input
                    type="email"
                    placeholder="customer@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">Test Order Details:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Custom Poster - Test Design (29,99 €)</li>
                    <li>• Premium Frame (19,99 €)</li>
                    <li>• Total: 49,98 €</li>
                    <li>• Payment Method: Stripe</li>
                    <li>• Shipping: Musterstraße 123, 12345 Musterstadt</li>
                  </ul>
                </div>

                <Button
                  onClick={simulateRealOrder}
                  disabled={isLoading || !customerEmail || !customerName}
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : <ShoppingCart className="w-4 h-4 mr-2" />}
                  Simulate Real Order
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
                <Mail className="w-5 h-5 mr-2" />
                Test Results
              </h2>

              {testResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No test results yet. Run a real order test to see results here.</p>
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <h3 className="font-medium text-gray-900">Create Order</h3>
                <p className="text-sm text-gray-600">Simulate order creation in database</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-green-600 font-bold">2</span>
                </div>
                <h3 className="font-medium text-gray-900">Process Payment</h3>
                <p className="text-sm text-gray-600">Simulate successful payment</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-purple-600 font-bold">3</span>
                </div>
                <h3 className="font-medium text-gray-900">Send Customer Email</h3>
                <p className="text-sm text-gray-600">Order confirmation to customer</p>
              </div>
              
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <span className="text-orange-600 font-bold">4</span>
                </div>
                <h3 className="font-medium text-gray-900">Notify Admin</h3>
                <p className="text-sm text-gray-600">Order notification to admin</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
