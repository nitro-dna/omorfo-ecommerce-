import { Suspense } from 'react'
import Link from 'next/link'
import { 
  Cookie, 
  Settings, 
  Shield, 
  Eye, 
  Database, 
  Mail,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We use cookies to enhance your browsing experience and provide personalized content. 
              Learn more about how we use cookies and how you can manage them.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <Cookie className="w-5 h-5 text-accent-500" />
                <span>Cookie Management</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>Privacy Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-accent-500" />
                <span>User Control</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              What Are Cookies?
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                Cookies are small text files that are stored on your device when you visit our website. 
                They help us remember your preferences, analyze website traffic, and provide a better 
                user experience.
              </p>
              <p className="text-primary-600 leading-relaxed">
                Cookies can be either "session cookies" (temporary and deleted when you close your browser) 
                or "persistent cookies" (stored on your device for a longer period).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Types of Cookies */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Types of Cookies We Use
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Essential Cookies</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      These cookies are necessary for the website to function properly.
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Shopping cart functionality</li>
                      <li>• User authentication</li>
                      <li>• Security features</li>
                      <li>• Basic website operations</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Functional Cookies</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      These cookies remember your preferences and enhance your experience.
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Language preferences</li>
                      <li>• Currency settings</li>
                      <li>• User interface customization</li>
                      <li>• Form auto-fill</li>
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
                    <h3 className="font-semibold text-primary-800 mb-2">Analytics Cookies</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      These cookies help us understand how visitors use our website.
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Website traffic analysis</li>
                      <li>• User behavior tracking</li>
                      <li>• Performance monitoring</li>
                      <li>• Content optimization</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Marketing Cookies</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      These cookies are used for advertising and marketing purposes.
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Personalized advertisements</li>
                      <li>• Social media integration</li>
                      <li>• Remarketing campaigns</li>
                      <li>• Campaign effectiveness</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Third-Party Cookies
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                We may use third-party services that place cookies on your device. These services help us 
                provide better functionality and analyze website performance.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-3">Analytics Services</h3>
                  <ul className="text-primary-600 text-sm space-y-2">
                    <li>• Google Analytics</li>
                    <li>• Facebook Pixel</li>
                    <li>• Hotjar</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-primary-800 mb-3">Payment Services</h3>
                  <ul className="text-primary-600 text-sm space-y-2">
                    <li>• Stripe</li>
                    <li>• PayPal</li>
                    <li>• Apple Pay</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Managing Your Cookies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Settings className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Browser Settings</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      You can control cookies through your browser settings:
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Chrome: Settings &gt; Privacy &gt; Cookies</li>
                      <li>• Firefox: Options &gt; Privacy &gt; Cookies</li>
                      <li>• Safari: Preferences &gt; Privacy</li>
                      <li>• Edge: Settings &gt; Cookies</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Shield className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Cookie Consent</h3>
                    <p className="text-primary-600 text-sm mb-3">
                      When you first visit our website, you'll see a cookie consent banner:
                    </p>
                    <ul className="text-primary-600 text-sm space-y-1">
                      <li>• Accept all cookies</li>
                      <li>• Accept essential only</li>
                      <li>• Customize preferences</li>
                      <li>• Learn more about cookies</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact of Disabling Cookies */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Impact of Disabling Cookies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Essential Cookies</h3>
                    <p className="text-primary-600 text-sm">
                      Disabling essential cookies may prevent the website from functioning properly, 
                      including shopping cart and login features.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Info className="w-4 h-4 text-yellow-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Optional Cookies</h3>
                    <p className="text-primary-600 text-sm">
                      Disabling optional cookies may reduce personalization and limit some features, 
                      but won't affect core functionality.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Updates to Policy */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Updates to This Policy
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                We may update this cookie policy from time to time to reflect changes in our practices 
                or for other operational, legal, or regulatory reasons.
              </p>
              <p className="text-primary-600 leading-relaxed">
                We will notify you of any material changes by posting the updated policy on our website 
                and updating the "Last Updated" date at the bottom of this page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-accent-500">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Questions About Cookies?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about our use of cookies or this cookie policy, 
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
