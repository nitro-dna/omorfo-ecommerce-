'use client'

import { useState, useEffect } from 'react'
import { Package, AlertTriangle, CheckCircle } from 'lucide-react'
import { useRealtimeStock } from '@/lib/supabase-realtime'
import { normalizeProduct } from '@/lib/utils'
import toast from 'react-hot-toast'

interface StockIndicatorProps {
  product: any
  showAlert?: boolean
  className?: string
}

export function StockIndicator({ product, showAlert = true, className = '' }: StockIndicatorProps) {
  const normalizedProduct = normalizeProduct(product)
  const { stockUpdates, isConnected } = useRealtimeStock(product.id)
  const [currentStock, setCurrentStock] = useState(normalizedProduct.stockCount || 0)
  const [isLowStock, setIsLowStock] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  // Update stock when real-time updates come in
  useEffect(() => {
    if (stockUpdates.length > 0) {
      const latestUpdate = stockUpdates[stockUpdates.length - 1]
      if (latestUpdate.new?.stock_count !== undefined) {
        const newStock = latestUpdate.new.stock_count
        const oldStock = latestUpdate.old?.stock_count || currentStock
        
        setCurrentStock(newStock)
        setLastUpdate(new Date())

        // Show alerts for significant stock changes
        if (showAlert) {
          if (newStock === 0 && oldStock > 0) {
            toast.error('This item is now out of stock!', {
              duration: 5000,
              icon: '⚠️'
            })
          } else if (newStock <= 5 && newStock > 0 && oldStock > 5) {
            toast.error(`Only ${newStock} items left in stock!`, {
              duration: 4000,
              icon: '🔥'
            })
          } else if (newStock > 0 && oldStock === 0) {
            toast.success('This item is back in stock!', {
              duration: 4000,
              icon: '✅'
            })
          }
        }
      }
    }
  }, [stockUpdates, showAlert, currentStock])

  // Check if stock is low
  useEffect(() => {
    setIsLowStock(currentStock > 0 && currentStock <= 5)
  }, [currentStock])

  // Get stock status
  const getStockStatus = () => {
    if (currentStock === 0) {
      return {
        status: 'out-of-stock',
        text: 'Out of Stock',
        icon: <AlertTriangle className="w-4 h-4 text-red-500" />,
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    } else if (isLowStock) {
      return {
        status: 'low-stock',
        text: `Only ${currentStock} left`,
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    } else {
      return {
        status: 'in-stock',
        text: 'In Stock',
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    }
  }

  const stockStatus = getStockStatus()

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Stock Status */}
      <div className={`flex items-center space-x-2 px-3 py-1 rounded-full border ${stockStatus.bgColor} ${stockStatus.borderColor}`}>
        {stockStatus.icon}
        <span className={`text-sm font-medium ${stockStatus.color}`}>
          {stockStatus.text}
        </span>
      </div>

      {/* Real-time Connection Indicator */}
      {isConnected && (
        <div className="flex items-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-gray-500">Live</span>
        </div>
      )}

      {/* Last Update Time */}
      {lastUpdate && (
        <span className="text-xs text-gray-400">
          Updated {lastUpdate.toLocaleTimeString()}
        </span>
      )}
    </div>
  )
}

// Enhanced stock indicator for product cards
export function ProductStockIndicator({ product, className = '' }: { product: any, className?: string }) {
  const normalizedProduct = normalizeProduct(product)
  const { stockUpdates, isConnected } = useRealtimeStock(product.id)
  const [currentStock, setCurrentStock] = useState(normalizedProduct.stockCount || 0)

  useEffect(() => {
    if (stockUpdates.length > 0) {
      const latestUpdate = stockUpdates[stockUpdates.length - 1]
      if (latestUpdate.new?.stock_count !== undefined) {
        setCurrentStock(latestUpdate.new.stock_count)
      }
    }
  }, [stockUpdates])

  if (currentStock === 0) {
    return (
      <div className={`absolute top-3 right-3 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded ${className}`}>
        Out of Stock
      </div>
    )
  }

  if (currentStock <= 5) {
    return (
      <div className={`absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-2 py-1 rounded ${className}`}>
        Only {currentStock} left
      </div>
    )
  }

  return null
}

// Stock level indicator for admin/product management
export function StockLevelIndicator({ currentStock, maxStock = 100, className = '' }: {
  currentStock: number
  maxStock?: number
  className?: string
}) {
  const percentage = (currentStock / maxStock) * 100

  const getStockLevelColor = () => {
    if (percentage <= 10) return 'bg-red-500'
    if (percentage <= 25) return 'bg-orange-500'
    if (percentage <= 50) return 'bg-yellow-500'
    return 'bg-green-500'
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${getStockLevelColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className="text-sm text-gray-600 min-w-[3rem]">
        {currentStock}/{maxStock}
      </span>
    </div>
  )
}
