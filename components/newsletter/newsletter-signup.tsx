'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Mail, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const newsletterSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type NewsletterFormData = z.infer<typeof newsletterSchema>

interface NewsletterSignupProps {
  variant?: 'dark' | 'light'
  className?: string
}

export function NewsletterSignup({ variant = 'dark', className = '' }: NewsletterSignupProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async (data: NewsletterFormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: data.email }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to subscribe')
      }

      setIsSuccess(true)
      reset()
      toast.success('Successfully subscribed to newsletter!')
      
      // Reset success state after 3 seconds
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Newsletter subscription error:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to subscribe. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const isLight = variant === 'light'

  return (
    <div className={`w-full max-w-md mx-auto ${className}`}>
      {!isSuccess ? (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className={`w-5 h-5 ${isLight ? 'text-accent-200' : 'text-gray-400'}`} />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={`w-full pl-10 pr-4 py-3 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                isLight
                  ? 'bg-white/10 border-white/20 text-white placeholder-accent-200 focus:ring-white/50'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-accent-500 focus:border-accent-500'
              } ${errors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
              isLight
                ? 'bg-white text-accent-500 hover:bg-gray-100 focus:ring-white/50'
                : 'bg-accent-500 text-white hover:bg-accent-600 focus:ring-accent-500'
            }`}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Subscribing...
              </div>
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      ) : (
        <div className={`flex items-center justify-center p-4 rounded-lg ${
          isLight ? 'bg-white/10 text-white' : 'bg-green-50 text-green-800'
        }`}>
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium">Successfully subscribed!</span>
        </div>
      )}
    </div>
  )
}

