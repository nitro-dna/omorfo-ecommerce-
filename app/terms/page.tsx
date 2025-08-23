import { Suspense } from 'react'
import Link from 'next/link'
import { 
  FileText, 
  Shield, 
  Users, 
  CreditCard, 
  Truck, 
  Mail,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              These terms govern your use of ómorfo's website and services. 
              By using our site, you agree to these terms and conditions.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-accent-500" />
                <span>Legal Terms</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>User Rights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent-500" />
                <span>Agreement</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Acceptance of Terms */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Acceptance of Terms
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                By accessing and using ómorfo's website and services, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p className="text-primary-600 leading-relaxed">
                These terms apply to all visitors, users, and others who access or use the service. 
                By using our service, you agree to be bound by these terms and all applicable laws and regulations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use License */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Use License
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Permitted Use</h3>
                    <p className="text-primary-600 text-sm">
                      You may use our website for personal, non-commercial purposes to browse and purchase products.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Prohibited Use</h3>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Copying or reproducing website content</li>
                      <li>• Using for commercial purposes without permission</li>
                      <li>• Attempting to gain unauthorized access</li>
                      <li>• Interfering with website functionality</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Information */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Product Information & Orders
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FileText className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Product Descriptions</h3>
                    <p className="text-primary-600 text-sm">
                      We strive to provide accurate product descriptions and images. 
                      However, we do not warrant that descriptions are accurate or complete.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Order Acceptance</h3>
                    <p className="text-primary-600 text-sm">
                      All orders are subject to acceptance and availability. 
                      We reserve the right to refuse any order for any reason.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Shipping & Delivery</h3>
                    <p className="text-primary-600 text-sm">
                      Delivery times are estimates only. We are not liable for delays 
                      beyond our control, including weather or carrier issues.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Pricing</h3>
                    <p className="text-primary-600 text-sm">
                      Prices are subject to change without notice. 
                      We reserve the right to modify prices at any time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* User Accounts */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              User Accounts & Responsibilities
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Account Security</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• You are responsible for maintaining the confidentiality of your account</li>
                  <li>• You must notify us immediately of any unauthorized use</li>
                  <li>• You are responsible for all activities under your account</li>
                  <li>• We reserve the right to terminate accounts for violations</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">User Conduct</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• Provide accurate and complete information</li>
                  <li>• Use the service only for lawful purposes</li>
                  <li>• Respect intellectual property rights</li>
                  <li>• Do not interfere with other users' experience</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Limitation of Liability */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Limitation of Liability
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">General Limitation</h3>
                  <p className="text-primary-600 text-sm">
                    In no event shall ómorfo be liable for any indirect, incidental, special, 
                    consequential, or punitive damages arising out of or relating to your use of our service.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Maximum Liability</h3>
                  <p className="text-primary-600 text-sm">
                    Our total liability to you for any claims shall not exceed the amount 
                    you paid for the specific product or service giving rise to the claim.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Force Majeure</h3>
                  <p className="text-primary-600 text-sm">
                    We are not liable for any failure to perform due to circumstances beyond our control, 
                    including natural disasters, government actions, or technical failures.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Changes to Terms */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Changes to Terms
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting on our website. Your continued use of the service after 
                changes constitutes acceptance of the new terms.
              </p>
              <p className="text-primary-600 leading-relaxed">
                We will notify users of significant changes via email or website notice. 
                It is your responsibility to review these terms periodically for updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Questions About These Terms?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about these terms of service, 
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
