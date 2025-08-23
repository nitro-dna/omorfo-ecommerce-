import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Award, 
  Heart, 
  Palette, 
  Users, 
  Globe, 
  Shield, 
  Truck, 
  Star,
  Mail,
  Instagram,
  Facebook
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              About ómorfo
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We're passionate about bringing beautiful art into your home. Every poster in our collection 
              is carefully curated to transform your space and reflect your unique style.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-accent-500" />
                <span>Premium Quality</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-accent-500" />
                <span>Made with Love</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-accent-500" />
                <span>Worldwide Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-primary-600 mb-6 leading-relaxed">
                ómorfo was born from a simple belief: that art should be accessible to everyone. 
                What started as a small passion project has grown into a curated collection of 
                stunning posters that bring life to spaces around the world.
              </p>
              <p className="text-lg text-primary-600 mb-6 leading-relaxed">
                Our journey began when we realized that finding high-quality, beautiful posters 
                was harder than it should be. We wanted to create a place where art lovers could 
                discover unique pieces that speak to their soul and transform their homes.
              </p>
              <p className="text-lg text-primary-600 leading-relaxed">
                Today, we work with talented artists and designers to bring you a carefully 
                curated selection of posters that combine beauty, quality, and affordability.
              </p>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop"
                  alt="ómorfo studio"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent-500">500+</div>
                  <div className="text-sm text-primary-600">Unique Designs</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-4">
              Our Mission & Values
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              We're driven by our commitment to quality, creativity, and customer satisfaction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Palette className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Creative Excellence</h3>
              <p className="text-primary-600">
                We believe in the power of creativity to transform spaces and inspire lives. 
                Every design in our collection is chosen for its artistic merit and ability 
                to create meaningful connections.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Premium Quality</h3>
              <p className="text-primary-600">
                We never compromise on quality. Every poster is printed on museum-grade paper 
                with fade-resistant inks, ensuring your art will look beautiful for years to come.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Customer Love</h3>
              <p className="text-primary-600">
                Your satisfaction is our priority. We're here to help you find the perfect 
                piece for your space and ensure you love your purchase from day one.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Global Community</h3>
              <p className="text-primary-600">
                We're building a global community of art lovers. From our artists to our 
                customers, we believe in the power of connection through beautiful design.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Trust & Reliability</h3>
              <p className="text-primary-600">
                We've earned the trust of thousands of customers worldwide through our 
                commitment to quality, transparency, and exceptional service.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mb-6">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Fast & Reliable</h3>
              <p className="text-primary-600">
                We understand you want your art quickly and safely. That's why we offer 
                fast, reliable shipping with careful packaging to protect your investment.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-500 mb-2">10,000+</div>
              <div className="text-primary-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-500 mb-2">500+</div>
              <div className="text-primary-600">Unique Designs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-500 mb-2">50+</div>
              <div className="text-primary-600">Countries Served</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-accent-500 mb-2">4.9★</div>
              <div className="text-primary-600">Average Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-4">
              Meet Our Team
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              We're a small but passionate team dedicated to bringing beautiful art into your home.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200 text-center">
              <div className="w-24 h-24 bg-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Users className="w-12 h-12 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Creative Team</h3>
              <p className="text-primary-600 mb-4">Our talented designers and artists</p>
              <p className="text-sm text-primary-500">
                Dedicated to creating stunning designs that inspire and delight.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200 text-center">
              <div className="w-24 h-24 bg-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Heart className="w-12 h-12 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Customer Care</h3>
              <p className="text-primary-600 mb-4">Our friendly support team</p>
              <p className="text-sm text-primary-500">
                Always here to help you find the perfect piece for your space.
              </p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200 text-center">
              <div className="w-24 h-24 bg-accent-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                <Truck className="w-12 h-12 text-accent-500" />
              </div>
              <h3 className="text-xl font-semibold text-primary-800 mb-2">Logistics Team</h3>
              <p className="text-primary-600 mb-4">Our shipping experts</p>
              <p className="text-sm text-primary-500">
                Ensuring your art arrives safely and on time, every time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-6">
                Get in Touch
              </h2>
              <p className="text-lg text-primary-600 mb-8 leading-relaxed">
                Have questions about our posters or need help finding the perfect piece? 
                We'd love to hear from you!
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800">Email</h3>
                    <p className="text-primary-600">omorfodesigned@gmail.com</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-primary-800 mb-4">Follow Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                    <Instagram className="w-5 h-5 text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-accent-500 rounded-lg flex items-center justify-center hover:bg-accent-600 transition-colors">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-primary-50 rounded-lg p-8">
              <h3 className="text-2xl font-semibold text-primary-800 mb-6">Send us a Message</h3>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-primary-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-2">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-accent-600 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            Discover our collection of beautiful posters and find the perfect piece for your home.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 bg-white text-accent-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </div>
  )
}
