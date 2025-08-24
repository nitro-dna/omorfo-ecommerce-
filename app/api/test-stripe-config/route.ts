import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function GET(request: NextRequest) {
  try {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

    if (!stripeSecretKey) {
      return NextResponse.json({
        success: false,
        error: 'Stripe secret key not configured',
        details: {
          secretKeyConfigured: false,
          publishableKeyConfigured: !!stripePublishableKey
        }
      })
    }

    if (!stripePublishableKey) {
      return NextResponse.json({
        success: false,
        error: 'Stripe publishable key not configured',
        details: {
          secretKeyConfigured: true,
          publishableKeyConfigured: false
        }
      })
    }

    // Test Stripe connection
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    })

    try {
      // Test API connection by fetching account details
      const account = await stripe.accounts.retrieve()
      
      return NextResponse.json({
        success: true,
        message: 'Stripe configuration is valid',
        details: {
          secretKeyConfigured: true,
          publishableKeyConfigured: true,
          accountId: account.id,
          accountType: account.type,
          chargesEnabled: account.charges_enabled,
          payoutsEnabled: account.payouts_enabled,
          country: account.country,
          defaultCurrency: account.default_currency
        }
      })
    } catch (stripeError) {
      console.error('Stripe API error:', stripeError)
      return NextResponse.json({
        success: false,
        error: 'Stripe API connection failed',
        details: {
          secretKeyConfigured: true,
          publishableKeyConfigured: true,
          stripeError: stripeError instanceof Error ? stripeError.message : 'Unknown error'
        }
      })
    }

  } catch (error) {
    console.error('Stripe config test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test Stripe configuration',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
