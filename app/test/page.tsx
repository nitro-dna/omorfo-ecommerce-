'use client'

import { useState } from 'react'

export default function TestPage() {
  const [testResult, setTestResult] = useState<string>('')

  const testSupabaseConnection = async () => {
    try {
      const response = await fetch('/api/auth/supabase-signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Erfolgreich: ${JSON.stringify(data, null, 2)}`)
      } else {
        setTestResult(`❌ Fehler: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setTestResult(`❌ Netzwerkfehler: ${error}`)
    }
  }

  const testShopPage = async () => {
    try {
      const response = await fetch('/api/supabase/products')
      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Shop API funktioniert: ${data.length} Produkte gefunden`)
      } else {
        setTestResult(`❌ Shop API Fehler: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setTestResult(`❌ Shop API Netzwerkfehler: ${error}`)
    }
  }

  const testStripeConfig = async () => {
    try {
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000,
          currency: 'eur',
        }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setTestResult(`✅ Stripe funktioniert: ${JSON.stringify(data, null, 2)}`)
      } else {
        setTestResult(`❌ Stripe Fehler: ${JSON.stringify(data, null, 2)}`)
      }
    } catch (error) {
      setTestResult(`❌ Stripe Netzwerkfehler: ${error}`)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">ómorfo Website Test</h1>
      
      <div className="space-y-4">
        <button
          onClick={testSupabaseConnection}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Teste Supabase Verbindung
        </button>
        
        <button
          onClick={testShopPage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        >
          Teste Shop API
        </button>

        <button
          onClick={testStripeConfig}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 ml-4"
        >
          Teste Stripe
        </button>
      </div>

      {testResult && (
        <div className="mt-8 p-4 bg-gray-100 rounded">
          <h2 className="font-bold mb-2">Test Ergebnis:</h2>
          <pre className="whitespace-pre-wrap text-sm">{testResult}</pre>
        </div>
      )}

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Links zum Testen:</h2>
        <ul className="space-y-2">
          <li><a href="/" className="text-blue-500 hover:underline">Startseite</a></li>
          <li><a href="/shop" className="text-blue-500 hover:underline">Shop</a></li>
          <li><a href="/auth/signin" className="text-blue-500 hover:underline">Sign In</a></li>
          <li><a href="/auth/signup" className="text-blue-500 hover:underline">Sign Up</a></li>
        </ul>
      </div>
    </div>
  )
}
