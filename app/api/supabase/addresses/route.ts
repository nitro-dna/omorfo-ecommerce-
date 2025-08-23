import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/addresses - Get user's addresses
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

    // Get user's addresses
    const { data: addresses, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: addresses || [],
    })
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return NextResponse.json(
      { error: 'Failed to fetch addresses' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/addresses - Add new address
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const {
      type,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default,
    } = await request.json()

    // Validate required fields
    if (!first_name || !last_name || !address_line_1 || !city || !state || !postal_code || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // If this is a default address, unset other default addresses of the same type
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('type', type)
    }

    // Add new address
    const { data: address, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        type,
        first_name,
        last_name,
        company,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        phone,
        is_default,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Address added successfully',
    })
  } catch (error) {
    console.error('Error adding address:', error)
    return NextResponse.json(
      { error: 'Failed to add address' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/addresses - Update address
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
        { status: 400 }
      )
    }

    const {
      type,
      first_name,
      last_name,
      company,
      address_line_1,
      address_line_2,
      city,
      state,
      postal_code,
      country,
      phone,
      is_default,
    } = await request.json()

    // Validate required fields
    if (!first_name || !last_name || !address_line_1 || !city || !state || !postal_code || !country) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // If this is a default address, unset other default addresses of the same type
    if (is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .eq('type', type)
        .neq('id', addressId)
    }

    // Update address
    const { data: address, error } = await supabase
      .from('addresses')
      .update({
        type,
        first_name,
        last_name,
        company,
        address_line_1,
        address_line_2,
        city,
        state,
        postal_code,
        country,
        phone,
        is_default,
        updated_at: new Date().toISOString(),
      })
      .eq('id', addressId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: address,
      message: 'Address updated successfully',
    })
  } catch (error) {
    console.error('Error updating address:', error)
    return NextResponse.json(
      { error: 'Failed to update address' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/addresses - Delete address
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
    const addressId = searchParams.get('id')

    if (!addressId) {
      return NextResponse.json(
        { error: 'Address ID is required' },
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

    // Delete address
    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting address:', error)
    return NextResponse.json(
      { error: 'Failed to delete address' },
      { status: 500 }
    )
  }
}
