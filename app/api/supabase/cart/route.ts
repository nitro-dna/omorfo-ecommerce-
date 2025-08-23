import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/cart - Get user's cart
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

    // Get cart items with product details
    const { data: cartItems, error } = await supabase
      .from('cart_items')
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
      data: cartItems,
      count: cartItems.length,
    })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { productId, quantity = 1, size = 'A3', frame = 'No Frame' } = await request.json()

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

    // Check if product exists
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (productError || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Check if item already exists in cart
    const { data: existingItem } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('product_id', productId)
      .eq('size', size)
      .eq('frame', frame)
      .single()

    if (existingItem) {
      // Update quantity
      const { data: updatedItem, error: updateError } = await supabase
        .from('cart_items')
        .update({ 
          quantity: existingItem.quantity + quantity,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingItem.id)
        .select(`
          *,
          product:products(
            *,
            category:categories(*)
          )
        `)
        .single()

      if (updateError) throw updateError

      return NextResponse.json({
        success: true,
        data: updatedItem,
        message: 'Cart item updated successfully',
      })
    }

    // Add new item to cart
    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .insert({
        user_id: user.id,
        product_id: productId,
        quantity,
        size,
        frame,
        price: product.sale_price || product.price,
      })
      .select(`
        *,
        product:products(
          *,
          category:categories(*)
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Added to cart successfully',
    })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/cart - Update cart item
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { cartItemId, quantity, size, frame } = await request.json()

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
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

    // Update cart item
    const updateData: any = { updated_at: new Date().toISOString() }
    if (quantity !== undefined) updateData.quantity = quantity
    if (size !== undefined) updateData.size = size
    if (frame !== undefined) updateData.frame = frame

    const { data: cartItem, error } = await supabase
      .from('cart_items')
      .update(updateData)
      .eq('id', cartItemId)
      .eq('user_id', user.id)
      .select(`
        *,
        product:products(
          *,
          category:categories(*)
        )
      `)
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: cartItem,
      message: 'Cart item updated successfully',
    })
  } catch (error) {
    console.error('Error updating cart:', error)
    return NextResponse.json(
      { error: 'Failed to update cart' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/cart - Remove item from cart
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
    const cartItemId = searchParams.get('cartItemId')

    if (!cartItemId) {
      return NextResponse.json(
        { error: 'Cart item ID is required' },
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

    // Remove from cart
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Removed from cart successfully',
    })
  } catch (error) {
    console.error('Error removing from cart:', error)
    return NextResponse.json(
      { error: 'Failed to remove from cart' },
      { status: 500 }
    )
  }
}
