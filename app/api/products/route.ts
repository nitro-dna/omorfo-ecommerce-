import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '20')
    const page = parseInt(searchParams.get('page') || '1')

    const where: any = {
      inStock: true,
    }

    if (category) {
      where.categoryId = category
    }

    if (featured === 'true') {
      where.featured = true
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: true,
      },
      take: limit,
      skip: (page - 1) * limit,
      orderBy: {
        createdAt: 'desc',
      },
    })

    const total = await prisma.product.count({ where })

    return NextResponse.json({
      success: true,
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
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
    const requiredFields = ['name', 'slug', 'description', 'price', 'categoryId', 'images']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Check if slug already exists
    const existingProduct = await prisma.product.findUnique({
      where: { slug: body.slug }
    })

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Product with this slug already exists' },
        { status: 400 }
      )
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice,
        images: body.images,
        categoryId: body.categoryId,
        tags: body.tags || [],
        materials: body.materials || [],
        sizes: body.sizes || ['A4', 'A3', 'A2', 'A1'],
        frames: body.frames || ['Black', 'White', 'Natural', 'None'],
        dimensions: body.dimensions || { width: 297, height: 420 },
        inStock: body.inStock !== undefined ? body.inStock : true,
        stockCount: body.stockCount || 0,
        featured: body.featured || false,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
      },
      include: {
        category: true,
      },
    })

    // Update category product count
    await prisma.category.update({
      where: { id: body.categoryId },
      data: {
        productCount: {
          increment: 1,
        },
      },
    })

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
