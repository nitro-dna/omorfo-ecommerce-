import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'
import { Resend } from 'resend'

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

const unsubscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validation = unsubscribeSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    const { email } = validation.data

    // For now, just simulate successful unsubscribe
    // TODO: Uncomment when database tables are created
    /*
    // Check if email is subscribed
    const { data: subscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, is_active')
      .eq('email', email)
      .single()

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email is not subscribed to the newsletter' },
        { status: 404 }
      )
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { error: 'Email is already unsubscribed' },
        { status: 409 }
      )
    }

    // Unsubscribe the user
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)

    if (updateError) {
      console.error('Newsletter unsubscribe error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe from newsletter' },
        { status: 500 }
      )
    }

    // Log unsubscribe action
    try {
      await supabase
        .from('newsletter_logs')
        .insert({
          email: email,
          action: 'unsubscribe',
          created_at: new Date().toISOString()
        })
    } catch (logError) {
      // Don't fail the unsubscribe if logging fails
      console.error('Newsletter log error:', logError)
    }
    */

    // Send confirmation email
    if (resend) {
      try {
        const { data: emailData, error: emailError } = await resend.emails.send({
          from: 'ómorfo Newsletter <noreply@omorfodesign.com>',
          to: [email],
          subject: 'You have been unsubscribed from ómorfo Newsletter',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #1f2937; margin-bottom: 10px;">Unsubscribed Successfully</h1>
                <p style="color: #6b7280; font-size: 18px;">You have been unsubscribed from our newsletter</p>
              </div>
              
              <div style="background-color: #f8fafc; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
                <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  We're sorry to see you go! You have been successfully unsubscribed from the ómorfo newsletter.
                </p>
                <p style="color: #374151; line-height: 1.6; margin-bottom: 20px;">
                  If you change your mind, you can always resubscribe by visiting our website and signing up again.
                </p>
              </div>
              
              <div style="text-align: center; margin-bottom: 30px;">
                <a href="https://omorfodesign.com" 
                   style="background-color: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  Visit Our Website
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
Unsubscribed Successfully

You have been unsubscribed from the ómorfo newsletter.

We're sorry to see you go! You have been successfully unsubscribed from our newsletter.

If you change your mind, you can always resubscribe by visiting our website and signing up again.

Visit our website: https://omorfodesign.com

© 2025 ómorfo. All rights reserved.
This email was sent to ${email}
          `
        })

        if (emailError) {
          console.error('Newsletter unsubscribe email error:', emailError)
          // Don't fail the unsubscribe if email fails
        } else {
          console.log('Newsletter unsubscribe email sent:', emailData)
        }
      } catch (emailException) {
        console.error('Newsletter email exception:', emailException)
        // Don't fail the unsubscribe if email fails
      }
    } else {
      console.warn('Resend not configured - skipping unsubscribe email')
    }

    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      data: {
        email: email,
        unsubscribed_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Newsletter unsubscribe API error:', error)
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

    // For now, just simulate unsubscribe via GET
    // TODO: Uncomment when database tables are created
    /*
    // Check if email is subscribed
    const { data: subscriber } = await supabase
      .from('newsletter_subscribers')
      .select('id, email, is_active')
      .eq('email', email)
      .single()

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Email is not subscribed to the newsletter' },
        { status: 404 }
      )
    }

    if (!subscriber.is_active) {
      return NextResponse.json(
        { error: 'Email is already unsubscribed' },
        { status: 409 }
      )
    }

    // Unsubscribe the user
    const { error: updateError } = await supabase
      .from('newsletter_subscribers')
      .update({
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq('email', email)

    if (updateError) {
      console.error('Newsletter unsubscribe error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe from newsletter' },
        { status: 500 }
      )
    }
    */

    // Simulate successful unsubscribe
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
      data: {
        email: email,
        unsubscribed_at: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Newsletter unsubscribe API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
