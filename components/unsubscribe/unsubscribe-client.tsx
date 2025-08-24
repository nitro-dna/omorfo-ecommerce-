'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Check, X, Mail } from 'lucide-react'
import toast from 'react-hot-toast'

interface UnsubscribeClientProps {
  email?: string
}

export function UnsubscribeClient({ email }: UnsubscribeClientProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isError, setIsError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (email) {
      handleUnsubscribe()
    }
  }, [email])

  const handleUnsubscribe = async () => {
    if (!email) return

    setIsLoading(true)
    setIsError(false)
    setErrorMessage('')

    try {
      const response = await fetch('/api/newsletter/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        setIsSuccess(true)
        toast.success('Successfully unsubscribed from newsletter')
      } else {
        setIsError(true)
        setErrorMessage(result.error || 'Failed to unsubscribe')
        toast.error(result.error || 'Failed to unsubscribe')
      }
    } catch (error) {
      console.error('Unsubscribe error:', error)
      setIsError(true)
      setErrorMessage('An error occurred while unsubscribing')
      toast.error('An error occurred while unsubscribing')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResubscribe = async () => {
    if (!email) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Successfully resubscribed to newsletter')
        setIsSuccess(false)
        setIsError(false)
      } else {
        toast.error(result.error || 'Failed to resubscribe')
      }
    } catch (error) {
      console.error('Resubscribe error:', error)
      toast.error('An error occurred while resubscribing')
    } finally {
      setIsLoading(false)
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="text-center">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Invalid Unsubscribe Link
            </h1>
            <p className="text-gray-600 mb-6">
              This unsubscribe link is invalid or missing the email address.
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Go to Homepage
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        {isLoading ? (
          <div className="text-center">
            <LoadingSpinner />
            <h1 className="text-2xl font-semibold text-gray-900 mt-4 mb-2">
              Processing...
            </h1>
            <p className="text-gray-600">
              Please wait while we process your request.
            </p>
          </div>
        ) : isSuccess ? (
          <div className="text-center">
            <Check className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Successfully Unsubscribed
            </h1>
            <p className="text-gray-600 mb-4">
              You have been unsubscribed from the ómorfo newsletter.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email: <span className="font-medium">{email}</span>
            </p>
            <div className="space-y-3">
              <Button onClick={handleResubscribe} className="w-full">
                Resubscribe to Newsletter
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        ) : isError ? (
          <div className="text-center">
            <X className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Unsubscribe Failed
            </h1>
            <p className="text-gray-600 mb-4">
              {errorMessage}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email: <span className="font-medium">{email}</span>
            </p>
            <div className="space-y-3">
              <Button onClick={handleUnsubscribe} className="w-full">
                Try Again
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Go to Homepage
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Unsubscribe from Newsletter
            </h1>
            <p className="text-gray-600 mb-4">
              Are you sure you want to unsubscribe from the ómorfo newsletter?
            </p>
            <p className="text-sm text-gray-500 mb-6">
              Email: <span className="font-medium">{email}</span>
            </p>
            <div className="space-y-3">
              <Button onClick={handleUnsubscribe} className="w-full">
                Yes, Unsubscribe Me
              </Button>
              <Button 
                variant="outline" 
                onClick={() => window.location.href = '/'}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
