import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/account/stats - Get user account statistics
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

    // Get total orders count
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (ordersError) {
      console.error('Error fetching orders count:', ordersError)
    }

    // Get total spent
    const { data: orders, error: spentError } = await supabase
      .from('orders')
      .select('total_amount')
      .eq('user_id', user.id)
      .eq('status', 'completed')

    let totalSpent = 0
    if (!spentError && orders) {
      totalSpent = orders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
    }

    // Get wishlist items count
    const { count: wishlistItems, error: wishlistError } = await supabase
      .from('wishlist_items')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (wishlistError) {
      console.error('Error fetching wishlist count:', wishlistError)
    }

    // Get saved addresses count
    const { count: savedAddresses, error: addressesError } = await supabase
      .from('addresses')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)

    if (addressesError) {
      console.error('Error fetching addresses count:', addressesError)
    }

    return NextResponse.json({
      success: true,
      data: {
        totalOrders: totalOrders || 0,
        totalSpent: totalSpent,
        wishlistItems: wishlistItems || 0,
        savedAddresses: savedAddresses || 0,
      }
    })
  } catch (error) {
    console.error('Error fetching account stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch account statistics' },
      { status: 500 }
    )
  }
}
