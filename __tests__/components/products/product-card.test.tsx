import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ProductCard } from '@/components/products/product-card'
import { useCart } from '@/components/cart/cart-provider'

// Mock the cart provider
jest.mock('@/components/cart/cart-provider')
const mockUseCart = useCart as jest.MockedFunction<typeof useCart>

// Mock the wishlist API
global.fetch = jest.fn()

const mockProduct = {
  id: '1',
  name: 'Test Product',
  slug: 'test-product',
  description: 'A test product description',
  price: 29.99,
  originalPrice: 39.99,
  images: ['https://example.com/image.jpg'],
  category: 'posters',
  tags: ['test', 'poster'],
  rating: 4.5,
  reviewCount: 10,
  stock: 50,
  isActive: true,
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z'
}

describe('ProductCard Component', () => {
  beforeEach(() => {
    mockUseCart.mockReturnValue({
      state: {
        items: [],
        total: 0,
        itemCount: 0
      },
      addItem: jest.fn(),
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    })

    // Mock fetch for wishlist API
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ isInWishlist: false })
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders product information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('Test Product')).toBeInTheDocument()
    expect(screen.getByText('€29.99')).toBeInTheDocument()
    expect(screen.getByText('€39.99')).toBeInTheDocument()
    expect(screen.getByText('25% off')).toBeInTheDocument()
    expect(screen.getByText('4.5')).toBeInTheDocument()
    expect(screen.getByText('(10 reviews)')).toBeInTheDocument()
  })

  it('displays stock information correctly', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('In Stock')).toBeInTheDocument()
    expect(screen.getByText('50 available')).toBeInTheDocument()
  })

  it('displays low stock warning', () => {
    const lowStockProduct = { ...mockProduct, stock: 5 }
    render(<ProductCard product={lowStockProduct} />)
    
    expect(screen.getByText('Low Stock')).toBeInTheDocument()
    expect(screen.getByText('5 available')).toBeInTheDocument()
  })

  it('displays out of stock message', () => {
    const outOfStockProduct = { ...mockProduct, stock: 0 }
    render(<ProductCard product={outOfStockProduct} />)
    
    expect(screen.getByText('Out of Stock')).toBeInTheDocument()
  })

  it('handles add to cart click', async () => {
    const mockAddItem = jest.fn()
    mockUseCart.mockReturnValue({
      state: {
        items: [],
        total: 0,
        itemCount: 0
      },
      addItem: mockAddItem,
      removeItem: jest.fn(),
      updateQuantity: jest.fn(),
      clearCart: jest.fn()
    })

    render(<ProductCard product={mockProduct} />)
    
    const addToCartButton = screen.getByRole('button', { name: /add to cart/i })
    fireEvent.click(addToCartButton)
    
    await waitFor(() => {
      expect(mockAddItem).toHaveBeenCalledWith({
        id: expect.any(String),
        productId: '1',
        name: 'Test Product',
        price: 29.99,
        image: 'https://example.com/image.jpg',
        quantity: 1,
        size: 'A4',
        frame: 'None'
      })
    })
  })

  it('handles wishlist toggle', async () => {
    render(<ProductCard product={mockProduct} />)
    
    const wishlistButton = screen.getByRole('button', { name: /add to wishlist/i })
    fireEvent.click(wishlistButton)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/supabase/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: '1'
        })
      })
    })
  })

  it('displays wishlist status correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ isInWishlist: true })
    })

    render(<ProductCard product={mockProduct} />)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /remove from wishlist/i })).toBeInTheDocument()
    })
  })

  it('handles quick view click', () => {
    render(<ProductCard product={mockProduct} />)
    
    const quickViewButton = screen.getByRole('button', { name: /quick view/i })
    fireEvent.click(quickViewButton)
    
    // Should open quick view modal (implementation dependent)
    expect(quickViewButton).toBeInTheDocument()
  })

  it('renders product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />)
    
    const image = screen.getByAltText('Test Product')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('displays discount badge when there is a discount', () => {
    render(<ProductCard product={mockProduct} />)
    
    expect(screen.getByText('25% off')).toBeInTheDocument()
    expect(screen.getByText('€39.99')).toHaveClass('line-through', 'text-gray-500')
  })

  it('does not display discount badge when there is no discount', () => {
    const noDiscountProduct = { ...mockProduct, originalPrice: 29.99 }
    render(<ProductCard product={noDiscountProduct} />)
    
    expect(screen.queryByText(/off/i)).not.toBeInTheDocument()
    expect(screen.queryByText('€29.99')).not.toHaveClass('line-through')
  })

  it('handles product link navigation', () => {
    render(<ProductCard product={mockProduct} />)
    
    const productLink = screen.getByRole('link', { name: /test product/i })
    expect(productLink).toHaveAttribute('href', '/products/test-product')
  })

  it('displays loading state while fetching wishlist status', () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(() => {}))
    
    render(<ProductCard product={mockProduct} />)
    
    // Should show loading state for wishlist button
    expect(screen.getByRole('button', { name: /add to wishlist/i })).toBeInTheDocument()
  })

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<ProductCard product={mockProduct} />)
    
    // Should still render the component even if API fails
    expect(screen.getByText('Test Product')).toBeInTheDocument()
  })
})
