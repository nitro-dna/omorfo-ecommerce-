import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = subscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // For now, just simulate successful subscription
    // TODO: Uncomment when database tables are created
    /*
    // Check if email already exists
    const { data: existingSubscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id')
      .eq('email', email)
      .single()

    if (existingSubscriber) {
      return NextResponse.json(
        { error: 'Email is already subscribed to the newsletter' },
        { status: 409 }
      )
    }

    // Add subscriber to database
    const { data: subscriber, error } = await supabase
      .from('newsletter_subscribers')
      .insert({
        email: email,
        subscribed_at: new Date().toISOString(),
        is_active: true
      })
      .select()
      .single()

    if (error) {
      console.error('Newsletter subscription error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe to newsletter' },
        { status: 500 }
      )
    }

    // Log subscription for analytics
    try {
      await supabase
        .from('newsletter_logs')
        .insert({
          email: email,
          action: 'subscribe',
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      // Don't fail the subscription if logging fails
      console.error('Newsletter log error:', logError)
    }
    */

    // Simulate successful subscription
    const subscriber = {
      id: 'temp-' + Date.now(),
      email: email,
      subscribed_at: new Date().toISOString()
    }

    // Send welcome email
    let emailResult = null
    let emailError = null
    
    console.log('Attempting to send welcome email to:', email)
    console.log('Resend configured:', !!resend)
    console.log('Resend API key available:', !!resendApiKey)
    
    if (resend) {
      try {
        console.log('Sending email via Resend...')
        const { data: emailData, error: emailSendError } = await resend.emails.send({
          from: 'ómorfo Newsletter <noreply@omorfodesign.com>',
          to: [email], // Now we can send to any email address
          subject: 'Welcome to ómorfo Newsletter! 🎉',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f2937; margin-bottom: 10px;">Welcome to ómorfo!</h1>
                <p style="color: #6b7280; font-size: 18px;">Thank you for subscribing to our newsletter</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                <h2 style="color: #1f2937; margin-bottom: 20px;">What to expect:</h2>
                <ul style="color: #374151; line-height: 1.6;">
                  <li>🎨 Latest poster designs and collections</li>
                  <li>🏷️ Exclusive discounts and special offers</li>
                  <li>💡 Interior design tips and inspiration</li>
                  <li>📦 New product announcements</li>
                  <li>🎯 Personalized recommendations</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://omorfodesign.com/shop" 
                   style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Explore Our Shop
                </a>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                  You can unsubscribe at any time by clicking the link below.
                </p>
                <a href="https://omorfodesign.com/unsubscribe?email=${encodeURIComponent(email)}" 
                   style="color: #6b7280; font-size: 14px; text-decoration: underline;">
                  Unsubscribe
                </a>
              </div>
              
              <div style="margin-top: 30px; padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                <p style="color: #6b7280; font-size: 12px; margin: 0; text-align: center;">
                  © 2025 ómorfo. All rights reserved.<br>
                  This email was sent to ${email}
                </p>
              </div>
            </div>
          `,
          text: `
Welcome to ómorfo Newsletter!

Thank you for subscribing to our newsletter! We're excited to share our latest poster designs, exclusive offers, and interior design inspiration with you.

What to expect:
- Latest poster designs and collections
- Exclusive discounts and special offers  
- Interior design tips and inspiration
- New product announcements
- Personalized recommendations

Explore our shop: https://omorfodesign.com/shop

You can unsubscribe at any time: https://omorfodesign.com/unsubscribe?email=${encodeURIComponent(email)}

© 2025 ómorfo. All rights reserved.
This email was sent to ${email}
          `
        })

        if (emailSendError) {
          console.error('Newsletter welcome email error:', emailSendError)
          console.error('Error details:', JSON.stringify(emailSendError, null, 2))
          emailError = emailSendError
          // Don't fail the subscription if email fails
        } else {
          console.log('Newsletter welcome email sent successfully!')
          console.log('Email data:', JSON.stringify(emailData, null, 2))
          emailResult = emailData
        }
      } catch (emailException) {
        console.error('Newsletter email exception:', emailException)
        console.error('Exception details:', JSON.stringify(emailException, null, 2))
        emailError = emailException
        // Don't fail the subscription if email fails
      }
    } else {
      console.warn('Resend not configured - skipping welcome email')
      console.warn('Resend API key:', resendApiKey ? 'Available' : 'Missing')
      emailError = { message: 'Resend not configured' }
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      data: {
        id: subscriber.id,
        email: subscriber.email,
        subscribed_at: subscriber.subscribed_at,
        email_sent: !!emailResult,
        email_result: emailResult,
        email_error: emailError
      }
    })

  } catch (error) {
    console.error('Newsletter subscription API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')

    if (!email) {
      return NextResponse.json(
        { error: 'Email parameter is required' },
        { status: 400 }
      )
    }

    // For now, just simulate subscription check
    // TODO: Uncomment when database tables are created
    /*
    // Check if email is subscribed
    const { data: subscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, subscribed_at, is_active')
      .eq('email', email)
      .single()

    return NextResponse.json({
      success: true,
      isSubscribed: !!subscriber && subscriber.is_active,
      data: subscriber || null
    })
    */

    // Simulate subscription check
    return NextResponse.json({
      success: true,
      isSubscribed: false, // Always return false for now
      data: null
    })

  } catch (error) {
    console.error('Newsletter check API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
