'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Save,
  Send,
  Settings,
  Users,
  ShoppingCart,
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Mail
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Notification {
  id: string
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  category: 'order' | 'customer' | 'product' | 'system' | 'promotional'
  target: 'all' | 'customers' | 'admin' | 'specific'
  status: 'draft' | 'scheduled' | 'sent' | 'cancelled'
  scheduled_at?: string
  sent_at?: string
  created_at: string
  updated_at: string
  recipients?: string[]
}

export default function NotificationCenterPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)
  const [filter, setFilter] = useState('all')

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as Notification['type'],
    category: 'system' as Notification['category'],
    target: 'all' as Notification['target'],
    scheduled_at: '',
    recipients: ''
  })

  const notificationTypes = [
    { value: 'info', label: 'Information', icon: <Bell className="w-4 h-4" />, color: 'text-blue-600' },
    { value: 'success', label: 'Success', icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600' },
    { value: 'warning', label: 'Warning', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-yellow-600' },
    { value: 'error', label: 'Error', icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-600' }
  ]

  const notificationCategories = [
    { value: 'order', label: 'Order', icon: <ShoppingCart className="w-4 h-4" /> },
    { value: 'customer', label: 'Customer', icon: <Users className="w-4 h-4" /> },
    { value: 'product', label: 'Product', icon: <Package className="w-4 h-4" /> },
    { value: 'system', label: 'System', icon: <Settings className="w-4 h-4" /> },
    { value: 'promotional', label: 'Promotional', icon: <Mail className="w-4 h-4" /> }
  ]

  const defaultNotifications = [
    {
      id: 'notif-1',
      title: 'New Order Received',
      message: 'A new order has been placed and requires your attention.',
      type: 'info' as const,
      category: 'order' as const,
      target: 'admin' as const,
      status: 'sent' as const,
      sent_at: new Date(Date.now() - 3600000).toISOString(),
      created_at: new Date(Date.now() - 7200000).toISOString(),
      updated_at: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'notif-2',
      title: 'Low Stock Alert',
      message: 'Product "Custom Poster - Abstract" is running low on stock.',
      type: 'warning' as const,
      category: 'product' as const,
      target: 'admin' as const,
      status: 'sent' as const,
      sent_at: new Date(Date.now() - 7200000).toISOString(),
      created_at: new Date(Date.now() - 10800000).toISOString(),
      updated_at: new Date(Date.now() - 7200000).toISOString()
    },
    {
      id: 'notif-3',
      title: 'Welcome to ómorfo!',
      message: 'Thank you for joining our community. Enjoy your shopping experience!',
      type: 'success' as const,
      category: 'customer' as const,
      target: 'customers' as const,
      status: 'scheduled' as const,
      scheduled_at: new Date(Date.now() + 86400000).toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]

  useEffect(() => {
    // Load default notifications
    setNotifications(defaultNotifications)
    setIsLoading(false)
  }, [])

  const handleCreateNotification = () => {
    setSelectedNotification(null)
    setFormData({
      title: '',
      message: '',
      type: 'info',
      category: 'system',
      target: 'all',
      scheduled_at: '',
      recipients: ''
    })
    setIsEditing(true)
    setIsPreviewMode(false)
  }

  const handleEditNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setFormData({
      title: notification.title,
      message: notification.message,
      type: notification.type,
      category: notification.category,
      target: notification.target,
      scheduled_at: notification.scheduled_at || '',
      recipients: notification.recipients?.join(', ') || ''
    })
    setIsEditing(true)
    setIsPreviewMode(false)
  }

  const handleSaveNotification = () => {
    if (!formData.title || !formData.message) {
      toast.error('Please fill in all required fields')
      return
    }

    const newNotification: Notification = {
      id: selectedNotification?.id || `notif-${Date.now()}`,
      title: formData.title,
      message: formData.message,
      type: formData.type,
      category: formData.category,
      target: formData.target,
      status: formData.scheduled_at ? 'scheduled' : 'draft',
      scheduled_at: formData.scheduled_at || undefined,
      recipients: formData.recipients ? formData.recipients.split(',').map(r => r.trim()) : undefined,
      created_at: selectedNotification?.created_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    if (selectedNotification) {
      setNotifications(notifications.map(n => n.id === selectedNotification.id ? newNotification : n))
      toast.success('Notification updated successfully')
    } else {
      setNotifications([...notifications, newNotification])
      toast.success('Notification created successfully')
    }

    setIsEditing(false)
    setSelectedNotification(null)
  }

  const handleDeleteNotification = (notificationId: string) => {
    if (confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== notificationId))
      toast.success('Notification deleted successfully')
    }
  }

  const handleSendNotification = async (notification: Notification) => {
    try {
      // Simulate sending notification
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const updatedNotification = {
        ...notification,
        status: 'sent' as const,
        sent_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      
      setNotifications(notifications.map(n => n.id === notification.id ? updatedNotification : n))
      toast.success('Notification sent successfully')
    } catch (error) {
      console.error('Send notification error:', error)
      toast.error('Failed to send notification')
    }
  }

  const handlePreviewNotification = (notification: Notification) => {
    setSelectedNotification(notification)
    setIsPreviewMode(true)
    setIsEditing(false)
  }

  const getNotificationIcon = (type: Notification['type']) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    return notificationType?.icon || <Bell className="w-4 h-4" />
  }

  const getNotificationTypeColor = (type: Notification['type']) => {
    const notificationType = notificationTypes.find(t => t.value === type)
    return notificationType?.color || 'text-gray-600'
  }

  const getNotificationCategoryIcon = (category: Notification['category']) => {
    const notificationCategory = notificationCategories.find(c => c.value === category)
    return notificationCategory?.icon || <Bell className="w-4 h-4" />
  }

  const getStatusColor = (status: Notification['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'scheduled':
        return 'bg-blue-100 text-blue-800'
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true
    return notification.status === filter
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE')
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container-custom">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Notification Center</h1>
                <p className="text-gray-600">Manage and send notifications to customers and admins</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button onClick={handleCreateNotification}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Notification
                </Button>
                <Link href="/admin">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Notifications List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                  <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All</option>
                    <option value="draft">Draft</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="sent">Sent</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                
                {isLoading ? (
                  <div className="text-center py-8">
                    <LoadingSpinner />
                    <p className="mt-4 text-gray-600">Loading notifications...</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedNotification?.id === notification.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => handlePreviewNotification(notification)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className={`mt-1 ${getNotificationTypeColor(notification.type)}`}>
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="ml-3 flex-1">
                              <h3 className="font-medium text-gray-900 text-sm">{notification.title}</h3>
                              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.message}</p>
                              <div className="flex items-center mt-2 space-x-2">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                                  {notification.status}
                                </span>
                                <span className="text-xs text-gray-400">
                                  {formatDate(notification.created_at)}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEditNotification(notification)
                              }}
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            {notification.status === 'draft' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleSendNotification(notification)
                                }}
                              >
                                <Send className="w-3 h-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleDeleteNotification(notification.id)
                              }}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Notification Editor/Preview */}
            <div className="lg:col-span-2">
              {isEditing ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedNotification ? 'Edit Notification' : 'Create Notification'}
                    </h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveNotification}>
                        <Save className="w-4 h-4 mr-2" />
                        Save Notification
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Title
                      </label>
                      <Input
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Enter notification title"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Notification Type
                      </label>
                      <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as Notification['type'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {notificationTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Notification['category'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {notificationCategories.map((category) => (
                          <option key={category.value} value={category.value}>
                            {category.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Target Audience
                      </label>
                      <select
                        value={formData.target}
                        onChange={(e) => setFormData({ ...formData, target: e.target.value as Notification['target'] })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="all">All Users</option>
                        <option value="customers">Customers Only</option>
                        <option value="admin">Admin Only</option>
                        <option value="specific">Specific Users</option>
                      </select>
                    </div>

                    {formData.target === 'specific' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Recipients (comma-separated emails)
                        </label>
                        <Input
                          value={formData.recipients}
                          onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
                          placeholder="email1@example.com, email2@example.com"
                        />
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Enter notification message"
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Schedule (optional)
                      </label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduled_at}
                        onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ) : isPreviewMode && selectedNotification ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Notification Preview</h2>
                    <div className="flex space-x-2">
                      <Button variant="outline" onClick={() => setIsPreviewMode(false)}>
                        Close Preview
                      </Button>
                      <Button onClick={() => handleEditNotification(selectedNotification)}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Notification
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">Notification Details</h3>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <div className={`mr-2 ${getNotificationTypeColor(selectedNotification.type)}`}>
                            {getNotificationIcon(selectedNotification.type)}
                          </div>
                          <h4 className="font-medium">{selectedNotification.title}</h4>
                        </div>
                        <p className="text-gray-600 mb-2">{selectedNotification.message}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Type: {selectedNotification.type}</span>
                          <span>Category: {selectedNotification.category}</span>
                          <span>Target: {selectedNotification.target}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedNotification.status)}`}>
                            {selectedNotification.status}
                          </span>
                        </div>
                        {selectedNotification.scheduled_at && (
                          <p className="text-sm text-gray-500 mt-2">
                            Scheduled for: {formatDate(selectedNotification.scheduled_at)}
                          </p>
                        )}
                        {selectedNotification.sent_at && (
                          <p className="text-sm text-gray-500 mt-2">
                            Sent at: {formatDate(selectedNotification.sent_at)}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="text-center py-12">
                    <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Notification</h3>
                    <p className="text-gray-600 mb-4">
                      Choose a notification from the list to preview or edit it
                    </p>
                    <Button onClick={handleCreateNotification}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Notification
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
