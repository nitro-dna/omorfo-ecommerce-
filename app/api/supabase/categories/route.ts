import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/supabase/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeProducts = searchParams.get('includeProducts') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const page = parseInt(searchParams.get('page') || '1')

    let query = supabase
      .from('categories')
      .select(includeProducts ? `
        *,
        products(
          id,
          name,
          slug,
          price,
          sale_price,
          images,
          rating,
          review_count,
          featured
        )
      ` : '*')
      .order('name', { ascending: true })

    // Apply pagination if not including products
    if (!includeProducts) {
      query = query.range((page - 1) * limit, page * limit - 1)
    }

    const { data: categories, error, count } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: categories,
      pagination: !includeProducts ? {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
      } : undefined,
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/supabase/categories - Create new category (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin (you can implement your own admin check)
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { name, slug, description, image } = await request.json()

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if slug already exists
    const { data: existingCategory } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this slug already exists' },
        { status: 409 }
      )
    }

    // Create category
    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        name,
        slug,
        description: description || null,
        image: image || null,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully',
    })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/supabase/categories - Update category (Admin only)
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { categoryId, name, slug, description, image } = await request.json()

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if slug already exists (excluding current category)
    if (slug) {
      const { data: existingCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', slug)
        .neq('id', categoryId)
        .single()

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Category with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update category
    const updateData: any = {}
    if (name) updateData.name = name
    if (slug) updateData.slug = slug
    if (description !== undefined) updateData.description = description
    if (image !== undefined) updateData.image = image

    const { data: category, error } = await supabase
      .from('categories')
      .update(updateData)
      .eq('id', categoryId)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully',
    })
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/supabase/categories - Delete category (Admin only)
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('email', session.user.email)
      .single()

    if (user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    if (!categoryId) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category has products
    const { data: products } = await supabase
      .from('products')
      .select('id')
      .eq('category_id', categoryId)
      .limit(1)

    if (products && products.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete category with existing products' },
        { status: 400 }
      )
    }

    // Delete category
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
