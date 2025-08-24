'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { NewsletterSignup } from '@/components/newsletter/newsletter-signup'
import toast from 'react-hot-toast'

export default function TestNewsletterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('test@example.com')

  const testSubscribe = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const result = await response.json()
      console.log('Newsletter API Response:', result)

      if (response.ok) {
        toast.success(`Successfully subscribed: ${testEmail}`)
      } else {
        toast.error(result.error || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter test error:', error)
      toast.error('API test failed')
    } finally {
      setIsLoading(false)
    }
  }

  const testCheckSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/newsletter/subscribe?email=${encodeURIComponent(testEmail)}`)
      const result = await response.json()
      console.log('Check subscription response:', result)

      if (response.ok) {
        toast.success(`Subscription status: ${result.isSubscribed ? 'Subscribed' : 'Not subscribed'}`)
      } else {
        toast.error(result.error || 'Failed to check subscription')
      }
    } catch (error) {
      console.error('Check subscription error:', error)
      toast.error('Check subscription failed')
    } finally {
      setIsLoading(false)
    }
  }

  const testInvalidEmail = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'invalid-email' }),
      })

      const result = await response.json()
      console.log('Invalid email test response:', result)

      if (response.status === 400) {
        toast.success('Correctly rejected invalid email')
      } else {
        toast.error('Should have rejected invalid email')
      }
    } catch (error) {
      console.error('Invalid email test error:', error)
      toast.error('Invalid email test failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Newsletter Functionality Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the newsletter subscription functionality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Newsletter Component Test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Newsletter Component Test</h2>
            <p className="text-sm text-gray-600 mb-4">
              Test the newsletter signup component with form validation
            </p>
            <NewsletterSignup />
          </div>

          {/* API Tests */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">API Tests</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Email
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Enter test email"
                />
              </div>

              <div className="space-y-2">
                <Button
                  onClick={testSubscribe}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : 'Test Subscribe API (with Email)'}
                </Button>

                <Button
                  onClick={testCheckSubscription}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : 'Check Subscription Status'}
                </Button>

                <Button
                  onClick={testInvalidEmail}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : 'Test Invalid Email'}
                </Button>

                <Button
                  onClick={() => {
                    setIsLoading(true)
                    fetch('/api/newsletter/unsubscribe', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({ email: testEmail }),
                    })
                      .then(async res => {
                        const data = await res.json()
                        console.log('Unsubscribe API Response:', data)
                        if (res.ok) {
                          toast.success(`Successfully unsubscribed: ${testEmail}`)
                        } else {
                          toast.error(data.error || 'Failed to unsubscribe')
                        }
                      })
                      .catch(err => {
                        console.error('Unsubscribe API Error:', err)
                        toast.error('Unsubscribe API Error')
                      })
                      .finally(() => setIsLoading(false))
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="w-full"
                >
                  {isLoading ? <LoadingSpinner /> : 'Test Unsubscribe API (with Email)'}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Test Instructions</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. Database Setup</h3>
              <p className="text-sm text-gray-600 mb-2">
                First, run the SQL script in your Supabase SQL Editor:
              </p>
              <code className="block bg-gray-100 p-2 rounded text-sm">
                fix-newsletter-schema.sql
              </code>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Component Test</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Try subscribing with a valid email address</li>
                <li>• Try subscribing with an invalid email (should show validation error)</li>
                <li>• Try subscribing with the same email twice (should show "already subscribed" error)</li>
                <li>• Check that success message appears after successful subscription</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. API Tests</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• <strong>Test Subscribe API:</strong> Subscribe a test email via API</li>
                <li>• <strong>Check Subscription Status:</strong> Verify if an email is subscribed</li>
                <li>• <strong>Test Invalid Email:</strong> Verify API rejects invalid emails</li>
                <li>• Check browser console for detailed API responses</li>
              </ul>
            </div>

                         <div>
               <h3 className="font-medium text-gray-900 mb-2">4. Expected Results</h3>
               <ul className="text-sm text-gray-600 space-y-1">
                 <li>✅ Valid email subscription should succeed</li>
                 <li>✅ Welcome email should be sent to the subscriber</li>
                 <li>✅ Invalid email should be rejected with validation error</li>
                 <li>✅ Duplicate email should show "already subscribed" error</li>
                 <li>✅ Success message should appear after successful subscription</li>
                 <li>✅ Unsubscribe functionality should work</li>
                 <li>✅ Unsubscribe confirmation email should be sent</li>
                 <li>✅ Email should be saved in database (when schema is executed)</li>
                 <li>✅ Subscription log should be created (when schema is executed)</li>
               </ul>
             </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              onClick={() => window.open('/', '_blank')}
              variant="outline"
              className="w-full"
            >
              Go to Homepage
            </Button>

            <Button
              onClick={() => window.open('/shop', '_blank')}
              variant="outline"
              className="w-full"
            >
              Go to Shop
            </Button>

            <Button
              onClick={() => window.open('/contact', '_blank')}
              variant="outline"
              className="w-full"
            >
              Go to Contact
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
