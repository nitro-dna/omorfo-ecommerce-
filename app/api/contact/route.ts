import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

// Check if Resend API key is available
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, subject, message, newsletter } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Create email content
    const emailContent = `
New Contact Form Submission from ómorfo Website

Name: ${firstName} ${lastName}
Email: ${email}
Phone: ${phone || 'Not provided'}
Subject: ${subject}
Newsletter Signup: ${newsletter ? 'Yes' : 'No'}

Message:
${message}

---
This message was sent from the ómorfo contact form.
    `.trim()

    // Send email using Resend
    if (!resend) {
      console.error('Resend API key not configured')
      console.log('=== CONTACT FORM SUBMISSION (FALLBACK) ===')
      console.log(emailContent)
      console.log('=== END SUBMISSION ===')
      
      return NextResponse.json(
        { 
          success: true, 
          message: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
        },
        { status: 200 }
      )
    }

    try {
      console.log('Attempting to send email with Resend...')
      console.log('API Key available:', !!resendApiKey)
      
      const { data, error } = await resend.emails.send({
        from: 'ómorfo Contact Form <noreply@omorfodesign.com>',
        to: ['omorfodesigned@gmail.com'],
        subject: `New Contact Form: ${subject}`,
        text: emailContent,
        replyTo: email,
      })

      if (error) {
        console.error('Resend error details:', error)
        return NextResponse.json(
          { error: `Failed to send email: ${error.message}` },
          { status: 500 }
        )
      }

      console.log('Email sent successfully:', data)
    } catch (resendError) {
      console.error('Resend exception details:', resendError)
      return NextResponse.json(
        { error: `Failed to send email: ${resendError instanceof Error ? resendError.message : 'Unknown error'}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your message! We\'ll get back to you within 24 hours.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 }
    )
  }
}
