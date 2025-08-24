'use client'

import { useState, useEffect } from 'react'
import { Star, MessageCircle, User, Clock } from 'lucide-react'
import { useRealtimeReviews } from '@/lib/supabase-realtime'
import { normalizeProduct } from '@/lib/utils'
import toast from 'react-hot-toast'

interface LiveReviewsProps {
  product: any
  showNewReviewAlert?: boolean
  className?: string
}

interface Review {
  id: string
  user_id: string
  product_id: string
  rating: number
  comment: string | null
  created_at: string
  user: {
    name: string
    email: string
    image: string | null
  }
}

export function LiveReviews({ product, showNewReviewAlert = true, className = '' }: LiveReviewsProps) {
  const normalizedProduct = normalizeProduct(product)
  const { reviewUpdates, isConnected } = useRealtimeReviews(product.id)
  const [reviews, setReviews] = useState<Review[]>([])
  const [averageRating, setAverageRating] = useState(normalizedProduct.rating || 0)
  const [totalReviews, setTotalReviews] = useState(normalizedProduct.reviewCount || 0)
  const [newReviews, setNewReviews] = useState<Review[]>([])

  // Fetch initial reviews
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch(`/api/supabase/reviews?productId=${product.id}&limit=10`)
        if (response.ok) {
          const data = await response.json()
          setReviews(data.data || [])
          setAverageRating(data.averageRating || 0)
          setTotalReviews(data.totalReviews || 0)
        }
      } catch (error) {
        console.error('Failed to fetch reviews:', error)
      }
    }

    fetchReviews()
  }, [product.id])

  // Handle real-time review updates
  useEffect(() => {
    if (reviewUpdates.length > 0) {
      const latestUpdate = reviewUpdates[reviewUpdates.length - 1]
      
      if (latestUpdate.eventType === 'INSERT') {
        const newReview = latestUpdate.new as Review
        setReviews((prev: any) => [newReview, ...prev])
        setNewReviews((prev: any) => [newReview, ...prev.slice(0, 4)]) // Keep last 5 new reviews
        setTotalReviews((prev: number) => prev + 1)
        
        // Update average rating
        const newTotalRating = reviews.reduce((sum, review) => sum + review.rating, 0) + newReview.rating
        const newAverage = newTotalRating / (reviews.length + 1)
        setAverageRating(Math.round(newAverage * 10) / 10)

        if (showNewReviewAlert) {
          toast.success(`New ${newReview.rating}-star review from ${newReview.user.name}!`, {
            duration: 4000,
            icon: '⭐'
          })
        }
      } else if (latestUpdate.eventType === 'DELETE') {
        const deletedReview = latestUpdate.old as Review
        setReviews(prev => prev.filter(review => review.id !== deletedReview.id))
        setTotalReviews((prev: number) => Math.max(0, prev - 1))
      }
    }
  }, [reviewUpdates, showNewReviewAlert, reviews])

  // Clear new reviews indicator after 10 seconds
  useEffect(() => {
    if (newReviews.length > 0) {
      const timer = setTimeout(() => {
        setNewReviews([])
      }, 10000)

      return () => clearTimeout(timer)
    }
  }, [newReviews])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Reviews Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-primary-800">Customer Reviews</h3>
          
          {/* Average Rating */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(averageRating)
                      ? 'text-yellow-400 fill-current'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-primary-600">
              {averageRating.toFixed(1)} ({totalReviews} reviews)
            </span>
          </div>
        </div>

        {/* Real-time Connection Indicator */}
        {isConnected && (
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-600 font-medium">Live</span>
          </div>
        )}
      </div>

      {/* New Reviews Alert */}
      {newReviews.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-blue-800">
              {newReviews.length} new review{newReviews.length > 1 ? 's' : ''} just in!
            </span>
          </div>
          <div className="space-y-2">
            {newReviews.slice(0, 3).map((review) => (
              <div key={review.id} className="flex items-center space-x-2 text-sm text-blue-700">
                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                <span>{review.user.name}</span>
                <span>•</span>
                <span>{review.rating}/5 stars</span>
                <span>•</span>
                <span className="text-blue-600">Just now</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
          </div>
        ) : (
          reviews.map((review) => (
            <div
              key={review.id}
              className={`bg-white rounded-lg border p-4 transition-all duration-300 ${
                newReviews.some(r => r.id === review.id)
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-primary-200'
              }`}
            >
              {/* Review Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  {/* User Avatar */}
                  <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                    {review.user.image ? (
                      <img
                        src={review.user.image}
                        alt={review.user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-primary-600" />
                    )}
                  </div>
                  
                  {/* User Info */}
                  <div>
                    <p className="font-medium text-primary-800">{review.user.name}</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < review.rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-primary-600">{review.rating}/5</span>
                    </div>
                  </div>
                </div>

                {/* Review Date */}
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(review.created_at)}</span>
                </div>
              </div>

              {/* Review Comment */}
              {review.comment && (
                <p className="text-primary-700 leading-relaxed">{review.comment}</p>
              )}

              {/* New Review Indicator */}
              {newReviews.some(r => r.id === review.id) && (
                <div className="mt-2 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-blue-600 font-medium">New</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Load More Reviews */}
      {reviews.length >= 10 && (
        <div className="text-center">
          <button className="text-accent-600 hover:text-accent-700 font-medium">
            Load more reviews
          </button>
        </div>
      )}
    </div>
  )
}

// Compact review display for product cards
export function CompactReviews({ product, className = '' }: { product: any, className?: string }) {
  const normalizedProduct = normalizeProduct(product)
  const { reviewUpdates, isConnected } = useRealtimeReviews(product.id)
  const [averageRating, setAverageRating] = useState(normalizedProduct.rating || 0)
  const [totalReviews, setTotalReviews] = useState(normalizedProduct.reviewCount || 0)

  useEffect(() => {
    if (reviewUpdates.length > 0) {
      const latestUpdate = reviewUpdates[reviewUpdates.length - 1]
      if (latestUpdate.eventType === 'INSERT') {
        const newReview = latestUpdate.new as Review
        const newTotalRating = (averageRating * totalReviews + newReview.rating) / (totalReviews + 1)
        setAverageRating(Math.round(newTotalRating * 10) / 10)
        setTotalReviews((prev: number) => prev + 1)
      }
    }
  }, [reviewUpdates, averageRating, totalReviews])

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-3 h-3 ${
              i < Math.floor(averageRating)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-primary-600">
        {averageRating.toFixed(1)} ({totalReviews})
      </span>
      {isConnected && (
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
      )}
    </div>
  )
}
