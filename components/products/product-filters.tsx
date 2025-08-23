'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const categories = [
  { id: 'abstract', name: 'Abstract', count: 45 },
  { id: 'nature', name: 'Nature', count: 38 },
  { id: 'typography', name: 'Typography', count: 32 },
  { id: 'vintage', name: 'Vintage', count: 28 },
  { id: 'minimalist', name: 'Minimalist', count: 41 },
  { id: 'urban', name: 'Urban', count: 35 },
]

const priceRanges = [
  { id: '0-25', name: 'Under $25', count: 12 },
  { id: '25-50', name: '$25 - $50', count: 45 },
  { id: '50-100', name: '$50 - $100', count: 38 },
  { id: '100-200', name: '$100 - $200', count: 25 },
  { id: '200+', name: 'Over $200', count: 8 },
]

const sizes = [
  { id: 'a4', name: 'A4 (8.3" × 11.7")', count: 56 },
  { id: 'a3', name: 'A3 (11.7" × 16.5")', count: 42 },
  { id: 'a2', name: 'A2 (16.5" × 23.4")', count: 38 },
  { id: 'a1', name: 'A1 (23.4" × 33.1")', count: 25 },
  { id: 'a0', name: 'A0 (33.1" × 46.8")', count: 12 },
]

const colors = [
  { id: 'black', name: 'Black & White', count: 34 },
  { id: 'colorful', name: 'Colorful', count: 45 },
  { id: 'neutral', name: 'Neutral', count: 28 },
  { id: 'pastel', name: 'Pastel', count: 22 },
]

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left font-medium text-gray-900"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>
      {isOpen && <div className="mt-4 space-y-3">{children}</div>}
    </div>
  )
}

interface FilterOptionProps {
  id: string
  name: string
  count: number
  checked: boolean
  onChange: (id: string) => void
}

function FilterOption({ id, name, count, checked, onChange }: FilterOptionProps) {
  return (
    <label className="flex items-center space-x-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="w-4 h-4 text-accent-500 border-gray-300 rounded focus:ring-accent-500"
      />
      <span className="text-sm text-gray-700 flex-1">{name}</span>
      <span className="text-xs text-gray-500">({count})</span>
    </label>
  )
}

export function ProductFilters() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handlePriceRangeChange = (rangeId: string) => {
    setSelectedPriceRanges(prev =>
      prev.includes(rangeId)
        ? prev.filter(id => id !== rangeId)
        : [...prev, rangeId]
    )
  }

  const handleSizeChange = (sizeId: string) => {
    setSelectedSizes(prev =>
      prev.includes(sizeId)
        ? prev.filter(id => id !== sizeId)
        : [...prev, sizeId]
    )
  }

  const handleColorChange = (colorId: string) => {
    setSelectedColors(prev =>
      prev.includes(colorId)
        ? prev.filter(id => id !== colorId)
        : [...prev, colorId]
    )
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSelectedPriceRanges([])
    setSelectedSizes([])
    setSelectedColors([])
  }

  const hasActiveFilters = selectedCategories.length > 0 || 
                          selectedPriceRanges.length > 0 || 
                          selectedSizes.length > 0 || 
                          selectedColors.length > 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-sm text-accent-600 hover:text-accent-700 flex items-center space-x-1"
          >
            <X className="w-4 h-4" />
            <span>Clear all</span>
          </button>
        )}
      </div>

      {/* Categories */}
      <FilterSection title="Categories">
        {categories.map((category) => (
          <FilterOption
            key={category.id}
            id={category.id}
            name={category.name}
            count={category.count}
            checked={selectedCategories.includes(category.id)}
            onChange={handleCategoryChange}
          />
        ))}
      </FilterSection>

      {/* Price Range */}
      <FilterSection title="Price Range">
        {priceRanges.map((range) => (
          <FilterOption
            key={range.id}
            id={range.id}
            name={range.name}
            count={range.count}
            checked={selectedPriceRanges.includes(range.id)}
            onChange={handlePriceRangeChange}
          />
        ))}
      </FilterSection>

      {/* Sizes */}
      <FilterSection title="Sizes">
        {sizes.map((size) => (
          <FilterOption
            key={size.id}
            id={size.id}
            name={size.name}
            count={size.count}
            checked={selectedSizes.includes(size.id)}
            onChange={handleSizeChange}
          />
        ))}
      </FilterSection>

      {/* Colors */}
      <FilterSection title="Colors">
        {colors.map((color) => (
          <FilterOption
            key={color.id}
            id={color.id}
            name={color.name}
            count={color.count}
            checked={selectedColors.includes(color.id)}
            onChange={handleColorChange}
          />
        ))}
      </FilterSection>

      {/* Apply Filters Button */}
      {hasActiveFilters && (
        <div className="pt-4">
          <Button className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </div>
  )
}

