import { Suspense } from 'react'
import { HeroSection } from '@/components/home/hero-section'
import { FeaturedProducts } from '@/components/home/featured-products'
import { AboutSection } from '@/components/home/about-section'
import { NewsletterSection } from '@/components/home/newsletter-section'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-4">
              Featured Posters
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Discover our most popular and trending poster designs, carefully curated for your space.
            </p>
          </div>
          <Suspense fallback={<LoadingSpinner />}>
            <FeaturedProducts />
          </Suspense>
        </div>
      </section>



      {/* About Section */}
      <AboutSection />

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  )
}

