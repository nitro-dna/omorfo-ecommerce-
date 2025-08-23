'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CheckCircle, XCircle, Mail, AlertCircle, Info } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestEmailDeliveryPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('artun05@yahoo.com')
  const [lastTestResult, setLastTestResult] = useState<any>(null)
  const [testHistory, setTestHistory] = useState<any[]>([])

  const testEmailDelivery = async () => {
    setIsLoading(true)
    setLastTestResult(null)

    try {
      console.log('Testing email delivery to:', testEmail)

      const response = await fetch('/api/test-email-providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: testEmail }),
      })

      const result = await response.json()
      console.log('Email delivery test result:', result)

      const testResult = {
        timestamp: new Date().toLocaleString('de-DE'),
        email: testEmail,
        success: response.ok && result.success,
        provider: result.emailProvider,
        message: result.message || result.error,
        details: result
      }

      setTestHistory(prev => [testResult, ...prev.slice(0, 4)]) // Keep last 5 tests
      setLastTestResult(testResult)

      if (response.ok && result.success) {
        toast.success(`E-Mail erfolgreich an ${result.emailProvider} gesendet!`)
      } else {
        toast.error(`E-Mail Test fehlgeschlagen: ${result.error}`)
      }

    } catch (error) {
      console.error('Error testing email delivery:', error)
      const errorResult = {
        timestamp: new Date().toLocaleString('de-DE'),
        email: testEmail,
        success: false,
        provider: 'Unbekannt',
        message: error instanceof Error ? error.message : 'Unbekannter Fehler',
        details: { error }
      }
      setTestHistory(prev => [errorResult, ...prev.slice(0, 4)])
      setLastTestResult(errorResult)
      toast.error('Fehler beim Testen der E-Mail-Zustellung')
    } finally {
      setIsLoading(false)
    }
  }

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'Gmail': return '📧'
      case 'Yahoo': return '📬'
      case 'Outlook/Hotmail': return '📮'
      case 'iCloud': return '☁️'
      default: return '📧'
    }
  }

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case 'Gmail': return 'text-red-600'
      case 'Yahoo': return 'text-purple-600'
      case 'Outlook/Hotmail': return 'text-blue-600'
      case 'iCloud': return 'text-gray-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            E-Mail Delivery Test
          </h1>
          <p className="text-lg text-gray-600">
            Testen Sie die E-Mail-Zustellung an verschiedene E-Mail-Provider
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Test Form */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">E-Mail-Zustellung Testen</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-Mail-Adresse testen
                </label>
                <input
                  type="email"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="test@example.com"
                />
              </div>

              <Button
                onClick={testEmailDelivery}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <LoadingSpinner /> : 'E-Mail-Zustellung testen'}
              </Button>

              {lastTestResult && (
                <div className={`p-4 rounded-lg ${
                  lastTestResult.success 
                    ? 'bg-green-50 border border-green-200' 
                    : 'bg-red-50 border border-red-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    {lastTestResult.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className={`text-sm font-medium ${
                          lastTestResult.success ? 'text-green-800' : 'text-red-800'
                        }`}>
                          {lastTestResult.success ? 'Erfolgreich!' : 'Fehlgeschlagen'}
                        </span>
                        {lastTestResult.provider && (
                          <span className={`text-xs px-2 py-1 rounded-full bg-gray-100 ${getProviderColor(lastTestResult.provider)}`}>
                            {getProviderIcon(lastTestResult.provider)} {lastTestResult.provider}
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${
                        lastTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {lastTestResult.message}
                      </p>
                      {lastTestResult.details?.providerInfo && (
                        <p className="text-xs text-gray-600 mt-2">
                          💡 {lastTestResult.details.providerInfo}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Test History */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Info className="w-6 h-6 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Test-Verlauf</h2>
            </div>
            
            <div className="space-y-3">
              {testHistory.length === 0 ? (
                <p className="text-sm text-gray-500">Noch keine Tests durchgeführt</p>
              ) : (
                testHistory.map((test, index) => (
                  <div key={index} className={`p-3 rounded-lg border ${
                    test.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${
                        test.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {test.success ? '✅ Erfolgreich' : '❌ Fehlgeschlagen'}
                      </span>
                      <span className="text-xs text-gray-500">{test.timestamp}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{test.email}</p>
                    {test.provider && (
                      <p className="text-xs text-gray-600">
                        {getProviderIcon(test.provider)} {test.provider}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Provider Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">E-Mail-Provider Hinweise</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📧</span>
                <h3 className="font-medium text-red-900">Gmail</h3>
              </div>
              <ul className="text-xs text-red-700 space-y-1">
                <li>• E-Mails im Hauptposteingang</li>
                <li>• Überprüfen Sie "Promotions" Tab</li>
                <li>• Gute Spam-Filter</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📬</span>
                <h3 className="font-medium text-purple-900">Yahoo</h3>
              </div>
              <ul className="text-xs text-purple-700 space-y-1">
                <li>• Überprüfen Sie Spam-Ordner</li>
                <li>• Schauen Sie in "Bulk" Ordner</li>
                <li>• Strenge Spam-Filter</li>
                <li>• Als "Nicht Spam" markieren</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">📮</span>
                <h3 className="font-medium text-blue-900">Outlook/Hotmail</h3>
              </div>
              <ul className="text-xs text-blue-700 space-y-1">
                <li>• E-Mails im Hauptposteingang</li>
                <li>• Überprüfen Sie "Junk" Ordner</li>
                <li>• Zu Kontakten hinzufügen</li>
              </ul>
            </div>

            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-lg">☁️</span>
                <h3 className="font-medium text-gray-900">iCloud</h3>
              </div>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• E-Mails im Hauptposteingang</li>
                <li>• Überprüfen Sie "Junk" Ordner</li>
                <li>• Moderate Spam-Filter</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900 mb-2">Wichtige Hinweise für Yahoo-E-Mail-Adressen</h3>
                <div className="text-sm text-yellow-800 space-y-2">
                  <p>Yahoo hat besonders strenge Spam-Filter. Wenn Sie keine E-Mail erhalten:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-4">
                    <li>Überprüfen Sie Ihren <strong>Spam-Ordner</strong></li>
                    <li>Schauen Sie in den <strong>"Bulk" oder "Junk" Ordner</strong></li>
                    <li>Markieren Sie <code className="bg-yellow-100 px-1 rounded">noreply@omorfodesign.com</code> als "Nicht Spam"</li>
                    <li>Fügen Sie uns zu Ihren <strong>Kontakten</strong> hinzu</li>
                    <li>Überprüfen Sie Ihre <strong>E-Mail-Einstellungen</strong></li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
