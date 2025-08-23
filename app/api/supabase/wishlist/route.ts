import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/wishlist - Get user's wishlist
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
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

    // Get wishlist items with product details
    const { data: wishlistItems, error } = await supabase
      .from('wishlist_items')
      .select(`
        *,
        product:products(
          *,
          category:categories(*)
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: wishlistItems,
      count: wishlistItems.length,
    })
  } catch (error) {
    console.error('Error fetching wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to fetch wishlist' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/wishlist - Add item to wishlist
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    console.log('Wishlist POST - Session:', session?.user?.email)
    
    if (!session?.user?.email) {
      console.log('Wishlist POST - No session found')
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId } = await request.json()
    console.log('Wishlist POST - Product ID:', productId)

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
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
      console.error('Wishlist POST - User not found:', userError)
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    console.log('Wishlist POST - User ID:', user.id)

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('id')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      console.error('Wishlist POST - Product not found:', productError)
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if item is already in wishlist
    const { data: existingItem } = await supabase
      .from('wishlist_items')
      .select('id')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .single()

    if (existingItem) {
      console.log('Wishlist POST - Item already exists')
      return NextResponse.json(
        { error: 'Item already in wishlist' },
        { status: 409 }
      )
    }

    // Add to wishlist
    const { data: wishlistItem, error } = await supabase
      .from('wishlist_items')
      .insert({
        user_id: user.id,
        product_id: productId,
      })
      .select(`
        *,
        product:products(
          *,
          category:categories(*)
        )
      `)
      .single()

    if (error) {
      console.error('Wishlist POST - Insert error:', error)
      throw error
    }

    console.log('Wishlist POST - Success:', wishlistItem.id)

    return NextResponse.json({
      success: true,
      data: wishlistItem,
      message: 'Added to wishlist successfully',
    })
  } catch (error) {
    console.error('Error adding to wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to add to wishlist' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/wishlist - Remove item from wishlist
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
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
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

    // Remove from wishlist
    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('user_id', user.id)
      .eq('product_id', productId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist successfully',
    })
  } catch (error) {
    console.error('Error removing from wishlist:', error)
    return NextResponse.json(
      { error: 'Failed to remove from wishlist' },
      { status: 500 }
    )
  }
}
