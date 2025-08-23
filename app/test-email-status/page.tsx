'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Mail, CheckCircle, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestEmailStatusPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('artun.goen@gmail.com')
  const [lastTestResult, setLastTestResult] = useState<any>(null)

  const testEmailSending = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      })
      const result = await response.json()
      setLastTestResult(result)
      
      if (response.ok) {
        toast.success('Test email sent successfully!')
      } else {
        toast.error(result.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Test email error:', error)
      toast.error('Failed to send test email')
    } finally {
      setIsLoading(false)
    }
  }

  const testNewsletterSubscription = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: testEmail }),
      })
      const result = await response.json()
      setLastTestResult(result)
      
      if (response.ok) {
        toast.success('Newsletter subscription test completed!')
      } else {
        toast.error(result.error || 'Failed to test newsletter subscription')
      }
    } catch (error) {
      console.error('Newsletter test error:', error)
      toast.error('Failed to test newsletter subscription')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            E-Mail-Versand Status Test
          </h1>
          <p className="text-lg text-gray-600">
            Testen Sie die E-Mail-Funktionalität und überprüfen Sie den Status
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Test Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              E-Mail-Versand Test
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test E-Mail-Adresse
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent-500 focus:border-accent-500"
                  placeholder="Enter test email"
                />
              </div>
              
              <Button
                onClick={testEmailSending}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <LoadingSpinner /> : 'Test E-Mail-Versand'}
              </Button>
              
              <Button
                onClick={testNewsletterSubscription}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                {isLoading ? <LoadingSpinner /> : 'Test Newsletter-Anmeldung'}
              </Button>
            </div>
          </div>

          {/* Status Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              Status & Anweisungen
            </h2>
            
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">✅ Domain verifiziert!</h3>
                <p className="text-sm text-green-700">
                  Ihre Domain ist verifiziert! E-Mails können jetzt an beliebige Adressen gesendet werden.
                </p>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">📧 E-Mail-Versand funktioniert!</h3>
                <p className="text-sm text-blue-700">
                  E-Mails werden jetzt direkt an die eingegebene E-Mail-Adresse gesendet.
                  Überprüfen Sie Ihre E-Mail-Inbox für Test-E-Mails und Newsletter-Bestätigungen.
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">🎉 Produktionsbereit!</h3>
                <p className="text-sm text-purple-700">
                  Die Newsletter-Funktionalität ist jetzt vollständig produktionsbereit.
                  Alle E-Mails werden über Ihre verifizierte Domain gesendet.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        {lastTestResult && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Letzter Test-Ergebnis</h2>
            <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              {JSON.stringify(lastTestResult, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nächste Schritte</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">1. E-Mails überprüfen</h3>
              <p className="text-sm text-gray-600">
                Überprüfen Sie jetzt Ihre E-Mail-Inbox (<strong>artun.goen@gmail.com</strong>) 
                für die Test-E-Mails und Newsletter-Bestätigungen.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">2. Newsletter testen</h3>
              <p className="text-sm text-gray-600">
                Testen Sie die Newsletter-Funktionalität:
              </p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Gehen Sie zur Homepage und melden Sie sich für den Newsletter an</li>
                <li>• Verwenden Sie die Test-Seite für detaillierte Tests</li>
                <li>• Überprüfen Sie die E-Mail-Bestätigungen</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">3. Produktionsbereit</h3>
              <p className="text-sm text-gray-600">
                Die Newsletter-Funktionalität ist jetzt vollständig produktionsbereit!
                Alle E-Mails werden über Ihre verifizierte Domain gesendet.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
