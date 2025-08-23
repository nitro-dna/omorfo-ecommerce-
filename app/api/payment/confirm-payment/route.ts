import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { paymentIntentId, orderData } = body

    if (!paymentIntentId) {
      return NextResponse.json(
        { error: 'Payment intent ID is required' },
        { status: 400 }
      )
    }

    // Retrieve the payment intent to check its status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Payment was successful - here you would:
      // 1. Save order to database
      // 2. Send confirmation email
      // 3. Update inventory
      // 4. Create shipping label
      
      console.log('Payment successful:', paymentIntentId)
      
      return NextResponse.json({
        success: true,
        paymentIntentId,
        message: 'Payment confirmed successfully',
      })
    } else {
      return NextResponse.json(
        { error: 'Payment not completed' },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
}
