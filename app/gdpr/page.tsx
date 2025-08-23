import { Suspense } from 'react'
import Link from 'next/link'
import { 
  Shield, 
  Users, 
  Database, 
  Eye, 
  Download, 
  Mail,
  Calendar,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export default function GDPRPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-primary-800 mb-6">
              GDPR Compliance
            </h1>
            <p className="text-xl text-primary-600 mb-8 leading-relaxed">
              We are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR). 
              Learn about your rights and how we protect your information.
            </p>
            <div className="flex items-center justify-center space-x-8 text-primary-600">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-accent-500" />
                <span>Data Protection</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-accent-500" />
                <span>Your Rights</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-accent-500" />
                <span>Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is GDPR */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              What is GDPR?
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <p className="text-primary-600 mb-6 leading-relaxed">
                The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect 
                on May 25, 2018. It applies to all organizations operating within the EU and those that offer goods or 
                services to individuals in the EU, regardless of where the organization is based.
              </p>
              <p className="text-primary-600 leading-relaxed">
                GDPR gives individuals greater control over their personal data and requires organizations to be more 
                transparent about how they collect, use, and protect personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Your GDPR Rights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Access</h3>
                    <p className="text-primary-600 text-sm">
                      You have the right to request access to your personal data and information about how we process it.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Rectification</h3>
                    <p className="text-primary-600 text-sm">
                      You can request correction of inaccurate or incomplete personal data.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Erasure</h3>
                    <p className="text-primary-600 text-sm">
                      You can request deletion of your personal data in certain circumstances.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Download className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Portability</h3>
                    <p className="text-primary-600 text-sm">
                      You can request a copy of your data in a structured, machine-readable format.
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
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Object</h3>
                    <p className="text-primary-600 text-sm">
                      You can object to processing of your data for certain purposes.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Lock className="w-4 h-4 text-accent-500" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Right to Restriction</h3>
                    <p className="text-primary-600 text-sm">
                      You can request restriction of processing in certain circumstances.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Exercise Your Rights */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              How to Exercise Your Rights
            </h2>
            <div className="space-y-6">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Contact Us</h3>
                    <p className="text-primary-600 text-sm">
                      Send an email to <a href="mailto:omorfodesigned@gmail.com" className="text-accent-500 hover:underline">omorfodesigned@gmail.com</a> with your request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Provide Information</h3>
                    <p className="text-primary-600 text-sm">
                      Include your name, email address, and specific details about your request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Verification</h3>
                    <p className="text-primary-600 text-sm">
                      We may need to verify your identity before processing your request.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-accent-500 text-white rounded-full flex items-center justify-center font-semibold">
                    4
                  </div>
                  <div>
                    <h3 className="font-semibold text-primary-800 mb-2">Response</h3>
                    <p className="text-primary-600 text-sm">
                      We will respond to your request within 30 days, as required by GDPR.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Processing */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              How We Process Your Data
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Legal Basis for Processing</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• <strong>Consent:</strong> When you explicitly agree to data processing</li>
                  <li>• <strong>Contract:</strong> To fulfill our obligations to you</li>
                  <li>• <strong>Legitimate Interest:</strong> For business operations and improvements</li>
                  <li>• <strong>Legal Obligation:</strong> To comply with applicable laws</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-sm border border-primary-200">
                <h3 className="font-semibold text-primary-800 mb-4">Data Retention</h3>
                <ul className="text-primary-600 text-sm space-y-2">
                  <li>• <strong>Account Data:</strong> Until account deletion or 3 years of inactivity</li>
                  <li>• <strong>Order Data:</strong> 7 years for tax and legal purposes</li>
                  <li>• <strong>Marketing Data:</strong> Until consent withdrawal</li>
                  <li>• <strong>Analytics Data:</strong> 2 years maximum</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Security */}
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Data Security Measures
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
                <h3 className="font-semibold text-primary-800 mb-2">Access Controls</h3>
                <p className="text-primary-600 text-sm">
                  Strict access controls and authentication measures
                </p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Database className="w-8 h-8 text-accent-500" />
                </div>
                <h3 className="font-semibold text-primary-800 mb-2">Secure Storage</h3>
                <p className="text-primary-600 text-sm">
                  Data stored in secure, monitored facilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Data Breach Procedures */}
      <section className="py-16 bg-primary-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-display font-semibold text-primary-800 mb-8 text-center">
              Data Breach Procedures
            </h2>
            <div className="bg-white rounded-lg p-8 shadow-sm border border-primary-200">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Detection & Assessment</h3>
                  <p className="text-primary-600 text-sm">
                    We have procedures in place to detect and assess potential data breaches within 72 hours.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Notification</h3>
                  <p className="text-primary-600 text-sm">
                    If a breach poses a risk to your rights and freedoms, we will notify the relevant 
                    supervisory authority and affected individuals as required by GDPR.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-primary-800 mb-2">Remediation</h3>
                  <p className="text-primary-600 text-sm">
                    We will take immediate steps to contain and remediate any breach, 
                    including implementing additional security measures.
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
            Questions About GDPR?
          </h2>
          <p className="text-xl text-accent-100 mb-8 max-w-2xl mx-auto">
            If you have any questions about our GDPR compliance or want to exercise your rights, 
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
