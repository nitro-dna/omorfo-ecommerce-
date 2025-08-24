import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const includeReviews = searchParams.get('includeReviews') !== 'false'
    const includeRelated = searchParams.get('includeRelated') === 'true'
    
    const product = await prisma.product.findUnique({
      where: { slug: params.slug },
      include: { 
        category: true,
        ...(includeReviews && {
          reviews: {
            include: { 
              user: {
                select: {
                  id: true,
                  name: true,
                  image: true
                }
              }
            },
            orderBy: { createdAt: 'desc' },
            take: 10 // Limit to latest 10 reviews
          }
        })
      }
    })
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get related products from same category
    let relatedProducts: any[] = []
    if (includeRelated) {
      relatedProducts = await prisma.product.findMany({
        where: {
          categoryId: product.categoryId,
          id: { not: product.id },
          inStock: true
        },
        include: { category: true },
        take: 4,
        orderBy: { rating: 'desc' }
      })
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

// Optional: Add PUT method for updating product
export async function PUT(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const body = await request.json()
    
    const product = await prisma.product.update({
      where: { slug: params.slug },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        salePrice: body.salePrice,
        images: body.images,
        tags: body.tags,
        materials: body.materials,
        sizes: body.sizes,
        frames: body.frames,
        inStock: body.inStock,
        stockCount: body.stockCount,
        featured: body.featured,
      },
      include: { category: true }
    })
    
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
