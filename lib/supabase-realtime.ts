import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'
import { useSession } from 'next-auth/react'

// Real-time event types
export type RealtimeEvent = {
  type: 'INSERT' | 'UPDATE' | 'DELETE'
  table: string
  record: any
  old_record?: any
}

// Real-time subscription options
export interface RealtimeOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  schema?: string
}

// Hook for real-time subscriptions
export function useRealtimeSubscription<T = any>(
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

        // Setup real-time subscription
        channel = supabase
          .channel(`${options.table}_changes`)
          .on(
            'postgres_changes',
            {
              event: options.event || '*',
              schema: options.schema || 'public',
              table: options.table,
              filter: options.filter
            },
            handleRealtimeUpdate
          )
          .subscribe((status) => {
            setIsConnected(status === 'SUBSCRIBED')
            if (status === 'CHANNEL_ERROR') {
              setError('Failed to connect to real-time updates')
            }
          })

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
    }

    getUserCart()
  }, [session?.user?.email])

  return { cartUpdates, isConnected }
}

// Real-time stock updates
export function useRealtimeStock(productId?: string) {
  const [stockUpdates, setStockUpdates] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!productId) return

    const channel = supabase
      .channel('stock_updates')
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
          setStockUpdates(prev => [...prev, payload])
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId])

  return { stockUpdates, isConnected }
}

// Real-time reviews
export function useRealtimeReviews(productId?: string) {
  const [reviewUpdates, setReviewUpdates] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!productId) return

    const channel = supabase
      .channel('review_updates')
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
          setReviewUpdates(prev => [...prev, payload])
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [productId])

  return { reviewUpdates, isConnected }
}

// Real-time order status
export function useRealtimeOrderStatus(orderId?: string) {
  const [orderUpdates, setOrderUpdates] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!orderId) return

    const channel = supabase
      .channel('order_status_updates')
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
          setOrderUpdates(prev => [...prev, payload])
        }
      )
      .subscribe((status) => {
        setIsConnected(status === 'SUBSCRIBED')
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [orderId])

  return { orderUpdates, isConnected }
}

// Real-time wishlist updates
export function useRealtimeWishlist() {
  const { data: session } = useSession()
  
  const [wishlistUpdates, setWishlistUpdates] = useState<any[]>([])
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    if (!session?.user?.email) return

    const getUserWishlist = async () => {
      const { data: user } = await supabase
        .from('users')
        .select('id')
        .eq('email', session.user.email)
        .single()

      if (!user) return

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
            setWishlistUpdates(prev => [...prev, payload])
          }
        )
        .subscribe((status) => {
          setIsConnected(status === 'SUBSCRIBED')
        })

      return () => {
        supabase.removeChannel(channel)
      }
    }

    getUserWishlist()
  }, [session?.user?.email])

  return { wishlistUpdates, isConnected }
}

// Utility function to broadcast updates to other clients
export async function broadcastUpdate(
  channel: string,
  event: string,
  payload: any
) {
  try {
    await supabase.channel(channel).send({
      type: 'broadcast',
      event,
      payload
    })
  } catch (error) {
    console.error('Failed to broadcast update:', error)
  }
}

// Utility function to listen for broadcast updates
export function useBroadcastListener(
  channel: string,
  event: string,
  callback: (payload: any) => void
) {
  useEffect(() => {
    const subscription = supabase
      .channel(channel)
      .on('broadcast', { event }, callback)
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [channel, event, callback])
}
