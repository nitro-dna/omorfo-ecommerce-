import { Suspense } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Eye, 
  Lock, 
  Users, 
  Database, 
  Mail,
  Calendar,
  CheckCircle
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We respect your privacy and are committed to protecting your personal data. 
              This policy explains how we collect, use, and safeguard your information.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>Data Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-accent-500" />
                <span>Secure Storage</span>
              </div>
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-accent-500" />
                <span>Transparency</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Information We Collect */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Information We Collect
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Personal Information</h3>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Name and contact details</li>
                      <li>• Billing and shipping addresses</li>
                      <li>• Payment information</li>
                      <li>• Email address</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Database className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Usage Information</h3>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Website usage and preferences</li>
                      <li>• Order history</li>
                      <li>• Product reviews and ratings</li>
                      <li>• Communication preferences</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How We Use Your Information */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              How We Use Your Information
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Order Processing</h3>
                    <p className="text-primary-600 text-sm">
                      To process and fulfill your orders, send order confirmations, and provide customer support.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Communication</h3>
                    <p className="text-primary-600 text-sm">
                      To send you important updates about your orders, respond to inquiries, and provide customer service.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Marketing</h3>
                    <p className="text-primary-600 text-sm">
                      To send you promotional offers and updates about new products (only with your consent).
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Improvement</h3>
                    <p className="text-primary-600 text-sm">
                      To improve our website, products, and services based on your feedback and usage patterns.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Data Protection & Security
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="font-semibold text-primary-800 mb-2">Encryption</h3>
                <p className="text-primary-600 text-sm">
                  All data is encrypted using industry-standard SSL/TLS protocols
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="font-semibold text-primary-800 mb-2">Secure Storage</h3>
                <p className="text-primary-600 text-sm">
                  Data is stored in secure, monitored facilities with restricted access
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Eye className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="font-semibold text-primary-800 mb-2">Access Control</h3>
                <p className="text-primary-600 text-sm">
                  Strict access controls ensure only authorized personnel can access your data
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Your Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Access & Control</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• Access your personal data</li>
                  <li>• Correct inaccurate information</li>
                  <li>• Request deletion of your data</li>
                  <li>• Object to data processing</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Communication</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• Opt-out of marketing emails</li>
                  <li>• Update communication preferences</li>
                  <li>• Request data portability</li>
                  <li>• Withdraw consent at any time</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Retention */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Data Retention
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-primary-800">Retention Period</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    We retain your personal data only for as long as necessary to fulfill the purposes 
                    outlined in this policy, typically 3-7 years for business records.
                  </p>
                </div>

                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-primary-800">Secure Deletion</h3>
                  </div>
                  <p className="text-primary-600 text-sm">
                    When data is no longer needed, it is securely deleted or anonymized to prevent 
                    unauthorized access or reconstruction.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Questions About Privacy?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about this privacy policy or how we handle your data, 
            please don't hesitate to contact us.
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
              Contact Page
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
