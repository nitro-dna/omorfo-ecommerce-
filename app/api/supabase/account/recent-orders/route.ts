import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/account/recent-orders - Get user's recent orders
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

    // Get recent orders with order items count
    const { data: orders, error } = await supabase
      .from('orders')
      .select(`
        id,
        order_number,
        created_at,
        status,
        total_amount,
        order_items(count)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    if (error) {
      console.error('Error fetching recent orders:', error)
      return NextResponse.json(
        { error: 'Failed to fetch recent orders' },
        { status: 500 }
      )
    }

    // Transform the data to match the expected format
    const recentOrders = orders?.map(order => ({
      id: order.order_number || order.id,
      date: new Date(order.created_at).toISOString().split('T')[0],
      status: order.status,
      total: order.total_amount || 0,
      items: order.order_items?.[0]?.count || 0,
    })) || []

    return NextResponse.json({
      success: true,
      data: recentOrders,
    })
  } catch (error) {
    console.error('Error fetching recent orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent orders' },
      { status: 500 }
    )
  }
}
