import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { headers } from 'next/headers'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const signature = headers().get('stripe-signature')

    if (!signature || !webhookSecret) {
      console.error('Missing stripe signature or webhook secret')
      return NextResponse.json(
        { error: 'Missing signature or webhook secret' },
        { status: 400 }
      )
    }

    let event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('Received webhook event:', event.type)

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSucceeded(event.data.object)
        break
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object)
        break
      
      case 'charge.succeeded':
        await handleChargeSucceeded(event.data.object)
        break
      
      case 'charge.failed':
        await handleChargeFailed(event.data.object)
        break
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

async function handlePaymentSucceeded(paymentIntent: any) {
  console.log('Payment succeeded:', paymentIntent.id)
  
  try {
    // Extract order information from metadata
    const { orderId, customerEmail, orderData } = paymentIntent.metadata
    
    if (orderId) {
      // Send success notification
      await sendPaymentSuccessNotification(paymentIntent, orderId, customerEmail, orderData)
    }
  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentFailed(paymentIntent: any) {
  console.log('Payment failed:', paymentIntent.id)
  
  try {
    const { orderId, customerEmail } = paymentIntent.metadata
    
    if (customerEmail) {
      await sendPaymentFailedNotification(paymentIntent, orderId, customerEmail)
    }
  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handleChargeSucceeded(charge: any) {
  console.log('Charge succeeded:', charge.id)
  
  try {
    // Additional charge success handling if needed
    const paymentIntent = charge.payment_intent
    if (paymentIntent) {
      await handlePaymentSucceeded({ id: paymentIntent, metadata: charge.metadata })
    }
  } catch (error) {
    console.error('Error handling charge success:', error)
  }
}

async function handleChargeFailed(charge: any) {
  console.log('Charge failed:', charge.id)
  
  try {
    // Additional charge failure handling if needed
    const paymentIntent = charge.payment_intent
    if (paymentIntent) {
      await handlePaymentFailed({ id: paymentIntent, metadata: charge.metadata })
    }
  } catch (error) {
    console.error('Error handling charge failure:', error)
  }
}

async function sendPaymentSuccessNotification(paymentIntent: any, orderId: string, customerEmail: string, orderData: any) {
  try {
    // Send customer confirmation
    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [customerEmail],
      subject: `Zahlung erfolgreich - Bestellung ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zahlung erfolgreich!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Ihre Bestellung wurde bestätigt</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Bestellbestätigung</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #4CAF50; margin-top: 0;">Zahlungsdetails</h3>
              <p><strong>Bestellnummer:</strong> ${orderId}</p>
              <p><strong>Zahlungs-ID:</strong> ${paymentIntent.id}</p>
              <p><strong>Betrag:</strong> €${(paymentIntent.amount / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> Erfolgreich bezahlt</p>
              <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #4CAF50; margin-top: 0;">Nächste Schritte</h3>
              <p>✅ Ihre Bestellung wird bearbeitet</p>
              <p>📦 Sie erhalten eine Versandbestätigung</p>
              <p>📧 Weitere Updates per E-Mail</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Fragen? Kontaktieren Sie uns unter support@omorfodesign.com</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        Zahlung erfolgreich - Bestellung ${orderId}
        
        Ihre Zahlung wurde erfolgreich verarbeitet!
        
        Zahlungsdetails:
        - Bestellnummer: ${orderId}
        - Zahlungs-ID: ${paymentIntent.id}
        - Betrag: €${(paymentIntent.amount / 100).toFixed(2)}
        - Status: Erfolgreich bezahlt
        - Datum: ${new Date().toLocaleDateString('de-DE')}
        
        Nächste Schritte:
        ✅ Ihre Bestellung wird bearbeitet
        📦 Sie erhalten eine Versandbestätigung
        📧 Weitere Updates per E-Mail
        
        Fragen? Kontaktieren Sie uns unter support@omorfodesign.com
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending payment success email:', error)
    } else {
      console.log('Payment success email sent to customer')
    }

    // Send admin notification
    const adminEmail = process.env.ADMIN_EMAIL || 'omorfodesigned@gmail.com'
    await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [adminEmail],
      subject: `Zahlung erfolgreich - Bestellung ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #4CAF50; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zahlung erfolgreich!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Eine neue Zahlung wurde verarbeitet</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Zahlungsdetails</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #4CAF50; margin-top: 0;">Bestellinformationen</h3>
              <p><strong>Bestellnummer:</strong> ${orderId}</p>
              <p><strong>Kunde:</strong> ${customerEmail}</p>
              <p><strong>Zahlungs-ID:</strong> ${paymentIntent.id}</p>
              <p><strong>Betrag:</strong> €${(paymentIntent.amount / 100).toFixed(2)}</p>
              <p><strong>Status:</strong> Erfolgreich bezahlt</p>
              <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Bitte bearbeiten Sie diese Bestellung in Ihrem Admin-Dashboard</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `
    })

  } catch (error) {
    console.error('Error sending payment success notifications:', error)
  }
}

async function sendPaymentFailedNotification(paymentIntent: any, orderId: string, customerEmail: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [customerEmail],
      subject: `Zahlung fehlgeschlagen - Bestellung ${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #f44336; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Zahlung fehlgeschlagen</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Ihre Zahlung konnte nicht verarbeitet werden</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Zahlungsproblem</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #f44336; margin-top: 0;">Details</h3>
              <p><strong>Bestellnummer:</strong> ${orderId}</p>
              <p><strong>Zahlungs-ID:</strong> ${paymentIntent.id}</p>
              <p><strong>Status:</strong> Fehlgeschlagen</p>
              <p><strong>Grund:</strong> ${paymentIntent.last_payment_error?.message || 'Unbekannter Fehler'}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #f44336; margin-top: 0;">Was können Sie tun?</h3>
              <p>🔄 Versuchen Sie es erneut mit einer anderen Zahlungsmethode</p>
              <p>💳 Überprüfen Sie Ihre Kreditkartendaten</p>
              <p>📞 Kontaktieren Sie uns für Unterstützung</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Hilfe benötigt? Kontaktieren Sie uns unter support@omorfodesign.com</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        Zahlung fehlgeschlagen - Bestellung ${orderId}
        
        Ihre Zahlung konnte nicht verarbeitet werden.
        
        Details:
        - Bestellnummer: ${orderId}
        - Zahlungs-ID: ${paymentIntent.id}
        - Status: Fehlgeschlagen
        - Grund: ${paymentIntent.last_payment_error?.message || 'Unbekannter Fehler'}
        
        Was können Sie tun?
        🔄 Versuchen Sie es erneut mit einer anderen Zahlungsmethode
        💳 Überprüfen Sie Ihre Kreditkartendaten
        📞 Kontaktieren Sie uns für Unterstützung
        
        Hilfe benötigt? Kontaktieren Sie uns unter support@omorfodesign.com
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending payment failed email:', error)
    } else {
      console.log('Payment failed email sent to customer')
    }

  } catch (error) {
    console.error('Error sending payment failed notification:', error)
  }
}
