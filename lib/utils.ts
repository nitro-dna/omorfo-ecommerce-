import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateDiscount(originalPrice: number, salePrice: number): number {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100)
}

export function normalizeProduct(product: any) {
  return {
    ...product,
    salePrice: product.salePrice || product.sale_price,
    categoryId: product.categoryId || product.category_id,
    inStock: product.inStock ?? product.in_stock ?? true,
    stockCount: product.stockCount || product.stock_count || 0,
    reviewCount: product.reviewCount || product.review_count || 0,
    createdAt: product.createdAt || product.created_at,
    updatedAt: product.updatedAt || product.updated_at,
  }
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp.slice(-6)}-${random}`
}

export function calculateShippingCost(items: any[], country: string): number {
  // Basic shipping calculation - can be enhanced with real shipping API
  const baseCost = 5.99
  const itemCount = items.reduce((total, item) => total + item.quantity, 0)
  
  if (country === 'US') {
    return baseCost + (itemCount - 1) * 2.99
  } else {
    return baseCost + (itemCount - 1) * 4.99 + 10 // International shipping
  }
}

export function calculateTax(subtotal: number, state: string): number {
  // Basic tax calculation - should be replaced with real tax API
  const taxRates: { [key: string]: number } = {
    'CA': 0.085,
    'NY': 0.08,
    'TX': 0.0625,
    'FL': 0.06,
  }
  
  const rate = taxRates[state] || 0.07
  return subtotal * rate
}

