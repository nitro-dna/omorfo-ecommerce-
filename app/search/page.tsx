import { Suspense } from 'react'
import { SearchResults } from '@/components/search/search-results'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export const metadata = {
  title: 'Search Results - ómorfo',
  description: 'Find the perfect poster with our advanced search.',
}

interface SearchPageProps {
  searchParams: {
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    rating?: string
    inStock?: string
    size?: string
    color?: string
    sort?: string
    page?: string
  }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <SearchResults searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
