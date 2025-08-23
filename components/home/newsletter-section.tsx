import { NewsletterSignup } from '@/components/newsletter/newsletter-signup'

export function NewsletterSection() {
  return (
    <section className="py-16 bg-accent-500">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-accent-100 mb-8 leading-relaxed">
            Be the first to know about new collections, exclusive offers, and design inspiration. 
            Join our newsletter and get 10% off your first order.
          </p>
          
          <NewsletterSignup variant="light" />
          
          <p className="text-sm text-accent-200 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </section>
  )
}

