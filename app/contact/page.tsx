'use client'

import { Suspense, useState } from 'react'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Twitter,
  HelpCircle,
  Truck,
  CreditCard,
  Shield,
  ArrowRight,
  CheckCircle,
  Heart
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    newsletter: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        setSubmitMessage(data.message)
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          newsletter: false
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch (error) {
      setSubmitStatus('error')
      setSubmitMessage('Network error. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We're here to help! Whether you have questions about our posters, need assistance 
              with your order, or just want to say hello, we'd love to hear from you.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5 text-accent-500" />
                <span>24/7 Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-accent-500" />
                <span>Quick Response</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-accent-500" />
                <span>Friendly Service</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-2xl">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Mail className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">Email Us</h3>
                <p className="text-primary-600 mb-4">omorfodesigned@gmail.com</p>
                <p className="text-sm text-primary-500">We'll respond within 24 hours</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-primary-800 mb-2">Business Hours</h3>
                <p className="text-primary-600 mb-4">Mon-Fri: 9AM-6PM</p>
                <p className="text-sm text-primary-500">Sat: 10AM-4PM</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <h2 className="text-3xl font-display font-semibold text-primary-800 mb-6">
                Send us a Message
              </h2>
              
              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800">{submitMessage}</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800">{submitMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-primary-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="Your first name"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-primary-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                      placeholder="Your last name"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-primary-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-primary-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-primary-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="order">Order Status</option>
                    <option value="product">Product Questions</option>
                    <option value="shipping">Shipping & Delivery</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="technical">Technical Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-primary-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-primary-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                    placeholder="Tell us how we can help you..."
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="newsletter"
                    name="newsletter"
                    checked={formData.newsletter}
                    onChange={handleInputChange}
                    className="mt-1 w-4 h-4 text-accent-500 border-primary-300 rounded focus:ring-accent-500"
                  />
                  <label htmlFor="newsletter" className="text-sm text-primary-600">
                    I'd like to receive updates about new products and special offers
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent-500 text-white font-semibold py-4 px-6 rounded-lg hover:bg-accent-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner className="w-5 h-5" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <h3 className="text-xl font-semibold text-primary-800 mb-4">Follow Us</h3>
              <p className="text-primary-600 mb-6">
                Stay updated with our latest designs, behind-the-scenes content, and special offers.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/omorfodesigned/" target="_blank" rel="noopener noreferrer" className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-4 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2">
                  <Instagram className="w-5 h-5" />
                  <span>Instagram</span>
                </a>
                <a href="#" className="flex-1 bg-blue-400 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-500 transition-colors flex items-center justify-center space-x-2">
                  <Twitter className="w-5 h-5" />
                  <span>Twitter</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-primary-800 mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-primary-600 max-w-2xl mx-auto">
              Find quick answers to common questions about our products and services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">How long does shipping take?</h3>
                  <p className="text-primary-600 text-sm">
                    Standard shipping takes 3-5 business days. Express shipping (1-2 days) is available for an additional fee.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="w-4 h-4 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Do you ship internationally?</h3>
                  <p className="text-primary-600 text-sm">
                    Yes! We ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-4 h-4 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">What payment methods do you accept?</h3>
                  <p className="text-primary-600 text-sm">
                    We accept all major credit cards, PayPal, Apple Pay, and Google Pay. All payments are secure and encrypted.
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
                  <h3 className="font-semibold text-primary-800 mb-2">What's your return policy?</h3>
                  <p className="text-primary-600 text-sm">
                    We offer a 30-day return policy. If you're not satisfied, return your poster for a full refund or exchange.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-4 h-4 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Can I customize poster sizes?</h3>
                  <p className="text-primary-600 text-sm">
                    Yes! Most posters are available in multiple sizes. If you need a custom size, contact us for a quote.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-4 h-4 text-accent-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">How can I track my order?</h3>
                  <p className="text-primary-600 text-sm">
                    You'll receive a tracking number via email once your order ships. You can also track it in your account.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Still Have Questions?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            Our customer support team is here to help you find the perfect poster for your space.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:omorfodesigned@gmail.com"
              className="inline-flex items-center px-8 py-4 bg-white text-accent-500 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Mail className="w-5 h-5 mr-2" />
              Email Us
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
