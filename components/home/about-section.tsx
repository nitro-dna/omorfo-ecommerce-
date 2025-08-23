import Image from 'next/image'
import { CheckCircle, Award, Truck, Shield } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'Premium Quality',
    description: 'All our posters are printed on museum-quality paper with fade-resistant inks for lasting beauty.',
  },
  {
    icon: Truck,
    title: 'Fast Shipping',
    description: 'Free shipping on orders over $50. Most orders ship within 1-2 business days.',
  },
  {
    icon: Shield,
    title: '100% Satisfaction',
    description: 'Not happy with your purchase? We offer a 30-day money-back guarantee.',
  },
  {
    icon: CheckCircle,
    title: 'Custom Sizes',
    description: 'Need a specific size? We offer custom dimensions to fit your exact space requirements.',
  },
]

export function AboutSection() {
  return (
    <section className="py-16 bg-primary-50">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-6">
              Why Choose ómorfo?
            </h2>
            <p className="text-lg text-primary-600 mb-8 leading-relaxed">
              We're passionate about bringing beautiful art into your home. Every poster in our collection 
              is carefully curated and printed with the highest quality materials to ensure it becomes 
              a lasting part of your space with ómorfo.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-accent-500 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-primary-600">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-accent-500">10,000+</div>
                <div className="text-sm text-primary-600">Happy Customers</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-accent-500">500+</div>
                <div className="text-sm text-primary-600">Unique Designs</div>
              </div>
              <div className="text-center sm:text-left">
                <div className="text-2xl font-bold text-accent-500">4.9★</div>
                <div className="text-sm text-primary-600">Average Rating</div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
                alt="ómorfo collection showcase"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Floating Elements */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent-500">98%</div>
                <div className="text-xs text-primary-600">Customer Satisfaction</div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-accent-500 text-white rounded-lg shadow-lg p-4">
              <div className="text-center">
                <div className="text-lg font-bold">Free</div>
                <div className="text-xs">Shipping</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
