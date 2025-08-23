import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // Get existing categories
    const categories = await prisma.category.findMany()
    const abstractCategory = categories.find(c => c.slug === 'abstract')
    const natureCategory = categories.find(c => c.slug === 'nature')
    const typographyCategory = categories.find(c => c.slug === 'typography')

    // ADD YOUR OWN PRODUCTS HERE
    const customProducts = [
      {
        name: 'Your Custom Product Name',
        slug: 'your-custom-product-slug',
        description: 'Your detailed product description here',
        price: 49.99,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        ],
        categoryId: natureCategory?.id || categories[0]?.id,
        rating: 4.8,
        reviewCount: 50,
        inStock: true,
        stockCount: 25,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['your', 'custom', 'tags'],
        featured: true,
      },
      // Add more products here...
      {
        name: 'Another Custom Product',
        slug: 'another-custom-product',
        description: 'Another product description',
        price: 34.99,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
        ],
        categoryId: abstractCategory?.id || categories[0]?.id,
        rating: 4.6,
        reviewCount: 30,
        inStock: true,
        stockCount: 15,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['abstract', 'modern', 'design'],
        featured: false,
      },
    ]

    // Create products
    const createdProducts = await Promise.all(
      customProducts.map(product =>
        prisma.product.upsert({
          where: { slug: product.slug },
          update: {},
          create: product,
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: `Successfully added ${createdProducts.length} custom products`,
      products: createdProducts.length,
    })
  } catch (error) {
    console.error('Error adding custom products:', error)
    return NextResponse.json(
      { error: 'Failed to add custom products', details: error },
      { status: 500 }
    )
  }
}
