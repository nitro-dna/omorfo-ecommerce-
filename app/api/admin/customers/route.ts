import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {

    // Fetch customers from users table
    const { data: customers, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch customers' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedCustomers = customers?.map(customer => ({
      id: customer.id,
      name: customer.name || customer.email?.split('@')[0] || 'Unknown',
      email: customer.email,
      status: customer.status || 'active',
      created_at: customer.created_at
    })) || []

    return NextResponse.json({
      success: true,
      customers: transformedCustomers
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
