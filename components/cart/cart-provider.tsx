'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'

export interface CartItem {
  id: string
  productId: string
  name: string
  price: number
  image: string
  quantity: number
  size: string
  frame: string
  product?: any
}

interface CartState {
  items: CartItem[]
  itemCount: number
  total: number
  isLoading: boolean
}

type CartAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_CART'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; payload: { id: string; quantity: number } }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'CLEAR_CART' }
  | { type: 'SYNC_FROM_DATABASE'; payload: any[] }
  | { type: 'MERGE_CARTS'; payload: any[] }

const initialState: CartState = {
  items: [],
  itemCount: 0,
  total: 0,
  isLoading: false,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    
    case 'SET_CART':
      return {
        ...state,
        items: action.payload,
        itemCount: action.payload.reduce((sum, item) => sum + item.quantity, 0),
        total: action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    
    case 'ADD_ITEM':
      const existingItem = state.items.find(item => 
        item.productId === action.payload.productId && 
        item.size === action.payload.size && 
        item.frame === action.payload.frame
      )
      
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        )
        return {
          ...state,
          items: updatedItems,
          itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
          total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }
      } else {
        const newItems = [...state.items, action.payload]
        return {
          ...state,
          items: newItems,
          itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0),
          total: newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        }
      }
    
    case 'UPDATE_ITEM':
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      )
      return {
        ...state,
        items: updatedItems,
        itemCount: updatedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    
    case 'REMOVE_ITEM':
      const filteredItems = state.items.filter(item => item.id !== action.payload)
      return {
        ...state,
        items: filteredItems,
        itemCount: filteredItems.reduce((sum, item) => sum + item.quantity, 0),
        total: filteredItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
        itemCount: 0,
        total: 0,
      }
    
    case 'SYNC_FROM_DATABASE':
      const dbItems = action.payload.map(item => ({
        id: item.id,
        productId: item.productId || item.product_id,
        name: item.product?.name || 'Unknown Product',
        price: item.price,
        image: item.product?.images?.[0] || '',
        quantity: item.quantity,
        size: item.size,
        frame: item.frame,
        product: item.product,
      }))
      return {
        ...state,
        items: dbItems,
        itemCount: dbItems.reduce((sum, item) => sum + item.quantity, 0),
        total: dbItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    
    case 'MERGE_CARTS':
      const mergedItems = [...state.items]
      
      action.payload.forEach(dbItem => {
        const existingItem = mergedItems.find(item => 
          item.productId === (dbItem.productId || dbItem.product_id) && 
          item.size === dbItem.size && 
          item.frame === dbItem.frame
        )
        
        if (existingItem) {
          // Update existing item with database data
          existingItem.id = dbItem.id
          existingItem.quantity = Math.max(existingItem.quantity, dbItem.quantity) // Use max quantity to avoid duplicates
        } else {
          // Add new item from database
          mergedItems.push({
            id: dbItem.id,
            productId: dbItem.productId || dbItem.product_id,
            name: dbItem.product?.name || 'Unknown Product',
            price: dbItem.price,
            image: dbItem.product?.images?.[0] || '',
            quantity: dbItem.quantity,
            size: dbItem.size,
            frame: dbItem.frame,
            product: dbItem.product,
          })
        }
      })
      
      return {
        ...state,
        items: mergedItems,
        itemCount: mergedItems.reduce((sum, item) => sum + item.quantity, 0),
        total: mergedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      }
    
    default:
      return state
  }
}

interface CartContextType {
  state: CartState
  addItem: (item: CartItem) => Promise<void>
  updateItem: (id: string, quantity: number) => Promise<void>
  removeItem: (id: string) => Promise<void>
  clearCart: () => Promise<void>
  syncFromDatabase: () => Promise<void>
  mergeWithDatabase: () => Promise<void>
}

const CartContext = createContext<CartContextType | undefined>(undefined)

// Local storage functions
const saveToLocalStorage = (items: CartItem[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify(items))
  }
}

