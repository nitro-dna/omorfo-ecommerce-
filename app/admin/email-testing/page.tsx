'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Mail, Send, CheckCircle, AlertCircle, Settings, Users, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

interface EmailTestResult {
  success: boolean
  message: string
  details?: any
}

export default function EmailTestingPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('')
  const [testResults, setTestResults] = useState<EmailTestResult[]>([])

  const runEmailTest = async (testType: string, email?: string) => {
    setIsLoading(true)
    const results: EmailTestResult[] = []

    try {
      switch (testType) {
        case 'basic':
          // Test basic email sending
          console.log('Testing basic email to:', email || testEmail)
          const basicResponse = await fetch('/api/test-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email || testEmail })
          })
          const basicResult = await basicResponse.json()
          console.log('Basic email result:', basicResult)
          results.push({
            success: basicResponse.ok && basicResult.success,
            message: `Basic Email Test: ${basicResult.success ? 'Success' : 'Failed'}`,
            details: basicResult
          })
          break

        case 'newsletter':
          // Test newsletter subscription
          const newsletterResponse = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email || testEmail })
          })
          const newsletterResult = await newsletterResponse.json()
          results.push({
            success: newsletterResponse.ok,
            message: `Newsletter Subscription: ${newsletterResult.success ? 'Success' : 'Failed'}`,
            details: newsletterResult
          })
          break

        case 'order-confirmation':
          // Test order confirmation email
          console.log('Testing order confirmation to:', email || testEmail)
          const orderResponse = await fetch('/api/test-customer-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              email: email || testEmail,
              orderId: 'TEST-ORDER-123',
              customerName: 'Test Customer'
            })
          })
          const orderResult = await orderResponse.json()
          console.log('Order confirmation result:', orderResult)
          results.push({
            success: orderResponse.ok && orderResult.success,
            message: `Order Confirmation: ${orderResult.success ? 'Success' : 'Failed'}`,
            details: orderResult
          })
          break

        case 'admin-notification':
          // Test admin notification
          const adminResponse = await fetch('/api/test-order-notifications', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              customerEmail: email || testEmail,
              orderId: 'TEST-ORDER-123',
              amount: 99.99
            })
          })
          const adminResult = await adminResponse.json()
          results.push({
            success: adminResponse.ok,
            message: `Admin Notification: ${adminResult.success ? 'Success' : 'Failed'}`,
            details: adminResult
          })
          break

        case 'provider-test':
          // Test different email providers
          const providers = ['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com']
          for (const provider of providers) {
            const testEmail = `test@${provider}`
            const providerResponse = await fetch('/api/test-email-providers', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email: testEmail })
            })
            const providerResult = await providerResponse.json()
            results.push({
              success: providerResponse.ok,
              message: `Provider Test (${provider}): ${providerResult.success ? 'Success' : 'Failed'}`,
              details: providerResult
            })
          }
          break

        case 'all':
          // Run all tests
          await runEmailTest('basic', email || testEmail)
          await runEmailTest('newsletter', email || testEmail)
          await runEmailTest('order-confirmation', email || testEmail)
          await runEmailTest('admin-notification', email || testEmail)
          await runEmailTest('provider-test')
          break
      }

      setTestResults(results)
      
      // Show toast notification
      const successCount = results.filter(r => r.success).length
      const totalCount = results.length
      
      if (successCount === totalCount) {
        toast.success(`All ${totalCount} email tests passed!`)
      } else {
        toast.error(`${totalCount - successCount} out of ${totalCount} tests failed`)
      }

    } catch (error) {
      console.error('Email test error:', error)
      results.push({
        success: false,
        message: `Test Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      })
      setTestResults(results)
      toast.error('Email test failed')
    } finally {
      setIsLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  const runComprehensiveTest = async () => {
    setIsLoading(true)
    try {
      console.log('Running comprehensive email test for:', testEmail)
      const response = await fetch('/api/test-all-emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail })
      })
      
      const result = await response.json()
      console.log('Comprehensive test result:', result)
      
      if (result.success) {
        toast.success(`Comprehensive test completed: ${result.summary.successful}/${result.summary.total} successful`)
      } else {
        toast.error(`Comprehensive test failed: ${result.summary.failed}/${result.summary.total} failed`)
      }
      
      // Convert results to the expected format
      const convertedResults = result.results.map((r: any) => ({
        success: r.success,
        message: `${r.test}: ${r.success ? 'Success' : 'Failed'}`,
        details: r
      }))
      
      setTestResults(convertedResults)
      
    } catch (error) {
      console.error('Comprehensive test error:', error)
      toast.error('Comprehensive test failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Email System Testing</h1>
                <p className="text-gray-600">Test and verify all email functionality</p>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Test Email Address
                    </label>
                    <Input
                      type="email"
                      placeholder="test@example.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Button
                      onClick={() => runEmailTest('basic')}
                      disabled={isLoading || !testEmail}
                      className="w-full"
                    >
                      {isLoading ? <LoadingSpinner /> : <Mail className="w-4 h-4 mr-2" />}
                      Basic Email Test
                    </Button>

                    <Button
                      onClick={() => runEmailTest('newsletter')}
                      disabled={isLoading || !testEmail}
                      variant="outline"
                      className="w-full"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Newsletter Test
                    </Button>

                    <Button
                      onClick={() => runEmailTest('order-confirmation')}
                      disabled={isLoading || !testEmail}
                      variant="outline"
                      className="w-full"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Order Confirmation
                    </Button>

                    <Button
                      onClick={() => runEmailTest('admin-notification')}
                      disabled={isLoading || !testEmail}
                      variant="outline"
                      className="w-full"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Admin Notification
                    </Button>

                    <Button
                      onClick={() => runEmailTest('provider-test')}
                      disabled={isLoading}
                      variant="outline"
                      className="w-full"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Provider Test
                    </Button>

                    <Button
                      onClick={() => runEmailTest('all')}
                      disabled={isLoading || !testEmail}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Run All Tests
                    </Button>

                    <Button
                      onClick={() => runComprehensiveTest()}
                      disabled={isLoading || !testEmail}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Comprehensive Test
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
                    <Mail className="w-12 h-12 mx-auto mb-4 text-gray-300" />
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

          {/* Email System Status */}
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Email System Status</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900">Resend API</h3>
                <p className="text-blue-700 text-sm">Email delivery service</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Configured</span>
                </div>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-green-900">Newsletter System</h3>
                <p className="text-green-700 text-sm">Subscription management</p>
                <div className="mt-2 flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-green-700">Active</span>
                </div>
              </div>
              
              <div className="p-4 bg-purple-50 rounded-lg">
                <h3 className="font-medium text-purple-900">Order Notifications</h3>
                <p className="text-purple-700 text-sm">Customer & admin emails</p>
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
