import React, { useState, useEffect } from 'react'

// Performance optimization utilities

// Cache management
export class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, { data: any; timestamp: number; ttl: number }>()

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  set(key: string, data: any, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    })
  }

  get(key: string): any | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.data
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// Lazy loading utilities
export const lazyLoad = {
  // Intersection Observer for lazy loading images
  createImageObserver: (callback: (entries: IntersectionObserverEntry[]) => void) => {
    return new IntersectionObserver(callback, {
      rootMargin: '50px 0px',
      threshold: 0.1
    })
  },

  // Lazy load component
  loadComponent: <T extends React.ComponentType<any>>(
    importFunc: () => Promise<{ default: T }>,
    fallback?: React.ComponentType
  ) => {
    const LazyComponent = React.lazy(importFunc)
    
    return (props: React.ComponentProps<T>) => (
      <React.Suspense fallback={<div>Loading...</div>}>
        <LazyComponent {...props} />
      </React.Suspense>
    )
  },

  // Preload critical resources
  preloadResource: (href: string, as: string = 'fetch') => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    document.head.appendChild(link)
  },

  // Prefetch non-critical resources
  prefetchResource: (href: string) => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  }
}

// Bundle optimization
export const bundleOptimizer = {
  // Dynamic imports for code splitting
  dynamicImport: <T>(importFunc: () => Promise<T>) => {
    return importFunc().catch(err => {
      console.error('Dynamic import failed:', err)
      return null
    })
  },

  // Route-based code splitting
  routeSplit: {
    home: () => import('@/components/home/hero-section'),
    shop: () => import('@/components/products/product-grid'),
    product: () => import('@/components/products/product-detail'),
    cart: () => import('@/components/cart/cart-content'),
    checkout: () => import('@/components/checkout/checkout-form'),
    account: () => import('@/components/account/account-dashboard'),
  },

  // Component-based code splitting
  componentSplit: {
    modal: () => import('@/components/ui/modal'),
    tooltip: () => import('@/components/ui/tooltip'),
    dropdown: () => import('@/components/ui/dropdown'),
    chart: () => import('@/components/ui/chart'),
  }
}

// Memory management
export const memoryManager = {
  // Debounce function calls
  debounce: <T extends (...args: any[]) => any>(
    func: T,
    wait: number
  ): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout
    return (...args: Parameters<T>) => {
      clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  },

  // Throttle function calls
  throttle: <T extends (...args: any[]) => any>(
    func: T,
    limit: number
  ): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  },

  // Cleanup event listeners
  cleanupEventListeners: (element: HTMLElement, event: string, handler: EventListener) => {
    element.removeEventListener(event, handler)
  },

  // Clear intervals and timeouts
  clearTimers: (timers: (NodeJS.Timeout | number)[]) => {
    timers.forEach(timer => {
      if (typeof timer === 'number') {
        clearTimeout(timer)
      } else {
        clearTimeout(timer)
      }
    })
  }
}

// Network optimization
export const networkOptimizer = {
  // Request deduplication
  requestCache: new Map<string, Promise<any>>(),

  deduplicateRequest: <T>(key: string, request: () => Promise<T>): Promise<T> => {
    if (networkOptimizer.requestCache.has(key)) {
      return networkOptimizer.requestCache.get(key)!
    }

    const promise = request()
    networkOptimizer.requestCache.set(key, promise)
    
    promise.finally(() => {
      networkOptimizer.requestCache.delete(key)
    })

    return promise
  },

  // Batch requests
  batchRequests: <T>(requests: (() => Promise<T>)[], batchSize: number = 5): Promise<T[]> => {
    const results: T[] = []
    
    const processBatch = async (startIndex: number): Promise<void> => {
      const batch = requests.slice(startIndex, startIndex + batchSize)
      const batchResults = await Promise.all(batch.map(req => req()))
      results.push(...batchResults)
      
      if (startIndex + batchSize < requests.length) {
        await processBatch(startIndex + batchSize)
      }
    }

    return processBatch(0).then(() => results)
  },

  // Retry failed requests
  retryRequest: async <T>(
    request: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error

    for (let i = 0; i < maxRetries; i++) {
      try {
        return await request()
      } catch (error) {
        lastError = error as Error
        if (i < maxRetries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)))
        }
      }
    }

    throw lastError!
  }
}

// Performance monitoring
export const performanceMonitor = {
  // Measure function execution time
  measure: <T>(name: string, fn: () => T): T => {
    const start = performance.now()
    const result = fn()
    const end = performance.now()
    
    console.log(`${name} took ${end - start}ms`)
    return result
  },

  // Measure async function execution time
  measureAsync: async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const start = performance.now()
    const result = await fn()
    const end = performance.now()
    
    console.log(`${name} took ${end - start}ms`)
    return result
  },

  // Monitor memory usage
  getMemoryUsage: () => {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      return {
        used: memory.usedJSHeapSize,
        total: memory.totalJSHeapSize,
        limit: memory.jsHeapSizeLimit
      }
    }
    return null
  },

  // Monitor Core Web Vitals
  getCoreWebVitals: () => {
    return new Promise((resolve) => {
      if ('web-vital' in window) {
        // This would require the web-vitals library
        resolve(null)
      } else {
        resolve(null)
      }
    })
  }
}

// Image optimization
export const imageOptimizer = {
  // Generate responsive image sizes
  getResponsiveSizes: (baseWidth: number, aspectRatio: number = 1) => {
    return {
      sm: Math.round(baseWidth * 0.5),
      md: Math.round(baseWidth * 0.75),
      lg: baseWidth,
      xl: Math.round(baseWidth * 1.25),
      '2xl': Math.round(baseWidth * 1.5)
    }
  },

  // Generate srcset for responsive images
  generateSrcSet: (baseUrl: string, sizes: number[]) => {
    return sizes
      .map(size => `${baseUrl}?w=${size} ${size}w`)
      .join(', ')
  },

  // Lazy load images with intersection observer
  lazyLoadImages: () => {
    const images = document.querySelectorAll('img[data-src]')
    const imageObserver = lazyLoad.createImageObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement
          img.src = img.dataset.src!
          img.classList.remove('lazy')
          imageObserver.unobserve(img)
        }
      })
    })

    images.forEach(img => imageObserver.observe(img))
  }
}

// Export default cache instance
export const cache = CacheManager.getInstance()

// Performance optimization hooks
export const usePerformance = () => {
  const [metrics, setMetrics] = useState({
    memoryUsage: null,
    loadTime: 0,
    renderTime: 0
  })

  useEffect(() => {
    // Measure page load time
    const loadTime = performance.now()
    setMetrics(prev => ({ ...prev, loadTime }))

    // Monitor memory usage
    const memoryInterval = setInterval(() => {
      const memoryUsage = performanceMonitor.getMemoryUsage()
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }, 5000)

    return () => {
      clearInterval(memoryInterval)
    }
  }, [])

  return metrics
}
