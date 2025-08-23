import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2
    const range = []
    const rangeWithDots = []

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i)
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...')
    } else {
      rangeWithDots.push(1)
    }

    rangeWithDots.push(...range)

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages)
    } else {
      rangeWithDots.push(totalPages)
    }

    return rangeWithDots
  }

  const visiblePages = getVisiblePages()

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="sr-only">Previous</span>
      </button>

      {/* Page Numbers */}
      {visiblePages.map((page, index) => (
        <div key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                currentPage === page
                  ? 'bg-accent-500 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          )}
        </div>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={cn(
          'flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-100'
        )}
      >
        <ChevronRight className="w-4 h-4" />
        <span className="sr-only">Next</span>
      </button>
    </div>
  )
}

