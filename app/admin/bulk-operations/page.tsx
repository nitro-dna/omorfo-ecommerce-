'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  CheckSquare, 
  Square, 
  Trash2, 
  Edit, 
  Mail, 
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Users,
  Package,
  ShoppingCart
} from 'lucide-react'
import toast from 'react-hot-toast'

interface BulkItem {
  id: string
  name: string
  email?: string
  status?: string
  type: 'customer' | 'product' | 'order'
  selected: boolean
}

export default function BulkOperationsPage() {
  const [items, setItems] = useState<BulkItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [operationType, setOperationType] = useState<'customers' | 'products' | 'orders'>('customers')
  const [bulkAction, setBulkAction] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchItems = async () => {
    setIsLoading(true)
    try {
      let response
      switch (operationType) {
        case 'customers':
          response = await fetch('/api/admin/customers')
          break
        case 'products':
          response = await fetch('/api/admin/products')
          break
        case 'orders':
          response = await fetch('/api/admin/orders')
          break
      }

      const data = await response?.json()
      
      if (data.success) {
        const itemsData = data.customers || data.products || data.orders || []
        setItems(itemsData.map((item: any) => ({
          id: item.id,
          name: item.name || item.title || item.order_number,
          email: item.email,
          status: item.status,
          type: operationType.slice(0, -1) as 'customer' | 'product' | 'order',
          selected: false
        })))
      } else {
        toast.error('Failed to fetch items')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      toast.error('Failed to fetch items')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchItems()
  }, [operationType])

  const toggleSelectAll = () => {
    const allSelected = items.every(item => item.selected)
    setItems(items.map(item => ({ ...item, selected: !allSelected })))
  }

  const toggleSelectItem = (id: string) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, selected: !item.selected } : item
    ))
  }

  const getSelectedCount = () => items.filter(item => item.selected).length

  const executeBulkAction = async () => {
    const selectedItems = items.filter(item => item.selected)
    
    if (selectedItems.length === 0) {
      toast.error('Please select items to perform bulk action')
      return
    }

    setIsProcessing(true)
    try {
      switch (bulkAction) {
        case 'delete':
          await handleBulkDelete(selectedItems)
          break
        case 'export':
          await handleBulkExport(selectedItems)
          break
        case 'email':
          await handleBulkEmail(selectedItems)
          break
        case 'status':
          await handleBulkStatusUpdate(selectedItems)
          break
        default:
          toast.error('Please select a valid action')
      }
    } catch (error) {
      console.error('Bulk action error:', error)
      toast.error('Failed to execute bulk action')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleBulkDelete = async (selectedItems: BulkItem[]) => {
    if (!confirm(`Are you sure you want to delete ${selectedItems.length} items?`)) {
      return
    }

    // Simulate bulk delete
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setItems(items.filter(item => !item.selected))
    toast.success(`Successfully deleted ${selectedItems.length} items`)
  }

  const handleBulkExport = async (selectedItems: BulkItem[]) => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Status'],
      ...selectedItems.map(item => [
        item.id,
        item.name,
        item.email || '',
        item.status || ''
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${operationType}-export.csv`
    a.click()
    window.URL.revokeObjectURL(url)
    
    toast.success(`Exported ${selectedItems.length} items`)
  }

  const handleBulkEmail = async (selectedItems: BulkItem[]) => {
    const customers = selectedItems.filter(item => item.type === 'customer')
    
    if (customers.length === 0) {
      toast.error('No customers selected for email')
      return
    }

    // Simulate bulk email
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    toast.success(`Sent emails to ${customers.length} customers`)
  }

  const handleBulkStatusUpdate = async (selectedItems: BulkItem[]) => {
    const newStatus = prompt('Enter new status:')
    if (!newStatus) return

    // Simulate status update
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setItems(items.map(item => 
      item.selected ? { ...item, status: newStatus } : item
    ))
    
    toast.success(`Updated status for ${selectedItems.length} items`)
  }

  const getOperationIcon = () => {
    switch (operationType) {
      case 'customers':
        return <Users className="w-5 h-5" />
      case 'products':
        return <Package className="w-5 h-5" />
      case 'orders':
        return <ShoppingCart className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Operations</h1>
                <p className="text-gray-600">Manage multiple items at once</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={fetchItems} disabled={isLoading}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Link href="/admin">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Operation Type Selector */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Operation Type</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant={operationType === 'customers' ? 'primary' : 'outline'}
                onClick={() => setOperationType('customers')}
                className="h-16"
              >
                <Users className="w-5 h-5 mr-2" />
                Customers
              </Button>
              <Button
                variant={operationType === 'products' ? 'primary' : 'outline'}
                onClick={() => setOperationType('products')}
                className="h-16"
              >
                <Package className="w-5 h-5 mr-2" />
                Products
              </Button>
              <Button
                variant={operationType === 'orders' ? 'primary' : 'outline'}
                onClick={() => setOperationType('orders')}
                className="h-16"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                Orders
              </Button>
            </div>
          </div>

          {/* Bulk Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                {getOperationIcon()}
                <span className="ml-2">{operationType.charAt(0).toUpperCase() + operationType.slice(1)}</span>
              </h2>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {getSelectedCount()} of {items.length} selected
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleSelectAll}
                >
                  {items.every(item => item.selected) ? (
                    <>
                      <CheckSquare className="w-4 h-4 mr-2" />
                      Deselect All
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 mr-2" />
                      Select All
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2"
              >
                <option value="">Select Action</option>
                <option value="delete">Delete Selected</option>
                <option value="export">Export Selected</option>
                <option value="email">Send Email</option>
                <option value="status">Update Status</option>
              </select>
              
              <Button
                onClick={executeBulkAction}
                disabled={!bulkAction || getSelectedCount() === 0 || isProcessing}
                className="w-full"
              >
                {isProcessing ? <LoadingSpinner /> : <CheckCircle className="w-4 h-4 mr-2" />}
                Execute Action
              </Button>
            </div>

            {bulkAction && getSelectedCount() === 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                <span className="text-yellow-800">Please select items to perform this action</span>
              </div>
            )}
          </div>

          {/* Items List */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {isLoading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
                <p className="mt-4 text-gray-600">Loading items...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No {operationType} found
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={items.every(item => item.selected)}
                          onChange={toggleSelectAll}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={item.selected}
                            onChange={() => toggleSelectItem(item.id)}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {item.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.email || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            item.status === 'active' || item.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {item.status || 'N/A'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Edit className="w-4 h-4" />
                            </Button>
                            {item.email && (
                              <Button size="sm" variant="outline">
                                <Mail className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
