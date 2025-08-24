import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {

    // Fetch orders from orders table
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch orders' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedOrders = orders?.map(order => ({
      id: order.id,
      name: `Order #${order.id}`,
      email: order.customer_email || null,
      status: order.status || 'pending',
      created_at: order.created_at
    })) || []

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
