import Stripe from 'stripe'

// Mock Stripe instance for development
const createMockStripeInstance = () => ({
  paymentIntents: {
    create: async (params: any) => ({ 
      id: 'mock_payment_intent_' + Date.now(),
      client_secret: 'mock_client_secret_' + Date.now(),
      status: 'requires_payment_method',
      amount: params.amount,
      currency: params.currency,
      metadata: params.metadata,
      payment_method_types: ['card', 'paypal']
    }),
    retrieve: async (id: string) => ({ 
      id, 
      status: 'succeeded',
      client_secret: 'mock_client_secret_' + id,
      payment_method_types: ['card', 'paypal']
    }),
    confirm: async (id: string) => ({ 
      id, 
      status: 'succeeded' 
    })
  },
  paymentMethods: {
    create: async (params: any) => ({
      id: 'mock_payment_method_' + Date.now(),
      type: params.type || 'card',
      card: params.type === 'card' ? {
        brand: 'visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      } : undefined,
      paypal: params.type === 'paypal' ? {
        payer_email: 'test@example.com'
      } : undefined
    }),
    attach: async (id: string, params: any) => ({
      id,
      customer: params.customer,
      type: 'card'
    })
  },
  customers: {
    create: async (params: any) => ({ 
      id: 'mock_customer_' + Date.now(),
      email: params.email,
      name: params.name
    }),
    retrieve: async (id: string) => ({ 
      id, 
      email: 'test@example.com',
      name: 'Test Customer'
    })
  }
})

// Fallback Stripe configuration that handles missing keys
export const createStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY
  
  // For development, use mock Stripe if no valid key
  if (!secretKey || secretKey.includes('invalid') || secretKey.length < 20) {
    console.warn('Using mock Stripe configuration for development')
    return createMockStripeInstance() as any
  }

  try {
    console.log('Initializing real Stripe with secret key:', secretKey.substring(0, 10) + '...')
    return new Stripe(secretKey, {
      apiVersion: '2023-10-16',
      typescript: true,
    })
  } catch (error) {
    console.error('Failed to initialize Stripe:', error)
    console.warn('Falling back to mock Stripe')
    return createMockStripeInstance() as any
  }
}

// Server-side Stripe instance
export const stripe = createStripeInstance()

// Client-side Stripe instance
export const getStripe = () => {
  const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_PUBLISHABLE_KEY
  
  if (!publishableKey || publishableKey.includes('invalid') || publishableKey.length < 20) {
    console.warn('Stripe publishable key not found or invalid - checkout will be disabled')
    return null
  }
  
  try {
    const { loadStripe } = require('@stripe/stripe-js')
    return loadStripe(publishableKey)
  } catch (error) {
    console.error('Failed to load Stripe:', error)
    return null
  }
}
