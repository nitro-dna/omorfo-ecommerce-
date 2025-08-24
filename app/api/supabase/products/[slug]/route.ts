import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeReviews = searchParams.get('includeReviews') !== 'false'
    const includeRelated = searchParams.get('includeRelated') === 'true'
    
    let selectQuery = `*, category:categories(*)`
    if (includeReviews) {
      selectQuery += ',reviews(user_id, rating, comment, created_at)'
    }
    
    let query = supabase
      .from('products')
      .select(selectQuery)
      .eq('slug', params.slug)
      .single()

    const { data: product, error } = await query
    
    if (error || !product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get related products from same category
    let relatedProducts: any[] = []
    if (includeRelated && product && typeof product === 'object' && 'category_id' in product) {
      const { data: related } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('category_id', (product as any).category_id)
        .neq('id', (product as any).id)
        .eq('in_stock', true)
        .order('rating', { ascending: false })
        .limit(4)

      relatedProducts = related || []
    }
    
    return NextResponse.json({ 
      success: true, 
      data: product,
      relatedProducts: includeRelated ? relatedProducts : undefined
    })
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    
    const { data: product, error } = await supabase
      .from('products')
      .update({
        name: body.name,
        description: body.description,
        price: body.price,
        sale_price: body.sale_price,
        images: body.images,
        tags: body.tags,
        materials: body.materials,
        sizes: body.sizes,
        frames: body.frames,
        in_stock: body.in_stock,
        stock_count: body.stock_count,
        featured: body.featured,
      })
      .eq('slug', params.slug)
      .select(`
        *,
        category:categories(*)
      `)
      .single()

    if (error) throw error
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    })
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}
