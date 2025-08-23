import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    // First, create categories
    const categories = await Promise.all([
      prisma.category.upsert({
        where: { slug: 'abstract' },
        update: {},
        create: {
          name: 'Abstract',
          slug: 'abstract',
          description: 'Modern abstract art pieces',
          image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'nature' },
        update: {},
        create: {
          name: 'Nature',
          slug: 'nature',
          description: 'Beautiful nature-inspired designs',
          image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        },
      }),
      prisma.category.upsert({
        where: { slug: 'typography' },
        update: {},
        create: {
          name: 'Typography',
          slug: 'typography',
          description: 'Elegant typography posters',
          image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        },
      }),
    ])

    // Get category IDs
    const abstractCategory = categories.find(c => c.slug === 'abstract')!
    const natureCategory = categories.find(c => c.slug === 'nature')!
    const typographyCategory = categories.find(c => c.slug === 'typography')!

    // Create sample products
    const products = [
      {
        name: 'Ocean Waves Calm',
        slug: 'ocean-waves-calm',
        description: 'A serene ocean scene with gentle waves and calming blue tones',
        price: 49.99,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        ],
        categoryId: natureCategory.id,
        rating: 4.8,
        reviewCount: 124,
        inStock: true,
        stockCount: 50,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['ocean', 'calm', 'blue', 'nature'],
        featured: true,
      },
      {
        name: 'Abstract Geometric',
        slug: 'abstract-geometric',
        description: 'Modern geometric patterns with vibrant colors',
        price: 39.99,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
        ],
        categoryId: abstractCategory.id,
        rating: 4.6,
        reviewCount: 89,
        inStock: true,
        stockCount: 35,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['abstract', 'geometric', 'modern', 'colorful'],
        featured: true,
      },
      {
        name: 'Minimalist Quote',
        slug: 'minimalist-quote',
        description: 'Elegant typography with inspiring quotes',
        price: 29.99,
        images: [
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
        ],
        categoryId: typographyCategory.id,
        rating: 4.9,
        reviewCount: 156,
        inStock: true,
        stockCount: 75,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['typography', 'minimalist', 'quote', 'inspiration'],
        featured: false,
      },
      {
        name: 'Mountain Landscape',
        slug: 'mountain-landscape',
        description: 'Breathtaking mountain scenery with dramatic lighting',
        price: 59.99,
        images: [
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
        ],
        categoryId: natureCategory.id,
        rating: 4.7,
        reviewCount: 203,
        inStock: true,
        stockCount: 40,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['mountain', 'landscape', 'nature', 'dramatic'],
        featured: true,
      },
      {
        name: 'Colorful Abstract',
        slug: 'colorful-abstract',
        description: 'Vibrant abstract art with bold colors and dynamic shapes',
        price: 44.99,
        images: [
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
          'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
        ],
        categoryId: abstractCategory.id,
        rating: 4.5,
        reviewCount: 67,
        inStock: true,
        stockCount: 30,
        dimensions: { width: 297, height: 420 },
        materials: ['Premium Paper', 'Fade-resistant Ink'],
        sizes: ['A4', 'A3', 'A2', 'A1'],
        frames: ['Black', 'White', 'Natural', 'None'],
        tags: ['abstract', 'colorful', 'vibrant', 'dynamic'],
        featured: false,
      },
    ]

    // Create products
    const createdProducts = await Promise.all(
      products.map(product =>
        prisma.product.upsert({
          where: { slug: product.slug },
          update: {},
          create: product,
        })
      )
    )

    // Update category product counts
    await Promise.all(
      categories.map(category =>
        prisma.category.update({
          where: { id: category.id },
          data: {
            productCount: createdProducts.filter(p => p.categoryId === category.id).length,
          },
        })
      )
    )

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${createdProducts.length} products and ${categories.length} categories`,
      products: createdProducts.length,
      categories: categories.length,
    })
  } catch (error) {
    console.error('Error seeding database:', error)
    return NextResponse.json(
      { error: 'Failed to seed database', details: error },
      { status: 500 }
    )
  }
}
