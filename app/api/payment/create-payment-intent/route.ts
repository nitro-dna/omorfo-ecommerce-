import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { amount, currency = 'eur', metadata } = body

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    console.log('Creating payment intent with:', { 
      amount, 
      currency, 
      userId: session?.user?.email || 'guest',
      isMock: !process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('invalid')
    })

    // Create payment intent with PayPal support
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      metadata: {
        userId: session?.user?.email || 'guest',
        ...metadata,
      },
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'always', // Required for PayPal
      },
    })

    console.log('Payment intent created successfully:', paymentIntent.id)

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      isMock: paymentIntent.id.includes('mock_'),
      paymentMethodTypes: paymentIntent.payment_method_types,
    })
  } catch (error) {
    console.error('Error creating payment intent:', error)
    
    // More detailed error information
    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Payment failed: ${error.message}` },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 }
    )
  }
}
