'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  {
    id: 'abstract',
    name: 'Abstract',
    slug: 'abstract',
    description: 'Bold geometric shapes and vibrant colors',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
    productCount: 45,
    color: 'bg-gradient-to-br from-purple-500 to-pink-500',
  },
  {
    id: 'nature',
    name: 'Nature',
    slug: 'nature',
    description: 'Breathtaking landscapes and natural beauty',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    productCount: 38,
    color: 'bg-gradient-to-br from-green-500 to-blue-500',
  },
  {
    id: 'typography',
    name: 'Typography',
    slug: 'typography',
    description: 'Inspiring words and motivational quotes',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    productCount: 32,
    color: 'bg-gradient-to-br from-orange-500 to-red-500',
  },
  {
    id: 'vintage',
    name: 'Vintage',
    slug: 'vintage',
    description: 'Retro designs with nostalgic charm',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=300&fit=crop',
    productCount: 28,
    color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    slug: 'minimalist',
    description: 'Clean lines and simple elegance',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
    productCount: 41,
    color: 'bg-gradient-to-br from-gray-500 to-gray-700',
  },
  {
    id: 'urban',
    name: 'Urban',
    slug: 'urban',
    description: 'City life and modern architecture',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    productCount: 35,
    color: 'bg-gradient-to-br from-blue-500 to-purple-500',
  },
]

export function CategoriesSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/categories/${category.slug}`}
          className="group relative overflow-hidden rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
        >
          {/* Background Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={category.image}
              alt={category.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-all duration-300" />
            
            {/* Gradient Overlay */}
            <div className={`absolute inset-0 ${category.color} opacity-20 group-hover:opacity-30 transition-opacity duration-300`} />
          </div>

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-6 text-white">
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              <h3 className="text-2xl font-display font-semibold mb-2">
                {category.name}
              </h3>
              <p className="text-gray-200 mb-3 text-sm">
                {category.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">
                  {category.productCount} posters
                </span>
                <ArrowRight className="w-5 h-5 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" />
              </div>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-lg transition-colors duration-300" />
        </Link>
      ))}
    </div>
  )
}
