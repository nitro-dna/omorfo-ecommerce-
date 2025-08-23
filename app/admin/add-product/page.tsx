'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ImageUpload } from '@/components/ui/image-upload'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
}

export default function AddProductPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    salePrice: '',
    categoryId: '',
    images: [''],
    tags: [''],
    materials: [''],
    sizes: ['A4', 'A3', 'A2', 'A1'],
    frames: ['Black', 'White', 'Natural', 'None'],
    inStock: true,
    stockCount: '50',
    featured: false,
  })

  // Load categories on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleArrayChange = (field: string, index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).map((item: any, i: number) => 
        i === index ? value : item
      )
    }))
  }

  const addArrayItem = (field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field as keyof typeof prev] as string[]), '']
    }))
  }

  const removeArrayItem = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field as keyof typeof prev] as string[]).filter((_: any, i: number) => i !== index)
    }))
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stockCount: parseInt(formData.stockCount),
        images: formData.images.filter(img => img.trim()),
        tags: formData.tags.filter(tag => tag.trim()),
        materials: formData.materials.filter(material => material.trim()),
        dimensions: { width: 297, height: 420 }, // Default A3 size
        rating: 0,
        reviewCount: 0,
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      })

      const data = await response.json()

      if (data.success) {
        toast.success('Product added successfully!')
        router.push('/admin/products')
      } else {
        toast.error(data.error || 'Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast.error('Failed to add product')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Add New Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name *
                  </label>
                  <Input
                    value={formData.name}
                    onChange={(e) => {
                      handleInputChange('name', e.target.value)
                      handleInputChange('slug', generateSlug(e.target.value))
                    }}
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slug *
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => handleInputChange('slug', e.target.value)}
                    placeholder="product-slug"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                  required
                />
              </div>

              {/* Pricing */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price *
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="29.99"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sale Price
                  </label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.salePrice}
                    onChange={(e) => handleInputChange('salePrice', e.target.value)}
                    placeholder="24.99"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stock Count *
                  </label>
                  <Input
                    type="number"
                    value={formData.stockCount}
                    onChange={(e) => handleInputChange('stockCount', e.target.value)}
                    placeholder="50"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <Select value={formData.categoryId} onValueChange={(value) => handleInputChange('categoryId', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Images *
                </label>
                <ImageUpload
                  images={formData.images}
                  onImagesChange={(images) => handleInputChange('images', images)}
                  maxImages={5}
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                {formData.tags.map((tag, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={tag}
                      onChange={(e) => handleArrayChange('tags', index, e.target.value)}
                      placeholder="tag"
                    />
                    {formData.tags.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeArrayItem('tags', index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('tags')}
                  className="mt-2"
                >
                  Add Tag
                </Button>
              </div>

              {/* Materials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Materials
                </label>
                {formData.materials.map((material, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <Input
                      value={material}
                      onChange={(e) => handleArrayChange('materials', index, e.target.value)}
                      placeholder="Premium Paper"
                    />
                    {formData.materials.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => removeArrayItem('materials', index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addArrayItem('materials')}
                  className="mt-2"
                >
                  Add Material
                </Button>
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="inStock"
                    checked={formData.inStock}
                    onCheckedChange={(checked) => handleInputChange('inStock', checked)}
                  />
                  <label htmlFor="inStock" className="text-sm font-medium text-gray-700">
                    In Stock
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => handleInputChange('featured', checked)}
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Featured Product
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-6">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding Product...' : 'Add Product'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/admin/products')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
