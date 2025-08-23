import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// PUT /api/supabase/addresses/default - Set default address
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

    // Get the address to set as default
    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('type')
      .eq('id', addressId)
      .eq('user_id', user.id)
      .single()

    if (addressError || !address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      )
    }

    // Unset all default addresses of the same type
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)
      .eq('type', address.type)

    // Set the selected address as default
    const { error: updateError } = await supabase
      .from('addresses')
      .update({ 
        is_default: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return NextResponse.json({
      success: true,
      message: 'Default address updated successfully',
    })
  } catch (error) {
    console.error('Error setting default address:', error)
    return NextResponse.json(
      { error: 'Failed to set default address' },
      { status: 500 }
    )
  }
}
