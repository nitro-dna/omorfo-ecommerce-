'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, MapPin, Home, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import toast from 'react-hot-toast'

interface AddressesManagerProps {
  user: any
}

interface Address {
  id: string
  user_id: string
  type: 'shipping' | 'billing'
  first_name: string
  last_name: string
  company?: string
  address_line_1: string
  address_line_2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export function AddressesManager({ user }: AddressesManagerProps) {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    type: 'shipping',
    first_name: '',
    last_name: '',
    company: '',
    address_line_1: '',
    address_line_2: '',
    city: '',
    state: '',
    postal_code: '',
    country: 'Germany',
    phone: '',
    is_default: false,
  })

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/supabase/addresses')
      
      if (response.ok) {
        const data = await response.json()
        setAddresses(data.data || [])
      } else {
        console.error('Failed to fetch addresses')
        toast.error('Failed to load addresses')
      }
    } catch (error) {
      console.error('Error fetching addresses:', error)
      toast.error('Failed to load addresses')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const resetForm = () => {
    setFormData({
      type: 'shipping',
      first_name: '',
      last_name: '',
      company: '',
      address_line_1: '',
      address_line_2: '',
      city: '',
      state: '',
      postal_code: '',
      country: 'Germany',
      phone: '',
      is_default: false,
    })
    setEditingAddress(null)
    setIsAdding(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const url = editingAddress 
        ? `/api/supabase/addresses?id=${editingAddress.id}`
        : '/api/supabase/addresses'
      
      const method = editingAddress ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const data = await response.json()
        toast.success(editingAddress ? 'Address updated successfully!' : 'Address added successfully!')
        resetForm()
        fetchAddresses()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to save address')
      }
    } catch (error) {
      console.error('Error saving address:', error)
      toast.error('Failed to save address')
    }
  }

  const handleEdit = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      type: address.type,
      first_name: address.first_name,
      last_name: address.last_name,
      company: address.company || '',
      address_line_1: address.address_line_1,
      address_line_2: address.address_line_2 || '',
      city: address.city,
      state: address.state,
      postal_code: address.postal_code,
      country: address.country,
      phone: address.phone || '',
      is_default: address.is_default,
    })
    setIsAdding(true)
  }

  const handleDelete = async (addressId: string) => {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    try {
      const response = await fetch(`/api/supabase/addresses?id=${addressId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('Address deleted successfully!')
        fetchAddresses()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete address')
      }
    } catch (error) {
      console.error('Error deleting address:', error)
      toast.error('Failed to delete address')
    }
  }

  const handleSetDefault = async (addressId: string) => {
    try {
      const response = await fetch(`/api/supabase/addresses/default?id=${addressId}`, {
        method: 'PUT',
      })

      if (response.ok) {
        toast.success('Default address updated!')
        fetchAddresses()
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to update default address')
      }
    } catch (error) {
      console.error('Error setting default address:', error)
      toast.error('Failed to update default address')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Address List */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Saved Addresses ({addresses.length})
              </h2>
              <Button
                onClick={() => setIsAdding(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Address</span>
              </Button>
            </div>
          </div>

          <div className="p-6">
            {addresses.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                <p className="text-gray-600 mb-4">
                  Add your first address to make checkout faster
                </p>
                <Button onClick={() => setIsAdding(true)}>
                  Add Your First Address
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`border rounded-lg p-4 ${
                      address.is_default ? 'border-accent-500 bg-accent-50' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          {address.type === 'shipping' ? (
                            <Home className="w-4 h-4 text-blue-600" />
                          ) : (
                            <Building className="w-4 h-4 text-purple-600" />
                          )}
                          <span className="text-sm font-medium text-gray-900">
                            {address.type.charAt(0).toUpperCase() + address.type.slice(1)} Address
                          </span>
                          {address.is_default && (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent-100 text-accent-800">
                              Default
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-900">
                          <p className="font-medium">
                            {address.first_name} {address.last_name}
                          </p>
                          {address.company && (
                            <p className="text-gray-600">{address.company}</p>
                          )}
                          <p>{address.address_line_1}</p>
                          {address.address_line_2 && (
                            <p>{address.address_line_2}</p>
                          )}
                          <p>
                            {address.city}, {address.state} {address.postal_code}
                          </p>
                          <p>{address.country}</p>
                          {address.phone && (
                            <p className="text-gray-600">{address.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        {!address.is_default && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetDefault(address.id)}
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(address)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(address.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Type
                </label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value)}
                >
                  <option value="shipping">Shipping Address</option>
                  <option value="billing">Billing Address</option>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.first_name}
                    onChange={(e) => handleInputChange('first_name', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name *
                  </label>
                  <Input
                    type="text"
                    value={formData.last_name}
                    onChange={(e) => handleInputChange('last_name', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company (Optional)
                </label>
                <Input
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1 *
                </label>
                <Input
                  type="text"
                  value={formData.address_line_1}
                  onChange={(e) => handleInputChange('address_line_1', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2 (Optional)
                </label>
                <Input
                  type="text"
                  value={formData.address_line_2}
                  onChange={(e) => handleInputChange('address_line_2', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Input
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State/Province *
                  </label>
                  <Input
                    type="text"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postal Code *
                  </label>
                  <Input
                    type="text"
                    value={formData.postal_code}
                    onChange={(e) => handleInputChange('postal_code', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country *
                  </label>
                  <Select
                    value={formData.country}
                    onValueChange={(value) => handleInputChange('country', value)}
                  >
                    <option value="Germany">Germany</option>
                    <option value="Austria">Austria</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="France">France</option>
                    <option value="Italy">Italy</option>
                    <option value="Spain">Spain</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="Belgium">Belgium</option>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone (Optional)
                </label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_default"
                  checked={formData.is_default}
                  onChange={(e) => handleInputChange('is_default', e.target.checked)}
                  className="h-4 w-4 text-accent-600 focus:ring-accent-500 border-gray-300 rounded"
                />
                <label htmlFor="is_default" className="ml-2 block text-sm text-gray-900">
                  Set as default {formData.type} address
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <Button type="submit" className="flex-1">
                  {editingAddress ? 'Update Address' : 'Add Address'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
