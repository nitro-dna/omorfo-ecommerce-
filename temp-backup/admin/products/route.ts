import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {

    // Fetch products from products table
    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 })
    }

    // Transform data for frontend
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.title || product.name || 'Untitled Product',
      email: null, // Products don't have emails
      status: product.status || 'active',
      created_at: product.created_at
    })) || []

    return NextResponse.json({
      success: true,
      products: transformedProducts
    })

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name,
      slug,
      description,
      price,
      images,
      categoryId,
      inStock,
      stockCount,
      featured,
      sizes,
      frames,
      tags
    } = body

    // Validate required fields
    if (!name || !slug || !description || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name,
        slug,
        description,
        price: parseFloat(price),
        images: images || [],
        category_id: categoryId,
        in_stock: inStock || false,
        stock_count: stockCount || 0,
        featured: featured || false,
        sizes: sizes || [],
        frames: frames || [],
        tags: tags || [],
        rating: 0,
        review_count: 0
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating product:', error)
      return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }

    return NextResponse.json({ product })

  } catch (error) {
    console.error('Error in admin products POST API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
