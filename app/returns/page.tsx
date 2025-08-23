import { Suspense } from 'react'
import Link from 'next/link'
import { 
  ArrowLeft, 
  Package, 
  Clock, 
  Shield, 
  Mail, 
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function ReturnsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Returns & Refunds
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We want you to love your purchase. If you're not completely satisfied, 
              we're here to help with easy returns and refunds.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-500" />
                <span>Free Returns</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-accent-500" />
                <span>Quick Refunds</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Return Policy */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-display font-semibold text-primary-800 mb-6">
                Our Return Policy
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Clock className="w-4 h-4 text-accent-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 mb-2">30-Day Return Window</h3>
                      <p className="text-primary-600 text-sm">
                        You have 30 days from the date of delivery to return your poster for a full refund or exchange.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Package className="w-4 h-4 text-accent-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 mb-2">Original Condition</h3>
                      <p className="text-primary-600 text-sm">
                        Posters must be returned in their original condition, unused and undamaged, with all original packaging.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 text-accent-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary-800 mb-2">Free Returns</h3>
                      <p className="text-primary-600 text-sm">
                        We cover the cost of return shipping for all returns within the 30-day window.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-display font-semibold text-primary-800 mb-6">
                How to Return
              </h2>
              <div className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      1
                    </div>
                    <h3 className="font-semibold text-primary-800">Contact Us</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    Email us at <a href="mailto:omorfodesigned@gmail.com" className="text-accent-500 hover:underline">omorfodesigned@gmail.com</a> with your order number and reason for return.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      2
                    </div>
                    <h3 className="font-semibold text-primary-800">Get Return Label</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    We'll send you a prepaid return shipping label within 24 hours.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      3
                    </div>
                    <h3 className="font-semibold text-primary-800">Ship Back</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    Package your poster securely and drop it off at any post office or shipping location.
                  </p>
                </div>

                <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      4
                    </div>
                    <h3 className="font-semibold text-primary-800">Get Refund</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    Once we receive your return, we'll process your refund within 3-5 business days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Exceptions */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Return Exceptions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Custom Orders</h3>
                    <p className="text-primary-600 text-sm">
                      Custom-sized posters and personalized designs are non-refundable unless damaged in transit.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Damaged Items</h3>
                    <p className="text-primary-600 text-sm">
                      Items damaged by customer use or improper handling are not eligible for returns.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Sale Items</h3>
                    <p className="text-primary-600 text-sm">
                      Final sale items marked as "non-refundable" cannot be returned.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">International Orders</h3>
                    <p className="text-primary-600 text-sm">
                      International returns may be subject to additional shipping costs and customs fees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Refund Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Refund Information
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Processing Time</h3>
                  <p className="text-primary-600 text-sm">
                    3-5 business days after we receive your return
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Refund Amount</h3>
                  <p className="text-primary-600 text-sm">
                    Full refund of the original purchase price
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info className="w-8 h-8 text-accent-500" />
                  </div>
                  <h3 className="font-semibold text-primary-800 mb-2">Payment Method</h3>
                  <p className="text-primary-600 text-sm">
                    Refunded to your original payment method
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Need Help with Your Return?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you with any questions about returns or refunds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:omorfodesigned@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-white text-accent-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-accent-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
