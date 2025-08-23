'use client'

import React, { useState, useEffect } from 'react'
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  MapPin,
  Calendar,
  Wifi,
  WifiOff
} from 'lucide-react'
import { useRealtimeOrderStatus } from '@/lib/supabase-realtime'
import toast from 'react-hot-toast'

interface LiveOrderStatusProps {
  orderId: string
  initialStatus?: string
  initialTrackingNumber?: string | null
  className?: string
}

interface OrderStatus {
  id: string
  status: string
  tracking_number: string | null
  updated_at: string
  shipping_address: any
  billing_address: any
}

const orderStatusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-50' },
  { key: 'processing', label: 'Processing', icon: Package, color: 'text-blue-600', bgColor: 'bg-blue-50' },
  { key: 'shipped', label: 'Shipped', icon: Truck, color: 'text-purple-600', bgColor: 'bg-purple-50' },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'text-green-600', bgColor: 'bg-green-50' },
  { key: 'cancelled', label: 'Cancelled', icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' }
]

export function LiveOrderStatus({ 
  orderId, 
  initialStatus = 'pending', 
  initialTrackingNumber = null,
  className = '' 
}: LiveOrderStatusProps) {
  const { orderUpdates, isConnected } = useRealtimeOrderStatus(orderId)
  const [currentStatus, setCurrentStatus] = useState(initialStatus)
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)
  const [statusHistory, setStatusHistory] = useState<Array<{status: string, timestamp: Date}>>([])

  // Handle real-time order updates
  useEffect(() => {
    if (orderUpdates.length > 0) {
      const latestUpdate = orderUpdates[orderUpdates.length - 1]
      if (latestUpdate.new) {
        const newStatus = latestUpdate.new.status
        const newTracking = latestUpdate.new.tracking_number
        
        if (newStatus !== currentStatus) {
          setCurrentStatus(newStatus)
          setLastUpdate(new Date())
          setStatusHistory(prev => [...prev, { status: newStatus, timestamp: new Date() }])
          
          // Show status update notification
          const statusStep = orderStatusSteps.find(step => step.key === newStatus)
          if (statusStep) {
            toast.success(`Order status updated: ${statusStep.label}`, {
              duration: 5000,
              icon: '📦'
            })
          }
        }
        
        if (newTracking && newTracking !== trackingNumber) {
          setTrackingNumber(newTracking)
          toast.success('Tracking number updated!', {
            duration: 4000,
            icon: '🚚'
          })
        }
      }
    }
  }, [orderUpdates, currentStatus, trackingNumber])

  const getCurrentStepIndex = () => {
    return orderStatusSteps.findIndex(step => step.key === currentStatus)
  }

  const getStatusIcon = (status: string) => {
    const step = orderStatusSteps.find(s => s.key === status)
    return step ? step.icon : Clock
  }

  const getStatusColor = (status: string) => {
    const step = orderStatusSteps.find(s => s.key === status)
    return step ? step.color : 'text-gray-600'
  }

  const getStatusBgColor = (status: string) => {
    const step = orderStatusSteps.find(s => s.key === status)
    return step ? step.bgColor : 'bg-gray-50'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-primary-800">Order Status</h3>
        
        {/* Connection Status */}
        <div className="flex items-center space-x-2">
          {isConnected ? (
            <>
              <Wifi className="w-4 h-4 text-green-500" />
              <span className="text-xs text-green-600 font-medium">Live Updates</span>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-500">Offline</span>
            </>
          )}
        </div>
      </div>

      {/* Status Timeline */}
      <div className="relative">
        <div className="space-y-4">
          {orderStatusSteps.map((step, index) => {
            const Icon = step.icon
            const isCompleted = index <= currentStepIndex
            const isCurrent = index === currentStepIndex
            const isPending = index > currentStepIndex

            return (
              <div key={step.key} className="flex items-center space-x-4">
                {/* Status Icon */}
                <div className={`relative flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                  isCompleted 
                    ? `${step.bgColor} ${step.color} border-current`
                    : isCurrent
                    ? `${step.bgColor} ${step.color} border-current animate-pulse`
                    : 'bg-gray-100 text-gray-400 border-gray-300'
                }`}>
                  <Icon className="w-5 h-5" />
                  
                  {/* Connection Line */}
                  {index < orderStatusSteps.length - 1 && (
                    <div className={`absolute top-10 left-1/2 transform -translate-x-1/2 w-0.5 h-8 ${
                      isCompleted ? 'bg-current' : 'bg-gray-300'
                    }`}></div>
                  )}
                </div>

                {/* Status Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`font-medium ${
                        isCompleted || isCurrent ? 'text-primary-800' : 'text-gray-500'
                      }`}>
                        {step.label}
                      </p>
                      {isCurrent && (
                        <p className="text-sm text-primary-600 mt-1">
                          Your order is currently being processed
                        </p>
                      )}
                    </div>
                    
                    {/* Status Time */}
                    {isCurrent && lastUpdate && (
                      <span className="text-xs text-gray-500">
                        {formatDate(lastUpdate.toISOString())}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Tracking Information */}
      {trackingNumber && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Truck className="w-4 h-4 text-blue-500" />
            <span className="font-medium text-blue-800">Tracking Information</span>
          </div>
          <p className="text-sm text-blue-700 mb-2">
            Tracking Number: <span className="font-mono font-medium">{trackingNumber}</span>
          </p>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            Track Package →
          </button>
        </div>
      )}

      {/* Status History */}
      {statusHistory.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-primary-800 mb-3">Status History</h4>
          <div className="space-y-2">
            {statusHistory.slice(-5).reverse().map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  {React.createElement(getStatusIcon(entry.status), { 
                    className: `w-3 h-3 ${getStatusColor(entry.status)}` 
                  })}
                  <span className="text-primary-700">
                    {orderStatusSteps.find(s => s.key === entry.status)?.label}
                  </span>
                </div>
                <span className="text-gray-500">
                  {formatDate(entry.timestamp.toISOString())}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estimated Delivery */}
      {currentStatus === 'shipped' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Calendar className="w-4 h-4 text-green-500" />
            <span className="font-medium text-green-800">Estimated Delivery</span>
          </div>
          <p className="text-sm text-green-700">
            Your package is expected to arrive within 3-5 business days
          </p>
        </div>
      )}

      {/* Connection Alert */}
      {!isConnected && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm text-yellow-700">
              Live updates are currently unavailable. Please refresh the page to get the latest status.
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

// Compact order status for order lists
export function CompactOrderStatus({ 
  orderId, 
  status, 
  trackingNumber,
  className = '' 
}: {
  orderId: string
  status: string
  trackingNumber?: string | null
  className?: string
}) {
  const { orderUpdates, isConnected } = useRealtimeOrderStatus(orderId)
  const [currentStatus, setCurrentStatus] = useState(status)
  const [hasUpdates, setHasUpdates] = useState(false)

  useEffect(() => {
    if (orderUpdates.length > 0) {
      const latestUpdate = orderUpdates[orderUpdates.length - 1]
      if (latestUpdate.new?.status !== currentStatus) {
        setCurrentStatus(latestUpdate.new.status)
        setHasUpdates(true)
        
        // Clear update indicator after 5 seconds
        setTimeout(() => setHasUpdates(false), 5000)
      }
    }
  }, [orderUpdates, currentStatus])

  const statusStep = orderStatusSteps.find(step => step.key === currentStatus)
  const Icon = statusStep?.icon || Clock

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className={`flex items-center space-x-2 px-2 py-1 rounded-full text-xs font-medium ${
        statusStep ? `${statusStep.bgColor} ${statusStep.color}` : 'bg-gray-100 text-gray-600'
      }`}>
        <Icon className="w-3 h-3" />
        <span>{statusStep?.label || 'Unknown'}</span>
      </div>
      
      {hasUpdates && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
      )}
      
      {isConnected && (
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
      )}
    </div>
  )
}
