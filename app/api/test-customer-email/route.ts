import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, orderId, customerName } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    // Use provided values or defaults for testing
    const testOrderId = orderId || 'TEST-ORDER-123'
    const testCustomerName = customerName || 'Test Customer'

    console.log('Sending customer confirmation email to:', email)
    console.log('Order ID:', testOrderId)
    console.log('Customer Name:', testCustomerName)

    // Create professional email HTML
    const emailHtml = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">ómorfo</div>
          <div style="font-size: 16px; opacity: 0.9;">Custom Posters & Design</div>
        </div>
        
        <div style="padding: 40px 20px; background-color: #ffffff;">
          <h1 style="color: #333; margin-bottom: 20px;">Bestellbestätigung ✅</h1>
          
          <p style="color: #666; line-height: 1.6;">Hallo ${testCustomerName},</p>
          
          <p style="color: #666; line-height: 1.6;">vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und beginnen sofort mit der Bearbeitung.</p>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
            <h3 style="color: #333; margin-top: 0;">Bestelldetails:</h3>
            <p style="margin: 5px 0;"><strong>Bestellnummer:</strong> #${testOrderId}</p>
            <p style="margin: 5px 0;"><strong>Bestelldatum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
          </div>
          
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Ihre Bestellung:</h3>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef;">
              <span>Custom Poster - Test Design (x1)</span>
              <span>29,99 €</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e9ecef;">
              <span>Premium Frame (x1)</span>
              <span>19,99 €</span>
            </div>
            <div style="display: flex; justify-content: space-between; padding: 15px 0; font-weight: bold; font-size: 18px; border-top: 2px solid #e9ecef; margin-top: 15px;">
              <span>Gesamtbetrag:</span>
              <span>49,98 €</span>
            </div>
          </div>
          
          <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
            <h3 style="color: #333; margin-top: 0;">Lieferadresse:</h3>
            <p style="margin: 5px 0;">Musterstraße 123, 12345 Musterstadt, Deutschland</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">Wir werden Sie über den Status Ihrer Bestellung auf dem Laufenden halten.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://omorfodesign.com/account" 
               style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: 500;">
              Bestellung verfolgen
            </a>
          </div>
          
          <p style="color: #666; line-height: 1.6;">Bei Fragen erreichen Sie uns unter: support@omorfodesign.com</p>
          
          <p style="color: #666; line-height: 1.6;">Beste Grüße,<br />Ihr ómorfo Team</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
          <div style="color: #6c757d; font-size: 14px; margin-bottom: 15px;">
            Vielen Dank für Ihr Vertrauen in ómorfo
          </div>
          
          <div style="margin-bottom: 20px;">
            <a href="#" style="display: inline-block; margin: 0 10px; color: #6c757d; text-decoration: none;">Instagram</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #6c757d; text-decoration: none;">Facebook</a>
            <a href="#" style="display: inline-block; margin: 0 10px; color: #6c757d; text-decoration: none;">Twitter</a>
          </div>
          
          <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
            © 2024 ómorfo. Alle Rechte vorbehalten.
          </div>
          
          <div style="font-size: 12px; color: #adb5bd;">
            <a href="/unsubscribe" style="color: #adb5bd; text-decoration: none;">Newsletter abbestellen</a>
          </div>
        </div>
      </div>
    `

    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [email],
      subject: `Bestellbestätigung - ómorfo #${testOrderId}`,
      html: emailHtml,
      text: `
Bestellbestätigung - ómorfo

Hallo ${testCustomerName},

vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und beginnen sofort mit der Bearbeitung.

Bestelldetails:
- Bestellnummer: #${testOrderId}
- Bestelldatum: ${new Date().toLocaleDateString('de-DE')}
- Kunde: ${testCustomerName}

Bestellung verfolgen: https://omorfodesign.com/account

Bei Fragen erreichen Sie uns unter: support@omorfodesign.com

Beste Grüße,
Ihr ómorfo Team

© 2025 ómorfo. Alle Rechte vorbehalten.
Diese E-Mail wurde an ${email} gesendet
      `
    })

    if (error) {
      console.error('Customer email error:', error)
      return NextResponse.json(
        { 
          success: false,
          error: 'Failed to send customer email', 
          details: error,
          email,
          orderId: testOrderId,
          customerName: testCustomerName
        },
        { status: 500 }
      )
    }

    console.log('Customer confirmation email sent successfully!')
    console.log('Email data:', data)

    return NextResponse.json({
      success: true,
      message: 'Customer confirmation email sent successfully',
      data: {
        email,
        orderId: testOrderId,
        customerName: testCustomerName,
        resendResponse: data
      }
    })

  } catch (error) {
    console.error('Customer email API error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
