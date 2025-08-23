'use client'

import { useState, useEffect, useRef } from 'react'
import { Fragment } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Dialog, Transition, Combobox } from '@headlessui/react'
import { Search, X, Clock, TrendingUp } from 'lucide-react'
import { useQuery } from 'react-query'
import { formatPrice } from '@/lib/utils'

// Mock search results
const mockSearchResults = [
  {
    id: '1',
    name: 'Abstract Geometric Harmony',
    slug: 'abstract-geometric-harmony',
    price: 29.99,
    salePrice: 24.99,
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop',
    category: 'Abstract',
  },
  {
    id: '2',
    name: 'Mountain Landscape Serenity',
    slug: 'mountain-landscape-serenity',
    price: 34.99,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
    category: 'Nature',
  },
  {
    id: '3',
    name: 'Typography Inspiration',
    slug: 'typography-inspiration',
    price: 27.99,
    salePrice: 22.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    category: 'Typography',
  },
  {
    id: '4',
    name: 'Vintage Travel Adventure',
    slug: 'vintage-travel-adventure',
    price: 32.99,
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=400&h=600&fit=crop',
    category: 'Vintage',
  },
  {
    id: '5',
    name: 'Minimalist Zen',
    slug: 'minimalist-zen',
    price: 25.99,
    salePrice: 19.99,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=600&fit=crop',
    category: 'Minimalist',
  },
]

const popularSearches = [
  'abstract posters',
  'nature landscape',
  'typography quotes',
  'vintage travel',
  'minimalist art',
]

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Simulate search API call
  const { data: searchResults, isLoading } = useQuery(
    ['search', query],
    async () => {
      if (!query.trim()) return []
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      return mockSearchResults.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      )
    },
    {
      enabled: query.length > 0,
      staleTime: 5 * 60 * 1000,
    }
  )

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      // Add to recent searches
      setRecentSearches(prev => {
        const filtered = prev.filter(item => item !== searchTerm)
        return [searchTerm, ...filtered.slice(0, 4)]
      })
      
      // Navigate to search results
      window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSearch(query)
    }
  }

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-2xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox onChange={handleSearch}>
                <div className="relative">
                  <Search className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <Combobox.Input
                    ref={inputRef}
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                    placeholder="Search for posters..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-3.5 p-1 text-gray-400 hover:text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {query === '' ? (
                  <div className="p-6">
                    {/* Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          Recent Searches
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {recentSearches.map((search, index) => (
                            <button
                              key={index}
                              onClick={() => handleSearch(search)}
                              className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                            >
                              {search}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Popular Searches */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Popular Searches
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {popularSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => handleSearch(search)}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="max-h-96 overflow-y-auto">
                    {isLoading ? (
                      <div className="p-6 text-center text-gray-500">
                        Searching...
                      </div>
                    ) : searchResults && searchResults.length > 0 ? (
                      <Combobox.Options static className="divide-y divide-gray-100">
                        {searchResults.map((item) => (
                          <Combobox.Option
                            key={item.id}
                            value={item.name}
                            className={({ active }) =>
                              `flex cursor-pointer select-none p-4 ${
                                active ? 'bg-accent-50' : ''
                              }`
                            }
                          >
                            <Link
                              href={`/products/${item.slug}`}
                              className="flex w-full items-center"
                              onClick={onClose}
                            >
                              <Image
                                src={item.image}
                                alt={item.name}
                                width={48}
                                height={48}
                                className="h-12 w-12 flex-shrink-0 rounded object-cover"
                              />
                              <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {item.category}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {item.salePrice ? (
                                    <>
                                      <span className="text-accent-500">
                                        {formatPrice(item.salePrice)}
                                      </span>
                                      <span className="text-gray-400 line-through ml-1">
                                        {formatPrice(item.price)}
                                      </span>
                                    </>
                                  ) : (
                                    formatPrice(item.price)
                                  )}
                                </p>
                              </div>
                            </Link>
                          </Combobox.Option>
                        ))}
                      </Combobox.Options>
                    ) : (
                      <div className="p-6 text-center text-gray-500">
                        No results found for "{query}"
                      </div>
                    )}
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
