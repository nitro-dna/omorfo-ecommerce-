import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    console.log('=== EMAIL TEST START ===')
    console.log('Target email:', email)
    console.log('Resend API key available:', !!resendApiKey)
    console.log('Resend instance created:', !!resend)
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    if (!resend) {
      console.error('Resend not configured')
      return NextResponse.json({ error: 'Resend not configured' }, { status: 500 })
    }

    console.log('Attempting to send test email...')
    
    const { data, error } = await resend.emails.send({
      from: 'ómorfo Test <noreply@omorfodesign.com>',
      to: [email], // Now we can send to any email address
      subject: 'Test Email from ómorfo - Newsletter Test',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #1f2937;">Test Email from ómorfo</h1>
          <p>This is a test email to verify that the newsletter functionality is working correctly.</p>
          <p>Requested email: ${email}</p>
          <p>If you receive this email, the newsletter subscription should also work!</p>
          <p>Time sent: ${new Date().toISOString()}</p>
        </div>
      `,
      text: `Test Email from ómorfo\n\nThis is a test email to verify that the newsletter functionality is working correctly.\n\nRequested email: ${email}\n\nIf you receive this email, the newsletter subscription should also work!\n\nTime sent: ${new Date().toISOString()}`
    })

    if (error) {
      console.error('Email send error:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ 
        error: 'Failed to send email', 
        details: error 
      }, { status: 500 })
    }

    console.log('Email sent successfully!')
    console.log('Email data:', JSON.stringify(data, null, 2))
    console.log('=== EMAIL TEST END ===')

    return NextResponse.json({ 
      success: true, 
      message: 'Test email sent successfully!',
      data: data
    })

  } catch (error) {
    console.error('Email test exception:', error)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