const loadFromLocalStorage = (): CartItem[] => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('cart')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }
  return []
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { data: session, status } = useSession()

  // Load cart from localStorage on mount (for guests)
  useEffect(() => {
    if (status === 'unauthenticated') {
      const localItems = loadFromLocalStorage()
      if (localItems.length > 0) {
        dispatch({ type: 'SET_CART', payload: localItems })
      }
    }
  }, [status])

  // Handle authentication state changes
  useEffect(() => {
    if (status === 'authenticated' && session) {
      // User just logged in - merge local cart with database
      mergeWithDatabase()
    } else if (status === 'unauthenticated') {
      // User logged out - load from localStorage
      const localItems = loadFromLocalStorage()
      dispatch({ type: 'SET_CART', payload: localItems })
    }
  }, [status]) // Remove session from dependency to prevent infinite loops

  // Save to localStorage whenever cart changes (for guests)
  useEffect(() => {
    if (status === 'unauthenticated' && state.items.length > 0) {
      saveToLocalStorage(state.items)
    }
  }, [state.items, status])

  const syncFromDatabase = async () => {
    if (!session) return

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      const response = await fetch('/api/supabase/cart')
      if (response.ok) {
        const data = await response.json()
        dispatch({ type: 'SYNC_FROM_DATABASE', payload: data.data || [] })
      }
    } catch (error) {
      console.error('Failed to sync cart from database:', error)
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const mergeWithDatabase = async () => {
    if (!session) return

    dispatch({ type: 'SET_LOADING', payload: true })
    
    try {
      // Get current local items
      const localItems = state.items
      
      // Get database items
      const response = await fetch('/api/supabase/cart')
      if (response.ok) {
        const data = await response.json()
        const dbItems = data.data || []
        
        // Only merge if there are local items to merge
        if (localItems.length > 0) {
          // Merge carts
          dispatch({ type: 'MERGE_CARTS', payload: dbItems })
          
          // Upload merged items to database
          for (const item of localItems) {
            await fetch('/api/supabase/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                productId: item.productId,
                quantity: item.quantity,
                size: item.size,
                frame: item.frame,
              }),
            })
          }
          
          // Clear localStorage
          if (typeof window !== 'undefined') {
            localStorage.removeItem('cart')
          }
          
          toast.success('Cart merged successfully!')
        } else {
          // Just sync from database if no local items
          dispatch({ type: 'SYNC_FROM_DATABASE', payload: dbItems })
        }
      }
    } catch (error) {
      console.error('Failed to merge carts:', error)
      toast.error('Failed to merge cart')
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }

  const addItem = async (item: CartItem) => {
    if (session) {
      // Authenticated user - save to database
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const response = await fetch('/api/supabase/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            frame: item.frame,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const dbItem = {
            id: data.data.id,
            productId: data.data.product_id,
            name: data.data.product?.name || item.name,
            price: data.data.price,
            image: data.data.product?.images?.[0] || item.image,
            quantity: data.data.quantity,
            size: data.data.size,
            frame: data.data.frame,
            product: data.data.product,
          }
          dispatch({ type: 'ADD_ITEM', payload: dbItem })
          toast.success('Added to cart!')
        } else {
          const error = await response.json()
          console.error('Add to cart error:', error)
          toast.error(error.error || 'Failed to add to cart')
        }
      } catch (error) {
        console.error('Error adding to cart:', error)
        toast.error('Failed to add to cart')
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - save to localStorage
      dispatch({ type: 'ADD_ITEM', payload: item })
      toast.success('Added to cart!')
    }
  }

  const updateItem = async (id: string, quantity: number) => {
    if (session) {
      // Authenticated user - update database
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const response = await fetch('/api/supabase/cart', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cartItemId: id,
            quantity,
          }),
        })

        if (response.ok) {
          dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } })
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to update cart')
        }
      } catch (error) {
        console.error('Error updating cart:', error)
        toast.error('Failed to update cart')
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - update localStorage
      dispatch({ type: 'UPDATE_ITEM', payload: { id, quantity } })
    }
  }

  const removeItem = async (id: string) => {
    if (session) {
      // Authenticated user - remove from database
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        const response = await fetch(`/api/supabase/cart?cartItemId=${id}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          dispatch({ type: 'REMOVE_ITEM', payload: id })
          toast.success('Removed from cart')
        } else {
          const error = await response.json()
          toast.error(error.error || 'Failed to remove from cart')
        }
      } catch (error) {
        console.error('Error removing from cart:', error)
        toast.error('Failed to remove from cart')
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - remove from localStorage
      dispatch({ type: 'REMOVE_ITEM', payload: id })
      toast.success('Removed from cart')
    }
  }

  const clearCart = async () => {
    if (session) {
      // Authenticated user - clear database
      dispatch({ type: 'SET_LOADING', payload: true })
      
      try {
        for (const item of state.items) {
          await fetch(`/api/supabase/cart?cartItemId=${item.id}`, {
            method: 'DELETE',
          })
        }
        
        dispatch({ type: 'CLEAR_CART' })
        toast.success('Cart cleared')
      } catch (error) {
        console.error('Error clearing cart:', error)
        toast.error('Failed to clear cart')
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false })
      }
    } else {
      // Guest user - clear localStorage
      dispatch({ type: 'CLEAR_CART' })
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart')
      }
      toast.success('Cart cleared')
    }
  }

  return (
    <CartContext.Provider
      value={{
        state,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        syncFromDatabase,
        mergeWithDatabase,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
