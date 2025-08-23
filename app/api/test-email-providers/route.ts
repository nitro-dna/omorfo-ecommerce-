import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      )
    }

    console.log('Testing email delivery to:', email)
    console.log('Resend API Key available:', !!process.env.RESEND_API_KEY)
    console.log('Resend API Key starts with:', process.env.RESEND_API_KEY?.substring(0, 10))

    // Determine email provider
    const emailProvider = getEmailProvider(email)
    console.log('Detected email provider:', emailProvider)

    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [email],
      subject: `E-Mail Test - ${emailProvider} - ${new Date().toLocaleString('de-DE')}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">E-Mail Delivery Test</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">ómorfo Bestellsystem - ${emailProvider}</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Test erfolgreich!</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">E-Mail-Details</h3>
              <p><strong>Empfänger:</strong> ${email}</p>
              <p><strong>E-Mail-Provider:</strong> ${emailProvider}</p>
              <p><strong>Absender:</strong> noreply@omorfodesign.com</p>
              <p><strong>Zeitstempel:</strong> ${new Date().toLocaleString('de-DE')}</p>
              <p><strong>Status:</strong> ✅ E-Mail erfolgreich gesendet</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Provider-spezifische Hinweise</h3>
              ${getProviderSpecificInfo(emailProvider)}
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #667eea; margin-top: 0;">Nächste Schritte</h3>
              <p>✅ Überprüfen Sie Ihre E-Mail-Inbox</p>
              <p>📁 Schauen Sie auch in den Spam-Ordner</p>
              <p>⚙️ Überprüfen Sie Ihre E-Mail-Einstellungen</p>
              <p>📧 Kontaktieren Sie uns bei Problemen</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Dies ist eine Test-E-Mail für das ómorfo Bestellsystem</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        E-Mail Delivery Test - ${emailProvider}
        
        Test erfolgreich!
        
        E-Mail-Details:
        - Empfänger: ${email}
        - E-Mail-Provider: ${emailProvider}
        - Absender: noreply@omorfodesign.com
        - Zeitstempel: ${new Date().toLocaleString('de-DE')}
        - Status: ✅ E-Mail erfolgreich gesendet
        
        Provider-spezifische Hinweise:
        ${getProviderSpecificInfoText(emailProvider)}
        
        Nächste Schritte:
        ✅ Überprüfen Sie Ihre E-Mail-Inbox
        📁 Schauen Sie auch in den Spam-Ordner
        ⚙️ Überprüfen Sie Ihre E-Mail-Einstellungen
        📧 Kontaktieren Sie uns bei Problemen
        
        Dies ist eine Test-E-Mail für das ómorfo Bestellsystem.
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending test email:', error)
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        email,
        emailProvider,
        resendApiKeyAvailable: !!process.env.RESEND_API_KEY,
        resendApiKeyStartsWith: process.env.RESEND_API_KEY?.substring(0, 10),
        timestamp: new Date().toISOString()
      })
    }

    console.log('Test email sent successfully to:', email)
    console.log('Resend response:', data)

    return NextResponse.json({
      success: true,
      message: `Test email sent successfully to ${emailProvider}`,
      email,
      emailProvider,
      resendResponse: data,
      resendApiKeyAvailable: !!process.env.RESEND_API_KEY,
      resendApiKeyStartsWith: process.env.RESEND_API_KEY?.substring(0, 10),
      timestamp: new Date().toISOString(),
      providerInfo: getProviderSpecificInfoText(emailProvider)
    })

  } catch (error) {
    console.error('Error in test email providers API:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to send test email',
        details: error instanceof Error ? error.message : 'Unknown error',
        email: 'unknown',
        resendApiKeyAvailable: !!process.env.RESEND_API_KEY,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

function getEmailProvider(email: string): string {
  const domain = email.split('@')[1]?.toLowerCase()
  
  if (domain?.includes('gmail.com')) return 'Gmail'
  if (domain?.includes('yahoo.com') || domain?.includes('yahoo.de')) return 'Yahoo'
  if (domain?.includes('outlook.com') || domain?.includes('hotmail.com') || domain?.includes('live.com')) return 'Outlook/Hotmail'
  if (domain?.includes('icloud.com') || domain?.includes('me.com')) return 'iCloud'
  if (domain?.includes('protonmail.com')) return 'ProtonMail'
  if (domain?.includes('tutanota.com')) return 'Tutanota'
  
  return 'Unbekannt'
}

function getProviderSpecificInfo(provider: string): string {
  switch (provider) {
    case 'Gmail':
      return `
        <p><strong>Gmail-spezifische Hinweise:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>E-Mails landen normalerweise im Hauptposteingang</li>
          <li>Überprüfen Sie auch "Promotions" oder "Updates" Tabs</li>
          <li>Gmail hat gute Spam-Filter</li>
        </ul>
      `
    case 'Yahoo':
      return `
        <p><strong>Yahoo-spezifische Hinweise:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>E-Mails können im Spam-Ordner landen</li>
          <li>Überprüfen Sie "Bulk" oder "Junk" Ordner</li>
          <li>Yahoo hat strenge Spam-Filter</li>
          <li>Markieren Sie unsere E-Mail als "Nicht Spam"</li>
        </ul>
      `
    case 'Outlook/Hotmail':
      return `
        <p><strong>Outlook/Hotmail-spezifische Hinweise:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>E-Mails landen normalerweise im Hauptposteingang</li>
          <li>Überprüfen Sie "Junk" Ordner</li>
          <li>Fügen Sie uns zu Ihren Kontakten hinzu</li>
        </ul>
      `
    case 'iCloud':
      return `
        <p><strong>iCloud-spezifische Hinweise:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>E-Mails landen normalerweise im Hauptposteingang</li>
          <li>Überprüfen Sie "Junk" Ordner</li>
          <li>iCloud hat moderate Spam-Filter</li>
        </ul>
      `
    default:
      return `
        <p><strong>Allgemeine Hinweise:</strong></p>
        <ul style="margin: 0; padding-left: 20px;">
          <li>Überprüfen Sie Ihren Spam-Ordner</li>
          <li>Fügen Sie noreply@omorfodesign.com zu Ihren Kontakten hinzu</li>
          <li>Überprüfen Sie Ihre E-Mail-Einstellungen</li>
        </ul>
      `
  }
}

function getProviderSpecificInfoText(provider: string): string {
  switch (provider) {
    case 'Gmail':
      return 'Gmail: E-Mails landen normalerweise im Hauptposteingang. Überprüfen Sie auch "Promotions" oder "Updates" Tabs.'
    case 'Yahoo':
      return 'Yahoo: E-Mails können im Spam-Ordner landen. Überprüfen Sie "Bulk" oder "Junk" Ordner. Markieren Sie unsere E-Mail als "Nicht Spam".'
    case 'Outlook/Hotmail':
      return 'Outlook/Hotmail: E-Mails landen normalerweise im Hauptposteingang. Überprüfen Sie "Junk" Ordner. Fügen Sie uns zu Ihren Kontakten hinzu.'
    case 'iCloud':
      return 'iCloud: E-Mails landen normalerweise im Hauptposteingang. Überprüfen Sie "Junk" Ordner.'
    default:
      return 'Überprüfen Sie Ihren Spam-Ordner und fügen Sie noreply@omorfodesign.com zu Ihren Kontakten hinzu.'
  }
}
