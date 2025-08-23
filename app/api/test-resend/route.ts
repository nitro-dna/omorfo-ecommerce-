import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function GET() {
  try {
    console.log('Testing Resend configuration...')
    console.log('API Key available:', !!resendApiKey)
    console.log('API Key starts with re_:', resendApiKey?.startsWith('re_'))
    
    if (!resend) {
      return NextResponse.json(
        { error: 'Resend API key not configured' },
        { status: 400 }
      )
    }

    // Test email
    const { data, error } = await resend.emails.send({
      from: 'ómorfo Test <noreply@omorfodesign.com>',
      to: ['omorfodesigned@gmail.com'],
      subject: 'Test Email from ómorfo Contact Form',
      text: 'This is a test email to verify Resend is working correctly.',
    })

    if (error) {
      console.error('Resend test error:', error)
      return NextResponse.json(
        { error: `Resend test failed: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Resend test successful:', data)
    return NextResponse.json(
      { success: true, message: 'Test email sent successfully!' },
      { status: 200 }
    )

  } catch (error) {
    console.error('Resend test exception:', error)
    return NextResponse.json(
      { error: `Resend test failed: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
}
