import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/reviews - Get product reviews
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    // Get reviews with user details
    const { data: reviews, error, count } = await supabase
      .from('reviews')
      .select(`
        *,
        user:users(
          id,
          name,
          email,
          image
        )
      `)
      .eq('product_id', productId)
      .order('created_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (error) throw error

    // Calculate average rating
    const { data: avgRating } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    const averageRating = avgRating && avgRating.length > 0
      ? avgRating.reduce((sum, review) => sum + review.rating, 0) / avgRating.length
      : 0

    return NextResponse.json({
      success: true,
      data: reviews,
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: count || 0,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/reviews - Create new review
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, rating, comment } = await request.json()

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if user already reviewed this product
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product' },
        { status: 409 }
      )
    }

    // Create review
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        user_id: user.id,
        product_id: productId,
        rating,
        comment: comment || null,
      })
      .select(`
        *,
        user:users(
          id,
          name,
          email,
          image
        )
      `)
      .single()

    if (error) throw error

    // Update product review count and average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', productId)

    if (allReviews) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / allReviews.length

      await supabase
        .from('products')
        .update({
          review_count: allReviews.length,
          rating: Math.round(averageRating * 10) / 10,
        })
        .eq('id', productId)
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review created successfully',
    })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/reviews - Update review
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { reviewId, rating, comment } = await request.json()

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Update review
    const { data: review, error } = await supabase
      .from('reviews')
      .update({
        rating,
        comment: comment || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .select(`
        *,
        user:users(
          id,
          name,
          email,
          image
        )
      `)
      .single()

    if (error) throw error

    // Update product review count and average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', review.product_id)

    if (allReviews) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / allReviews.length

      await supabase
        .from('products')
        .update({
          review_count: allReviews.length,
          rating: Math.round(averageRating * 10) / 10,
        })
        .eq('id', review.product_id)
    }

    return NextResponse.json({
      success: true,
      data: review,
      message: 'Review updated successfully',
    })
  } catch (error) {
    console.error('Error updating review:', error)
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/reviews - Delete review
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const reviewId = searchParams.get('reviewId')

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      )
    }

    // Get user ID from session
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id')
      .eq('email', session.user.email)
      .single()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Get review to get product_id before deleting
    const { data: review } = await supabase
      .from('reviews')
      .select('product_id')
      .eq('id', reviewId)
      .eq('user_id', user.id)
      .single()

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      )
    }

    // Delete review
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('user_id', user.id)

    if (error) throw error

    // Update product review count and average rating
    const { data: allReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('product_id', review.product_id)

    if (allReviews) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
      const averageRating = totalRating / allReviews.length

      await supabase
        .from('products')
        .update({
          review_count: allReviews.length,
          rating: Math.round(averageRating * 10) / 10,
        })
        .eq('id', review.product_id)
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting review:', error)
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    )
  }
}
