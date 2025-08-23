import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail } = body

    if (!customerEmail) {
      return NextResponse.json(
        { error: 'Customer email is required' },
        { status: 400 }
      )
    }

    console.log('Testing customer email sending to:', customerEmail)
    console.log('Resend API Key available:', !!process.env.RESEND_API_KEY)

    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [customerEmail],
      subject: 'Test E-Mail - ómorfo Bestellbestätigung',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Test E-Mail</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">ómorfo Bestellbestätigung Test</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Test erfolgreich!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #667eea; margin-top: 0;">E-Mail-Konfiguration</h3>
              <p><strong>Empfänger:</strong> ${customerEmail}</p>
              <p><strong>Absender:</strong> noreply@omorfodesign.com</p>
              <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
              <p><strong>Status:</strong> ✅ E-Mail erfolgreich gesendet</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Dies ist eine Test-E-Mail für das ómorfo Bestellsystem</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        Test E-Mail - ómorfo Bestellbestätigung
        
        Test erfolgreich!
        
        E-Mail-Konfiguration:
        - Empfänger: ${customerEmail}
        - Absender: noreply@omorfodesign.com
        - Zeitstempel: ${new Date().toLocaleString('de-DE')}
        - Status: ✅ E-Mail erfolgreich gesendet
        
        Dies ist eine Test-E-Mail für das ómorfo Bestellsystem.
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending test customer email:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        customerEmail,
        resendApiKeyAvailable: !!process.env.RESEND_API_KEY
      })
    }

    console.log('Test customer email sent successfully to:', customerEmail)
    console.log('Resend response:', data)

    return NextResponse.json({
      success: true,
      message: 'Test customer email sent successfully',
      customerEmail,
      resendResponse: data,
      resendApiKeyAvailable: !!process.env.RESEND_API_KEY
    })

  } catch (error) {
    console.error('Error in test customer email API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test customer email',
        details: error instanceof Error ? error.message : 'Unknown error',
        customerEmail: 'unknown',
        resendApiKeyAvailable: !!process.env.RESEND_API_KEY
      },
      { status: 500 }
    )
  }
}
