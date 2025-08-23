import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''
    const category = searchParams.get('category')
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const inStock = searchParams.get('inStock')
    const size = searchParams.get('size')
    const color = searchParams.get('color')
    const sortBy = searchParams.get('sort') || 'relevance'
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const offset = (page - 1) * limit

    if (!query.trim()) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      })
    }

    // Build search query - simplified version
    let searchQuery = supabase
      .from('products')
      .select('*')

    // Text search - simplified
    searchQuery = searchQuery.or(`name.ilike.%${query}%,description.ilike.%${query}%`)

    // Apply basic filters only
    if (category) {
      searchQuery = searchQuery.eq('category_id', category)
    }

    if (minPrice || maxPrice) {
      if (minPrice && maxPrice) {
        searchQuery = searchQuery.gte('price', parseFloat(minPrice)).lte('price', parseFloat(maxPrice))
      } else if (minPrice) {
        searchQuery = searchQuery.gte('price', parseFloat(minPrice))
      } else if (maxPrice) {
        searchQuery = searchQuery.lte('price', parseFloat(maxPrice))
      }
    }

    // Apply basic sorting
    switch (sortBy) {
      case 'price_low':
        searchQuery = searchQuery.order('price', { ascending: true })
        break
      case 'price_high':
        searchQuery = searchQuery.order('price', { ascending: false })
        break
      case 'newest':
        searchQuery = searchQuery.order('created_at', { ascending: false })
        break
      case 'relevance':
      default:
        searchQuery = searchQuery.order('name', { ascending: true })
        break
    }

    // Apply pagination
    searchQuery = searchQuery.range(offset, offset + limit - 1)

    // Execute search
    const { data: products, error, count: total } = await searchQuery

    if (error) {
      console.error('Search error:', error)
      return NextResponse.json(
        { error: 'Failed to search products' },
        { status: 500 }
      )
    }

    // Transform data - simplified
    const transformedProducts = products?.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug || product.id,
      description: product.description || '',
      price: product.price || 0,
      salePrice: product.sale_price || null,
      images: product.images || [],
      category: 'Uncategorized',
      rating: 0,
      reviewCount: 0,
      stockCount: 0,
      inStock: true,
      tags: [],
      dimensions: {
        width: 0,
        height: 0
      },
      createdAt: product.created_at || new Date().toISOString(),
      updatedAt: product.updated_at || new Date().toISOString()
    })) || []

    // Analytics disabled for now to avoid errors

    return NextResponse.json({
      success: true,
      data: transformedProducts,
      pagination: {
        page,
        limit,
        total: total || 0,
        totalPages: Math.ceil((total || 0) / limit)
      },
      query,
      filters: {
        category,
        minPrice,
        maxPrice,
        rating,
        inStock,
        size,
        color,
        sortBy
      }
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
