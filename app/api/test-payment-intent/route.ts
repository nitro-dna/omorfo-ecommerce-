import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { amount, currency, description } = body

    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Amount and currency are required' },
        { status: 400 }
      )
    }

    const stripeSecretKey = process.env.STRIPE_SECRET_KEY
    if (!stripeSecretKey) {
      return NextResponse.json(
        { error: 'Stripe secret key not configured' },
        { status: 500 }
      )
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16'
    })

    try {
      // Create a test payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, // Amount in cents
        currency: currency,
        description: description || 'Test payment for ómorfo',
        metadata: {
          test: 'true',
          source: 'admin-test'
        },
        automatic_payment_methods: {
          enabled: true,
        },
      })

      console.log('Payment intent created:', paymentIntent.id)

      return NextResponse.json({
        success: true,
        message: 'Payment intent created successfully',
        data: {
          id: paymentIntent.id,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          client_secret: paymentIntent.client_secret,
          created: paymentIntent.created
        }
      })

    } catch (stripeError) {
      console.error('Stripe payment intent error:', stripeError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create payment intent',
        details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
      })
    }

  } catch (error) {
    console.error('Payment intent test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test payment intent creation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
