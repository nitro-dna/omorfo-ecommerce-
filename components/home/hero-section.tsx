'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ShoppingBag, Star } from 'lucide-react'

const heroSlides = [
  {
    id: 1,
    title: 'Transform Your Space',
    subtitle: 'Discover stunning posters that bring life to any room',
    description: 'From minimalist designs to bold statements, find the perfect poster to express your style. See how our framed art transforms this beautiful living space.',
    image: '/hero-living-room.jpg',
    cta: 'Shop Now',
    ctaLink: '/shop',
    badge: 'Lifestyle Collection',
  },
  {
    id: 2,
    title: 'Premium Quality Prints',
    subtitle: 'High-resolution artwork on premium materials',
    description: 'Every poster is printed on museum-quality paper with fade-resistant inks for lasting beauty.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=700&fit=crop',
    cta: 'Shop Now',
    ctaLink: '/shop',
    badge: 'Premium Quality',
  },
  {
    id: 3,
    title: 'Custom Sizes Available',
    subtitle: 'Perfect fit for any space',
    description: 'Choose from standard sizes or request custom dimensions to match your exact needs.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=700&fit=crop',
    cta: 'Shop Now',
    ctaLink: '/shop',
    badge: 'Custom Sizes',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      {/* Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="container-custom">
                <div className="max-w-2xl text-white">
                  {/* Badge */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-accent-500 text-white text-sm font-medium mb-6">
                    <Star className="w-4 h-4 mr-2" />
                    {slide.badge}
                  </div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 leading-tight">
                    {slide.title}
                  </h1>

                  {/* Subtitle */}
                  <h2 className="text-xl md:text-2xl font-medium mb-4 text-gray-200">
                    {slide.subtitle}
                  </h2>

                  {/* Description */}
                  <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                    {slide.description}
                  </p>

                  {/* CTA Button */}
                  <Link
                    href={slide.ctaLink}
                    className="inline-flex items-center px-8 py-4 bg-accent-500 text-white font-semibold rounded-lg hover:bg-accent-600 transition-colors duration-200 shadow-lg hover:shadow-xl"
                  >
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors duration-200 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide
                ? 'bg-white'
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
