import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Webhook type and data are required' },
        { status: 400 }
      )
    }

    console.log('Testing webhook handling for type:', type)

    // Simulate webhook processing
    let webhookResult = null

    try {
      switch (type) {
        case 'payment_intent.succeeded':
          console.log('Processing payment_intent.succeeded webhook')
          
          // Simulate order processing
          const orderId = data.object.metadata?.orderId || 'TEST-ORDER-' + Date.now()
          const amount = data.object.amount / 100 // Convert from cents
          
          // Send admin notification
          const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <div style="background: #10b981; padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 28px;">Payment Successful!</h1>
                <p style="margin: 10px 0 0 0; font-size: 16px;">Payment received for order</p>
              </div>
              
              <div style="padding: 30px; background: #f9f9f9;">
                <h2 style="color: #333; margin-bottom: 20px;">Payment Details</h2>
                
                <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #10b981; margin-top: 0;">Payment Information</h3>
                  <p><strong>Payment Intent ID:</strong> ${data.object.id}</p>
                  <p><strong>Order ID:</strong> ${orderId}</p>
                  <p><strong>Amount:</strong> €${amount.toFixed(2)}</p>
                  <p><strong>Currency:</strong> ${data.object.currency.toUpperCase()}</p>
                  <p><strong>Status:</strong> ${data.object.status}</p>
                  <p><strong>Customer:</strong> ${data.object.customer || 'Guest'}</p>
                </div>

                <div style="background: white; padding: 20px; border-radius: 8px;">
                  <h3 style="color: #10b981; margin-top: 0;">Next Steps</h3>
                  <p>1. Verify the payment in your Stripe dashboard</p>
                  <p>2. Process the order in your admin panel</p>
                  <p>3. Send confirmation email to customer</p>
                  <p>4. Update order status to "Paid"</p>
                </div>
              </div>

              <div style="background: #333; padding: 20px; text-align: center; color: white;">
                <p style="margin: 0;">This is a test webhook notification</p>
                <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
              </div>
            </div>
          `

          const { data: emailData, error: emailError } = await resend.emails.send({
            from: 'ómorfo <noreply@omorfodesign.com>',
            to: ['omorfodesigned@gmail.com'],
            subject: `Payment Successful - ${orderId}`,
            html: adminEmailHtml
          })

          if (emailError) {
            console.error('Admin notification email error:', emailError)
            webhookResult = { success: false, error: emailError }
          } else {
            console.log('Admin notification email sent successfully')
            webhookResult = { 
              success: true, 
              message: 'Payment processed and admin notified',
              data: {
                orderId,
                amount,
                paymentIntentId: data.object.id,
                emailSent: true
              }
            }
          }
          break

        case 'payment_intent.payment_failed':
          console.log('Processing payment_intent.payment_failed webhook')
          webhookResult = { 
            success: true, 
            message: 'Payment failure handled',
            data: {
              paymentIntentId: data.object.id,
              failureReason: data.object.last_payment_error?.message || 'Unknown error'
            }
          }
          break

        default:
          webhookResult = { 
            success: true, 
            message: `Webhook type '${type}' handled`,
            data: { type, objectId: data.object?.id }
          }
      }

      return NextResponse.json({
        success: true,
        message: 'Webhook processed successfully',
        data: webhookResult
      })

    } catch (webhookError) {
      console.error('Webhook processing error:', webhookError)
      return NextResponse.json({
        success: false,
        error: 'Failed to process webhook',
        details: webhookError instanceof Error ? webhookError.message : 'Unknown error'
      })
    }

  } catch (error) {
    console.error('Webhook test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to test webhook handling',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
