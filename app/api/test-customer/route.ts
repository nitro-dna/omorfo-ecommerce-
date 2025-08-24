import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, name } = body

    if (!email || !name) {
      return NextResponse.json(
        { error: 'Email and name are required' },
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
      // Create a test customer
      const customer = await stripe.customers.create({
        email: email,
        name: name,
        metadata: {
          test: 'true',
          source: 'admin-test'
        }
      })

      console.log('Customer created:', customer.id)

      return NextResponse.json({
        success: true,
        message: 'Customer created successfully',
        data: {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          created: customer.created,
          livemode: customer.livemode
        }
      })

    } catch (stripeError) {
      console.error('Stripe customer error:', stripeError)
      return NextResponse.json({
        success: false,
        error: 'Failed to create customer',
        details: stripeError instanceof Error ? stripeError.message : 'Unknown error'
      })
    }

  } catch (error) {
    console.error('Customer test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test customer creation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
