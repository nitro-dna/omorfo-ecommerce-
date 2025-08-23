import { Suspense } from 'react'
import { ProductGrid } from '@/components/products/product-grid'
import { ProductFilters } from '@/components/products/product-filters'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Shop All Posters - ómorfo',
  description: 'Browse our complete collection of high-quality custom posters. Filter by category, price, and style to find the perfect poster for your space.',
}

export default function ShopPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Shop All Posters
          </h1>
          <p className="text-lg text-gray-600">
            Discover our complete collection of high-quality custom posters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters />
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            <Suspense fallback={<LoadingSpinner />}>
              <ProductGrid />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}

