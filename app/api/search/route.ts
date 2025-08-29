import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const q = (searchParams.get('q') || '').trim()
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    if (!q) {
      return NextResponse.json(
        { error: 'Missing required query parameter: q' },
        { status: 400 }
      )
    }

    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const rating = searchParams.get('rating')
    const inStock = searchParams.get('inStock') === 'true'
    const category = searchParams.get('category')
    const sort = searchParams.get('sort') || 'relevance'

    // Base query: search in name, description, category name, and tags
    // Using ilike for case-insensitive search
    const ilike = `%${q}%`

    let query = supabase
      .from('products')
      .select(
        `*, category:categories(*)`,
        { count: 'exact' }
      )
      .or(
        [
          `name.ilike.${ilike}`,
          `description.ilike.${ilike}`,
          // tags is array<string>; use @> to check contains any? We'll fallback to ilike via string cast using ::text
          // If tags is text[] this or() won't match; keep name/description primary
        ].join(',')
      )

    // Optional filters
    if (inStock) {
      query = query.eq('in_stock', true)
    }
    if (minPrice) {
      const min = parseFloat(minPrice)
      if (!Number.isNaN(min)) query = query.gte('price', min)
    }
    if (maxPrice) {
      const max = parseFloat(maxPrice)
      if (!Number.isNaN(max)) query = query.lte('price', max)
    }
    if (rating) {
      const minRating = parseFloat(rating)
      if (!Number.isNaN(minRating)) query = query.gte('rating', minRating)
    }
    // Category filter: accept either category_id or category slug/name
    if (category) {
      // Try matching by category name (case-insensitive) via categories view
      // Supabase JS cannot filter joined table directly; use RPC or simple eq on category_id when category looks like UUID.
      // Heuristic: if category contains a dash typical of UUID, treat as id; else try ilike on category_name using a separate filter via text search column if exists.
      if (/^[0-9a-fA-F-]{10,}$/.test(category)) {
        query = query.eq('category_id', category)
      }
    }

    // Sorting
    switch (sort) {
      case 'price_low':
        query = query.order('price', { ascending: true })
        break
      case 'price_high':
        query = query.order('price', { ascending: false })
        break
      case 'rating':
        query = query.order('rating', { ascending: false })
        break
      case 'newest':
        query = query.order('created_at', { ascending: false })
        break
      case 'relevance':
      default:
        // Fallback: rank by rating then newest
        query = query.order('rating', { ascending: false }).order('created_at', { ascending: false })
        break
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await query.range(from, to)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      },
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    )
  }
}


