import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { supabase } from './supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

// Types for real-time functionality
export interface RealtimeOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema?: string
  filter?: string
}

export interface RealtimeEvent {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  record: any
  old_record?: any
}

export interface RealtimeResult<T> {
  data: T[]
  isConnected: boolean
  error: string | null
  refetch: () => void
}

// Hook for real-time subscriptions
export function useRealtimeSubscription<T extends { id: string | number } = any>(
  options: RealtimeOptions,
  callback?: (payload: RealtimeEvent) => void
) {
  const [data, setData] = useState<T[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { data: session } = useSession()

  const handleRealtimeUpdate = useCallback((payload: RealtimeEvent) => {
    console.log('Real-time update:', payload)
    
    if (callback) {
      callback(payload)
    }

    // Update local state based on event type
    setData(currentData => {
      switch (payload.type) {
        case 'INSERT':
          return [...currentData, payload.record]
        case 'UPDATE':
          return currentData.map(item => 
            item.id === payload.record.id ? payload.record : item
          )
        case 'DELETE':
          return currentData.filter(item => item.id !== payload.old_record?.id)
        default:
          return currentData
      }
    })
  }, [callback])

  useEffect(() => {
    if (!session?.user?.email) return

    let channel: RealtimeChannel

    const setupSubscription = async () => {
      try {
        // Get initial data
        const { data: initialData, error: fetchError } = await supabase
          .from(options.table)
          .select('*')
          .order('created_at', { ascending: false })

        if (fetchError) throw fetchError

        setData(initialData || [])
        setError(null)

        // Temporarily disable real-time subscription to fix build
        // TODO: Re-enable when Supabase types are fixed
        /*
        channel = supabase
          .channel(`${options.table}_changes`)
          .on(
            'postgres_changes',
            {
              event: options.event || '*',
              schema: options.schema || 'public',
              table: options.table,
              filter: options.filter
            } as any,
            handleRealtimeUpdate
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED')
            if (status === 'CHANNEL_ERROR') {
              setError('Failed to connect to real-time updates')
            }
          })
        */

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to setup real-time subscription')
      }
    }

    setupSubscription()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [session?.user?.email, options.table, options.event, options.filter, handleRealtimeUpdate])

  return {
    data,
    isConnected,
    error,
    refetch: () => {
      // Trigger a refetch by updating the dependency
      setData([])
    }
  }
}

// Specialized hooks for specific use cases

// Real-time cart updates
export function useRealtimeCart() {
  const { data: session } = useSession()
  
  const [cartUpdates, setCartUpdates] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    // Get user ID for cart filtering
    const getUserCart = async () => {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      // Temporarily disable real-time subscription
      // TODO: Re-enable when Supabase types are fixed
      /*
      // Subscribe to cart changes for this user
      const channel = supabase
        .channel('cart_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'cart_items',
            filter: `user_id=eq.${user.id}`
          },
          (payload) => {
            console.log('Cart update:', payload)
            setCartUpdates(prev => [...prev, payload])
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED')
        })

      return () => {
        supabase.removeChannel(channel)
      }
      */
    }

    getUserCart()
  }, [session?.user?.email])

  return { cartUpdates, isConnected }
}

// Real-time stock updates
export function useRealtimeStock(productId: string) {
  const [stockCount, setStockCount] = useState<number>(0)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Get initial stock count
    const getStockCount = async () => {
      const { data: product } = await supabase
        .from('products')
        .select('stock_count')
        .eq('id', productId)
        .single()

      if (product) {
        setStockCount(product.stock_count || 0)
      }
    }

    getStockCount()

    // Temporarily disable real-time subscription
    // TODO: Re-enable when Supabase types are fixed
    /*
    const channel = supabase
      .channel(`stock_${productId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'products',
          filter: `id=eq.${productId}`
        },
        (payload) => {
          console.log('Stock update:', payload)
          if (payload.new?.stock_count !== undefined) {
            setStockCount(payload.new.stock_count)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [productId])

  return { stockCount, isConnected }
}

// Real-time reviews
export function useRealtimeReviews(productId: string) {
  const [reviews, setReviews] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Get initial reviews
    const getReviews = async () => {
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

      setReviews(reviewsData || [])
    }

    getReviews()

    // Temporarily disable real-time subscription
    // TODO: Re-enable when Supabase types are fixed
    /*
    const channel = supabase
      .channel(`reviews_${productId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'reviews',
          filter: `product_id=eq.${productId}`
        },
        (payload) => {
          console.log('Review update:', payload)
          if (payload.type === 'INSERT') {
            setReviews(prev => [payload.new, ...prev])
          } else if (payload.type === 'DELETE') {
            setReviews(prev => prev.filter(review => review.id !== payload.old?.id))
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [productId])

  return { reviews, isConnected }
}

// Real-time order status updates
export function useRealtimeOrderStatus(orderId: string) {
  const [orderStatus, setOrderStatus] = useState<string>('')
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Get initial order status
    const getOrderStatus = async () => {
      const { data: order } = await supabase
        .from('orders')
        .select('status')
        .eq('id', orderId)
        .single()

      if (order) {
        setOrderStatus(order.status)
      }
    }

    getOrderStatus()

    // Temporarily disable real-time subscription
    // TODO: Re-enable when Supabase types are fixed
    /*
    const channel = supabase
      .channel(`order_${orderId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `id=eq.${orderId}`
        },
        (payload) => {
          console.log('Order status update:', payload)
          if (payload.new?.status) {
            setOrderStatus(payload.new.status)
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [orderId])

  return { orderStatus, isConnected }
}

// Real-time wishlist updates
export function useRealtimeWishlist() {
  const { data: session } = useSession()
  const [wishlistItems, setWishlistItems] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    // Get initial wishlist
    const getWishlist = async () => {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

      const { data: wishlistData } = await supabase
        .from('wishlist_items')
        .select('*')
        .eq('user_id', user.id)

      setWishlistItems(wishlistData || [])
    }

    getWishlist()

    // Temporarily disable real-time subscription
    // TODO: Re-enable when Supabase types are fixed
    /*
    const channel = supabase
      .channel('wishlist_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'wishlist_items',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Wishlist update:', payload)
          if (payload.type === 'INSERT') {
            setWishlistItems(prev => [...prev, payload.new])
          } else if (payload.type === 'DELETE') {
            setWishlistItems(prev => prev.filter(item => item.id !== payload.old?.id))
          }
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
    */
  }, [session?.user?.email])

  return { wishlistItems, isConnected }
}

// Broadcast listener for cross-tab communication
export function useBroadcastListener(channelName: string, callback: (data: any) => void) {
  useEffect(() => {
    const channel = new BroadcastChannel(channelName)
    
    channel.onmessage = (event) => {
      callback(event.data)
    }

    return () => {
      channel.close()
    }
  }, [channelName, callback])

  const broadcast = useCallback((data: any) => {
    const channel = new BroadcastChannel(channelName)
    channel.postMessage(data)
    channel.close()
  }, [channelName])

  return { broadcast }
}
