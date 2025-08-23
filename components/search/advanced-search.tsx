'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, X, Filter, TrendingUp, Clock, Star, Tag } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabase'
import toast from 'react-hot-toast'

interface SearchSuggestion {
  id: string
  name: string
  type: 'product' | 'category' | 'tag'
  relevance: number
  image?: string
}

interface SearchHistory {
  id: string
  query: string
  created_at: string
  result_count: number
}

interface SearchFilter {
  category?: string[]
  priceRange?: [number, number]
  rating?: number
  inStock?: boolean
  size?: string[]
  color?: string[]
  sortBy?: 'relevance' | 'price_low' | 'price_high' | 'rating' | 'newest'
}

export function AdvancedSearch({ className = '' }: { className?: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session } = useSession()
  
  const [query, setQuery] = useState(searchParams.get('q') || '')
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [trendingSearches, setTrendingSearches] = useState<string[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filters, setFilters] = useState<SearchFilter>({})
  const [showFilters, setShowFilters] = useState(false)
  
  const searchInputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Load search history and trending searches
  useEffect(() => {
    loadSearchHistory()
    loadTrendingSearches()
  }, [session])

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced search suggestions
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setSuggestions([])
        return
      }

      try {
        setIsSearching(true)
        
        // Search products
        const { data: products } = await supabase
          .from('products')
          .select('id, name, category_id, rating, stock_count, image_url')
          .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
          .limit(5)

        // Search categories
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .ilike('name', `%${searchQuery}%`)
          .limit(3)

        // Combine and format suggestions
        const productSuggestions: SearchSuggestion[] = (products || []).map(product => ({
          id: product.id,
          name: product.name,
          type: 'product' as const,
          relevance: product.rating || 0,
          image: product.image_url
        }))

        const categorySuggestions: SearchSuggestion[] = (categories || []).map(category => ({
          id: category.id,
          name: category.name,
          type: 'category' as const,
          relevance: 1
        }))

        // Add tag suggestions based on common tags
        const tagSuggestions: SearchSuggestion[] = getTagSuggestions(searchQuery)

        const allSuggestions = [
          ...productSuggestions,
          ...categorySuggestions,
          ...tagSuggestions
        ].sort((a, b) => b.relevance - a.relevance)

        setSuggestions(allSuggestions.slice(0, 8))
      } catch (error) {
        console.error('Search error:', error)
      } finally {
        setIsSearching(false)
      }
    }, 300),
    []
  )

  // Update suggestions when query changes
  useEffect(() => {
    debouncedSearch(query)
  }, [query, debouncedSearch])

  const loadSearchHistory = async () => {
    if (!session?.user?.email) return

    try {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      const { data: history } = await supabase
        .from('search_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10)

      setSearchHistory(history || [])
    } catch (error) {
      console.error('Failed to load search history:', error)
    }
  }

  const loadTrendingSearches = async () => {
    try {
      const { data: trending } = await supabase
        .from('search_trends')
        .select('query, search_count')
        .order('search_count', { ascending: false })
        .limit(8)

      setTrendingSearches(trending?.map(t => t.query) || [])
    } catch (error) {
      console.error('Failed to load trending searches:', error)
    }
  }

  const saveSearchHistory = async (searchQuery: string, resultCount: number) => {
    if (!session?.user?.email) return

    try {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      await supabase
        .from('search_history')
        .insert({
          user_id: user.id,
          query: searchQuery,
          result_count: resultCount
        })

      // Update trending searches
      await supabase.rpc('increment_search_count', { search_query: searchQuery })
    } catch (error) {
      console.error('Failed to save search history:', error)
    }
  }

  const handleSearch = async (searchQuery: string = query) => {
    if (!searchQuery.trim()) return

    setShowSuggestions(false)
    
    // Build search URL with filters
    const params = new URLSearchParams()
    params.set('q', searchQuery)
    
    if (filters.category?.length) {
      params.set('category', filters.category.join(','))
    }
    if (filters.priceRange) {
      params.set('minPrice', filters.priceRange[0].toString())
      params.set('maxPrice', filters.priceRange[1].toString())
    }
    if (filters.rating) {
      params.set('rating', filters.rating.toString())
    }
    if (filters.inStock) {
      params.set('inStock', 'true')
    }
    if (filters.size?.length) {
      params.set('size', filters.size.join(','))
    }
    if (filters.color?.length) {
      params.set('color', filters.color.join(','))
    }
    if (filters.sortBy) {
      params.set('sort', filters.sortBy)
    }

    // Navigate to search results
    router.push(`/search?${params.toString()}`)
    
    // Save search history
    await saveSearchHistory(searchQuery, 0) // We'll update this with actual count later
    
    toast.success(`Searching for "${searchQuery}"`)
  }

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    setQuery(suggestion.name)
    handleSearch(suggestion.name)
  }

  const handleHistoryClick = (historyItem: SearchHistory) => {
    setQuery(historyItem.query)
    handleSearch(historyItem.query)
  }

  const clearSearchHistory = async () => {
    if (!session?.user?.email) return

    try {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      await supabase
        .from('search_history')
        .delete()
        .eq('user_id', user.id)

      setSearchHistory([])
      toast.success('Search history cleared')
    } catch (error) {
      console.error('Failed to clear search history:', error)
      toast.error('Failed to clear search history')
    }
  }

  const getTagSuggestions = (searchQuery: string): SearchSuggestion[] => {
    const commonTags = [
      'abstract', 'nature', 'vintage', 'minimalist', 'urban', 'geometric',
      'floral', 'typography', 'landscape', 'portrait', 'modern', 'classic'
    ]

    return commonTags
      .filter(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(tag => ({
        id: `tag-${tag}`,
        name: tag,
        type: 'tag' as const,
        relevance: 0.5
      }))
  }

  return (
    <div className={`relative ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSearch()
              }
            }}
            placeholder="Search posters, categories, or tags..."
            className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded ${
              showFilters ? 'bg-accent-500 text-white' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Search Suggestions */}
        {showSuggestions && (
          <div
            ref={suggestionsRef}
            className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
          >
            {/* Search History */}
            {searchHistory.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Recent Searches
                  </h3>
                  <button
                    onClick={clearSearchHistory}
                    className="text-xs text-gray-500 hover:text-red-500"
                  >
                    Clear
                  </button>
                </div>
                <div className="space-y-2">
                  {searchHistory.slice(0, 3).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryClick(item)}
                      className="flex items-center justify-between w-full p-2 text-left hover:bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">{item.query}</span>
                      <span className="text-xs text-gray-500">{item.result_count} results</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Trending Searches */}
            {trendingSearches.length > 0 && (
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-medium text-gray-700 flex items-center mb-3">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Trending
                </h3>
                <div className="flex flex-wrap gap-2">
                  {trendingSearches.slice(0, 6).map((trend, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(trend)}
                      className="px-3 py-1 text-xs bg-gray-100 hover:bg-accent-100 text-gray-700 hover:text-accent-700 rounded-full transition-colors"
                    >
                      {trend}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Suggestions</h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="flex items-center w-full p-2 text-left hover:bg-gray-50 rounded"
                    >
                      {suggestion.image && (
                        <img
                          src={suggestion.image}
                          alt={suggestion.name}
                          className="w-8 h-8 object-cover rounded mr-3"
                        />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-sm font-medium text-gray-900">
                            {suggestion.name}
                          </span>
                          <span className="ml-2 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                            {suggestion.type}
                          </span>
                        </div>
                        {suggestion.type === 'product' && suggestion.relevance > 0 && (
                          <div className="flex items-center mt-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-500 ml-1">
                              {suggestion.relevance.toFixed(1)}
                            </span>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Loading State */}
            {isSearching && (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent-500 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Searching...</p>
              </div>
            )}

            {/* No Results */}
            {!isSearching && suggestions.length === 0 && query.length >= 2 && (
              <div className="p-4 text-center">
                <p className="text-sm text-gray-500">No suggestions found</p>
                <button
                  onClick={() => handleSearch()}
                  className="mt-2 text-sm text-accent-600 hover:text-accent-700"
                >
                  Search for "{query}"
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-40 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categories
              </label>
              <div className="space-y-2">
                {['Abstract', 'Nature', 'Typography', 'Vintage', 'Minimalist', 'Urban'].map((category) => (
                  <label key={category} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.category?.includes(category.toLowerCase()) || false}
                      onChange={(e) => {
                        const newCategories = e.target.checked
                          ? [...(filters.category || []), category.toLowerCase()]
                          : (filters.category || []).filter(c => c !== category.toLowerCase())
                        setFilters({ ...filters, category: newCategories })
                      }}
                      className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Range
              </label>
              <div className="space-y-2">
                <input
                  type="range"
                  min="0"
                  max="500"
                  value={filters.priceRange?.[1] || 500}
                  onChange={(e) => setFilters({
                    ...filters,
                    priceRange: [filters.priceRange?.[0] || 0, parseInt(e.target.value)]
                  })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>€0</span>
                  <span>€{filters.priceRange?.[1] || 500}</span>
                </div>
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={filters.sortBy || 'relevance'}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
              >
                <option value="relevance">Relevance</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
            <button
              onClick={() => setFilters({})}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear All Filters
            </button>
            <button
              onClick={() => {
                setShowFilters(false)
                handleSearch()
              }}
              className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
