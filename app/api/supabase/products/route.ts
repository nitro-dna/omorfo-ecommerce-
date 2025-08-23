import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    let query = supabase
      .from('products')
      .select(`
        *,
        category:categories(*)
      `)
      .eq('in_stock', true)

    if (category) {
      query = query.eq('category_id', category)
    }

    if (featured === 'true') {
      query = query.eq('featured', true)
    }

    const { data: products, error, count } = await query
      .range((page - 1) * limit, page * limit - 1)
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const requiredFields = ['name', 'slug', 'description', 'price', 'category_id', 'images']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if slug already exists
    const { data: existingProduct } = await supabase
      .from('products')
      .select('id')
      .eq('slug', body.slug)
      .single()

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create the product
    const { data: product, error } = await supabase
      .from('products')
      .insert({
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        sale_price: body.sale_price,
        images: body.images,
        category_id: body.category_id,
        tags: body.tags || [],
        materials: body.materials || [],
        sizes: body.sizes || ['A4', 'A3', 'A2', 'A1'],
        frames: body.frames || ['Black', 'White', 'Natural', 'None'],
        dimensions: body.dimensions || { width: 297, height: 420 },
        in_stock: body.in_stock !== undefined ? body.in_stock : true,
        stock_count: body.stock_count || 0,
        featured: body.featured || false,
        rating: body.rating || 0,
        review_count: body.review_count || 0,
      })
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error

    // Update category product count
    await supabase.rpc('increment_product_count', { category_id: body.category_id })

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product created successfully',
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    )
  }
}
