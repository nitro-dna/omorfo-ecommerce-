'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { CheckCircle, XCircle, Mail, ShoppingCart } from 'lucide-react'
import toast from 'react-hot-toast'

export default function TestOrderNotificationsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [testEmail, setTestEmail] = useState('artun.goen@gmail.com')
  const [lastTestResult, setLastTestResult] = useState<any>(null)

  const testOrderCreation = async () => {
    setIsLoading(true)
    setLastTestResult(null)

    try {
      const orderData = {
        email: testEmail,
        firstName: 'Test',
        lastName: 'Kunde',
        phone: '+49123456789',
        address: 'Teststraße 123',
        city: 'Berlin',
        state: 'Berlin',
        zipCode: '10115',
        country: 'Germany'
      }

      const mockItems = [
        {
          productId: 'test-product-1',
          productName: 'Test Poster - Minimalist Design',
          quantity: 2,
          price: 29.99,
          size: 'A2',
          frame: 'Kein Rahmen',
          options: { customText: 'Test Text' }
        },
        {
          productId: 'test-product-2',
          productName: 'Test Poster - Abstract Art',
          quantity: 1,
          price: 39.99,
          size: 'A1',
          frame: 'Holzrahmen',
          options: {}
        }
      ]

      const orderPayload = {
        orderData,
        paymentIntentId: `pi_test_${Date.now()}`,
        items: mockItems,
        shippingAddress: orderData,
        billingAddress: orderData,
        total: 99.97,
        subtotal: 89.98,
        shipping: 9.99,
        discount: 0
      }

      console.log('Testing order creation with payload:', orderPayload)

      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderPayload),
      })

      const result = await response.json()
      console.log('Order creation result:', result)

      if (response.ok) {
        setLastTestResult({
          success: true,
          orderId: result.orderId,
          message: 'Bestellung erfolgreich erstellt und Benachrichtigungen gesendet!'
        })
        toast.success('Bestellbenachrichtigungen erfolgreich gesendet!')
      } else {
        setLastTestResult({
          success: false,
          error: result.error || 'Unbekannter Fehler'
        })
        toast.error('Fehler beim Erstellen der Bestellung')
      }

    } catch (error) {
      console.error('Error testing order creation:', error)
      setLastTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      })
      toast.error('Fehler beim Testen der Bestellbenachrichtigungen')
    } finally {
      setIsLoading(false)
    }
  }

  const testCustomerEmail = async () => {
    setIsLoading(true)
    setLastTestResult(null)

    try {
      console.log('Testing customer email sending to:', testEmail)

      const response = await fetch('/api/test-customer-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerEmail: testEmail }),
      })

      const result = await response.json()
      console.log('Customer email test result:', result)

      if (response.ok && result.success) {
        setLastTestResult({
          success: true,
          message: 'Kunden-E-Mail erfolgreich gesendet!'
        })
        toast.success('Kunden-E-Mail erfolgreich gesendet!')
      } else {
        setLastTestResult({
          success: false,
          error: result.error || result.details || 'E-Mail Test fehlgeschlagen'
        })
        toast.error('E-Mail Test fehlgeschlagen')
      }

    } catch (error) {
      console.error('Error testing customer email:', error)
      setLastTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      })
      toast.error('Fehler beim Testen der Kunden-E-Mail')
    } finally {
      setIsLoading(false)
    }
  }

  const testPaymentWebhook = async () => {
    setIsLoading(true)
    setLastTestResult(null)

    try {
      const webhookPayload = {
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_test_${Date.now()}`,
            amount: 9997, // €99.97 in cents
            metadata: {
              orderId: `OM-${Date.now()}-TEST`,
              customerEmail: testEmail,
              orderData: JSON.stringify({
                email: testEmail,
                firstName: 'Test',
                lastName: 'Kunde'
              })
            }
          }
        }
      }

      console.log('Testing payment webhook with payload:', webhookPayload)

      const response = await fetch('/api/webhooks/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'stripe-signature': 'test_signature'
        },
        body: JSON.stringify(webhookPayload),
      })

      const result = await response.json()
      console.log('Webhook test result:', result)

      if (response.ok) {
        setLastTestResult({
          success: true,
          message: 'Payment Webhook erfolgreich getestet!'
        })
        toast.success('Payment Webhook erfolgreich getestet!')
      } else {
        setLastTestResult({
          success: false,
          error: result.error || 'Webhook Test fehlgeschlagen'
        })
        toast.error('Webhook Test fehlgeschlagen')
      }

    } catch (error) {
      console.error('Error testing payment webhook:', error)
      setLastTestResult({
        success: false,
        error: error instanceof Error ? error.message : 'Unbekannter Fehler'
      })
      toast.error('Fehler beim Testen des Payment Webhooks')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-semibold text-gray-900 mb-4">
            Bestellbenachrichtigungen Test
          </h1>
          <p className="text-lg text-gray-600">
            Testen Sie das Bestellbenachrichtigungssystem
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Creation Test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bestellerstellung Test</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test E-Mail Adresse
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
                onClick={testOrderCreation}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? <LoadingSpinner /> : 'Bestellung erstellen & Benachrichtigungen senden'}
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
                    <div>
                      <p className={`text-sm font-medium ${
                        lastTestResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {lastTestResult.success ? 'Erfolgreich!' : 'Fehler'}
                      </p>
                      <p className={`text-sm ${
                        lastTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {lastTestResult.message || lastTestResult.error}
                      </p>
                      {lastTestResult.orderId && (
                        <p className="text-sm text-green-700 mt-1">
                          <strong>Bestellnummer:</strong> {lastTestResult.orderId}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Customer Email Test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Kunden-E-Mail Test</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Testet das Senden von E-Mails an Kunden direkt.
              </p>

              <Button
                onClick={testCustomerEmail}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? <LoadingSpinner /> : 'Kunden-E-Mail testen'}
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
                    <div>
                      <p className={`text-sm font-medium ${
                        lastTestResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {lastTestResult.success ? 'E-Mail erfolgreich!' : 'E-Mail Fehler'}
                      </p>
                      <p className={`text-sm ${
                        lastTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {lastTestResult.message || lastTestResult.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Webhook Test */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Mail className="w-6 h-6 text-green-600" />
              <h2 className="text-lg font-semibold text-gray-900">Payment Webhook Test</h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Simuliert eine erfolgreiche Zahlung und sendet entsprechende Benachrichtigungen.
              </p>

              <Button
                onClick={testPaymentWebhook}
                disabled={isLoading}
                className="w-full"
                variant="outline"
              >
                {isLoading ? <LoadingSpinner /> : 'Payment Webhook testen'}
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
                    <div>
                      <p className={`text-sm font-medium ${
                        lastTestResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {lastTestResult.success ? 'Webhook erfolgreich!' : 'Webhook Fehler'}
                      </p>
                      <p className={`text-sm ${
                        lastTestResult.success ? 'text-green-700' : 'text-red-700'
                      }`}>
                        {lastTestResult.message || lastTestResult.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Information Section */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Benachrichtigungssystem</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">📧 Kunden-Benachrichtigungen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Bestellbestätigung nach erfolgreicher Zahlung</li>
                <li>• Detaillierte Bestellübersicht mit Artikeln</li>
                <li>• Lieferadresse und Zahlungsdetails</li>
                <li>• Nächste Schritte und Support-Informationen</li>
              </ul>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-2">🔔 Admin-Benachrichtigungen</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Sofortige Benachrichtigung bei neuen Bestellungen</li>
                <li>• Vollständige Bestelldetails für Bearbeitung</li>
                <li>• Kundeninformationen und Lieferadresse</li>
                <li>• Zahlungsstatus und Betrag</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">📋 Nächste Schritte</h3>
            <div className="text-sm text-blue-700 space-y-1">
              <p>1. <strong>E-Mail überprüfen:</strong> Schauen Sie in Ihre E-Mail-Inbox (auch Spam-Ordner)</p>
              <p>2. <strong>Admin-E-Mail konfigurieren:</strong> Setzen Sie <code className="bg-blue-100 px-1 rounded">ADMIN_EMAIL</code> in Ihrer <code className="bg-blue-100 px-1 rounded">.env.local</code></p>
              <p>3. <strong>Stripe Webhook einrichten:</strong> Für automatische Benachrichtigungen in Produktion</p>
              <p>4. <strong>E-Mail-Templates anpassen:</strong> Personalisieren Sie die E-Mail-Inhalte nach Ihren Wünschen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
