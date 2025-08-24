import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

interface TestResult {
  test: string
  success: boolean
  message: string
  details?: any
}

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

    console.log('Starting comprehensive email tests for:', email)
    const results: TestResult[] = []

    // Test 1: Basic Email
    try {
      console.log('Test 1: Basic Email')
      const { data, error } = await resend.emails.send({
        from: 'ómorfo <noreply@omorfodesign.com>',
        to: [email],
        subject: 'Test E-Mail - ómorfo Basic Test',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">Basic Email Test</h1>
            <p>This is a basic email test from ómorfo.</p>
            <p><strong>Test Time:</strong> ${new Date().toLocaleString('de-DE')}</p>
            <p><strong>Recipient:</strong> ${email}</p>
          </div>
        `
      })

      if (error) {
        results.push({
          test: 'Basic Email',
          success: false,
          message: 'Failed to send basic email',
          details: error
        })
      } else {
        results.push({
          test: 'Basic Email',
          success: true,
          message: 'Basic email sent successfully',
          details: data
        })
      }
    } catch (error) {
      results.push({
        test: 'Basic Email',
        success: false,
        message: 'Basic email test failed',
        details: error
      })
    }

    // Test 2: Newsletter Welcome Email
    try {
      console.log('Test 2: Newsletter Welcome Email')
      const { data, error } = await resend.emails.send({
        from: 'ómorfo Newsletter <noreply@omorfodesign.com>',
        to: [email],
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
          </div>
        `
      })

      if (error) {
        results.push({
          test: 'Newsletter Welcome',
          success: false,
          message: 'Failed to send newsletter welcome email',
          details: error
        })
      } else {
        results.push({
          test: 'Newsletter Welcome',
          success: true,
          message: 'Newsletter welcome email sent successfully',
          details: data
        })
      }
    } catch (error) {
      results.push({
        test: 'Newsletter Welcome',
        success: false,
        message: 'Newsletter welcome email test failed',
        details: error
      })
    }

    // Test 3: Order Confirmation Email
    try {
      console.log('Test 3: Order Confirmation Email')
      const orderHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">ómorfo</div>
            <div style="font-size: 16px; opacity: 0.9;">Custom Posters & Design</div>
          </div>
          
          <div style="padding: 40px 20px; background-color: #ffffff;">
            <h1 style="color: #333; margin-bottom: 20px;">Bestellbestätigung ✅</h1>
            
            <p style="color: #666; line-height: 1.6;">Hallo Test Customer,</p>
            
            <p style="color: #666; line-height: 1.6;">vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und beginnen sofort mit der Bearbeitung.</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <h3 style="color: #333; margin-top: 0;">Bestelldetails:</h3>
              <p style="margin: 5px 0;"><strong>Bestellnummer:</strong> #TEST-ORDER-123</p>
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
            
            <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
              © 2024 ómorfo. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      `

      const { data, error } = await resend.emails.send({
        from: 'ómorfo <noreply@omorfodesign.com>',
        to: [email],
        subject: 'Bestellbestätigung - ómorfo #TEST-ORDER-123',
        html: orderHtml
      })

      if (error) {
        results.push({
          test: 'Order Confirmation',
          success: false,
          message: 'Failed to send order confirmation email',
          details: error
        })
      } else {
        results.push({
          test: 'Order Confirmation',
          success: true,
          message: 'Order confirmation email sent successfully',
          details: data
        })
      }
    } catch (error) {
      results.push({
        test: 'Order Confirmation',
        success: false,
        message: 'Order confirmation email test failed',
        details: error
      })
    }

    // Test 4: Admin Notification Email
    try {
      console.log('Test 4: Admin Notification Email')
      const { data, error } = await resend.emails.send({
        from: 'ómorfo Admin <noreply@omorfodesign.com>',
        to: ['omorfodesigned@gmail.com'], // Admin email
        subject: 'New Order Received - #TEST-ORDER-123',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333;">New Order Notification</h1>
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Order Details:</h3>
              <p><strong>Order ID:</strong> #TEST-ORDER-123</p>
              <p><strong>Customer Email:</strong> ${email}</p>
              <p><strong>Amount:</strong> €49.98</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString('de-DE')}</p>
            </div>
            <p>Please review and process this order.</p>
          </div>
        `
      })

      if (error) {
        results.push({
          test: 'Admin Notification',
          success: false,
          message: 'Failed to send admin notification email',
          details: error
        })
      } else {
        results.push({
          test: 'Admin Notification',
          success: true,
          message: 'Admin notification email sent successfully',
          details: data
        })
      }
    } catch (error) {
      results.push({
        test: 'Admin Notification',
        success: false,
        message: 'Admin notification email test failed',
        details: error
      })
    }

    // Calculate summary
    const successCount = results.filter(r => r.success).length
    const totalCount = results.length
    const allSuccessful = successCount === totalCount

    console.log(`Email tests completed: ${successCount}/${totalCount} successful`)

    return NextResponse.json({
      success: allSuccessful,
      message: `Email tests completed: ${successCount}/${totalCount} successful`,
      results: results,
      summary: {
        total: totalCount,
        successful: successCount,
        failed: totalCount - successCount
      }
    })

  } catch (error) {
    console.error('Comprehensive email test error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to run comprehensive email tests',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
