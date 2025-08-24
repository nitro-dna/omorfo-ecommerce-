import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customerEmail, customerName } = body

    if (!customerEmail || !customerName) {
      return NextResponse.json(
        { error: 'Customer email and name are required' },
        { status: 400 }
      )
    }

    console.log('Starting order simulation for:', customerEmail, customerName)

    // Generate test order ID
    const orderId = `TEST-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create test order object
    const testOrder = {
      id: orderId,
      customerEmail,
      customerName,
      total: 49.98,
      items: [
        {
          productName: 'Custom Poster - Test Design',
          quantity: 1,
          price: 29.99,
          size: 'A2',
          frame: 'Premium'
        },
        {
          productName: 'Premium Frame',
          quantity: 1,
          price: 19.99,
          size: 'A2',
          frame: 'Premium'
        }
      ],
      shippingAddress: {
        firstName: customerName.split(' ')[0] || customerName,
        lastName: customerName.split(' ').slice(1).join(' ') || '',
        address: 'Musterstraße 123',
        zipCode: '12345',
        city: 'Musterstadt',
        country: 'Deutschland'
      },
      createdAt: new Date()
    }

    console.log('Test order created:', orderId)

    // Send customer confirmation email
    let customerEmailResult = null
    try {
      console.log('Sending customer confirmation email...')
      const customerEmailHtml = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
            <div style="font-size: 28px; font-weight: bold; margin-bottom: 10px;">ómorfo</div>
            <div style="font-size: 16px; opacity: 0.9;">Custom Posters & Design</div>
          </div>
          
          <div style="padding: 40px 20px; background-color: #ffffff;">
            <h1 style="color: #333; margin-bottom: 20px;">Bestellbestätigung ✅</h1>
            
            <p style="color: #666; line-height: 1.6;">Hallo ${customerName},</p>
            
            <p style="color: #666; line-height: 1.6;">vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und beginnen sofort mit der Bearbeitung.</p>
            
            <div style="background-color: #f8f9fa; border-left: 4px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 0 6px 6px 0;">
              <h3 style="color: #333; margin-top: 0;">Bestelldetails:</h3>
              <p style="margin: 5px 0;"><strong>Bestellnummer:</strong> #${orderId}</p>
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
              <p style="margin: 5px 0;">${testOrder.shippingAddress.firstName} ${testOrder.shippingAddress.lastName}</p>
              <p style="margin: 5px 0;">${testOrder.shippingAddress.address}</p>
              <p style="margin: 5px 0;">${testOrder.shippingAddress.zipCode} ${testOrder.shippingAddress.city}</p>
              <p style="margin: 5px 0;">${testOrder.shippingAddress.country}</p>
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
            
            <div style="color: #6c757d; font-size: 14px; margin-bottom: 10px;">
              © 2024 ómorfo. Alle Rechte vorbehalten.
            </div>
          </div>
        </div>
      `

      const { data: customerData, error: customerError } = await resend.emails.send({
        from: 'ómorfo <noreply@omorfodesign.com>',
        to: [customerEmail],
        subject: `Bestellbestätigung - ómorfo #${orderId}`,
        html: customerEmailHtml
      })

      if (customerError) {
        console.error('Customer email error:', customerError)
        customerEmailResult = { success: false, error: customerError }
      } else {
        console.log('Customer email sent successfully')
        customerEmailResult = { success: true, data: customerData }
      }
    } catch (error) {
      console.error('Customer email exception:', error)
      customerEmailResult = { success: false, error }
    }

    // Send admin notification email
    let adminEmailResult = null
    try {
      console.log('Sending admin notification email...')
      const adminEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b6b; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Neue Bestellung!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Eine neue Bestellung wurde aufgegeben</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Bestelldetails</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Bestellinformationen</h3>
              <p><strong>Bestellnummer:</strong> ${orderId}</p>
              <p><strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}</p>
              <p><strong>Kunde:</strong> ${customerName} (${customerEmail})</p>
              <p><strong>Status:</strong> Bestätigt</p>
              <p><strong>Gesamtbetrag:</strong> €${testOrder.total.toFixed(2)}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Bestellte Artikel</h3>
              ${testOrder.items.map((item: any) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p style="margin: 5px 0;"><strong>${item.productName}</strong></p>
                  <p style="margin: 5px 0; color: #666;">Größe: ${item.size} | Menge: ${item.quantity}</p>
                  <p style="margin: 5px 0; color: #666;">Preis: €${item.price.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Lieferadresse</h3>
              <p>${testOrder.shippingAddress.firstName} ${testOrder.shippingAddress.lastName}</p>
              <p>${testOrder.shippingAddress.address}</p>
              <p>${testOrder.shippingAddress.zipCode} ${testOrder.shippingAddress.city}</p>
              <p>${testOrder.shippingAddress.country}</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Bitte bearbeiten Sie diese Bestellung in Ihrem Admin-Dashboard</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `

      const { data: adminData, error: adminError } = await resend.emails.send({
        from: 'ómorfo <noreply@omorfodesign.com>',
        to: ['omorfodesigned@gmail.com'],
        subject: `Neue Bestellung erhalten - ${orderId}`,
        html: adminEmailHtml
      })

      if (adminError) {
        console.error('Admin email error:', adminError)
        adminEmailResult = { success: false, error: adminError }
      } else {
        console.log('Admin email sent successfully')
        adminEmailResult = { success: true, data: adminData }
      }
    } catch (error) {
      console.error('Admin email exception:', error)
      adminEmailResult = { success: false, error }
    }

    return NextResponse.json({
      success: true,
      message: 'Order simulation completed successfully',
      orderId,
      order: testOrder,
      emails: {
        customer: customerEmailResult,
        admin: adminEmailResult
      }
    })

  } catch (error) {
    console.error('Order simulation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to simulate order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
