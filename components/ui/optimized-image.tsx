'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  priority?: boolean
  sizes?: string
  quality?: number
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
  fill?: boolean
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
  objectPosition?: string
  onLoad?: () => void
  onError?: () => void
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  fill = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)

  // Handle image loading states
  const handleLoad = () => {
    setIsLoading(false)
    onLoad?.()
  }

  const handleError = () => {
    setIsLoading(false)
    setHasError(true)
    onError?.()
  }

  // Update image source when src prop changes
  useEffect(() => {
    setImageSrc(src)
    setIsLoading(true)
    setHasError(false)
  }, [src])

  // Generate optimized image URL with WebP support
  const getOptimizedSrc = (originalSrc: string) => {
    // If it's already a Cloudinary URL, return as is
    if (originalSrc.includes('cloudinary.com')) {
      return originalSrc
    }

    // If it's a local image, use Next.js Image optimization
    if (originalSrc.startsWith('/')) {
      return originalSrc
    }

    // For external images, return as is (they should be optimized by the source)
    return originalSrc
  }

  // Fallback image for errors
  const fallbackSrc = '/images/placeholder.jpg'

  if (hasError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2 flex items-center justify-center">
            <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">Image not available</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      )}

      {/* Optimized Image */}
      <Image
        src={getOptimizedSrc(imageSrc)}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          objectFit,
          objectPosition
        }}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder={placeholder}
        blurDataURL={blurDataURL}
        fill={fill}
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}

// Specialized image components for different use cases

// Product Image Component
export function ProductImage({
  src,
  alt,
  className = '',
  priority = false
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={400}
      height={600}
      className={`aspect-[3/4] rounded-lg ${className}`}
      priority={priority}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      quality={90}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}

// Hero Image Component
export function HeroImage({
  src,
  alt,
  className = ''
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fill
      className={`w-full h-full ${className}`}
      priority={true}
      sizes="100vw"
      quality={95}
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
    />
  )
}

// Thumbnail Image Component
export function ThumbnailImage({
  src,
  alt,
  className = ''
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={100}
      height={100}
      className={`rounded-md ${className}`}
      sizes="100px"
      quality={75}
    />
  )
}

// Avatar Image Component
export function AvatarImage({
  src,
  alt,
  size = 'md',
  className = ''
}: {
  src: string
  alt: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const pixelSizes = {
    sm: 32,
    md: 40,
    lg: 48,
    xl: 64
  }

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      width={pixelSizes[size]}
      height={pixelSizes[size]}
      className={`rounded-full ${sizeClasses[size]} ${className}`}
      sizes={`${pixelSizes[size]}px`}
      quality={80}
    />
  )
}

// Background Image Component
export function BackgroundImage({
  src,
  alt,
  className = ''
}: {
  src: string
  alt: string
  className?: string
}) {
  return (
    <div className={`relative ${className}`}>
      <OptimizedImage
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes="100vw"
        quality={85}
        priority={true}
      />
    </div>
  )
}
