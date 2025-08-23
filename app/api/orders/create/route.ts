import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    const { 
      orderData, 
      paymentIntentId, 
      items, 
      shippingAddress, 
      billingAddress,
      total,
      subtotal,
      shipping,
      discount = 0
    } = body

    // Generate order ID
    const orderId = `OM-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`

    // Create order object
    const order = {
      id: orderId,
      userId: (session?.user as any)?.id || null,
      guestEmail: !(session?.user as any)?.id ? orderData.email : null,
      status: 'CONFIRMED',
      total: parseFloat(total),
      subtotal: parseFloat(subtotal),
      tax: 0, // Tax removed as requested
      shipping: parseFloat(shipping),
      discount: parseFloat(discount),
      shippingAddress,
      billingAddress,
      paymentIntent: paymentIntentId,
      createdAt: new Date(),
      updatedAt: new Date(),
      items: items.map((item: any) => ({
        id: `OI-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        productId: item.productId,
        quantity: item.quantity,
        price: parseFloat(item.price),
        size: item.size,
        frame: item.frame,
        options: item.options || {}
      }))
    }

    // Save order to database (you'll need to implement this with your database)
    console.log('Order created:', orderId)

    // Send notifications
    await sendOrderNotifications(order)

    return NextResponse.json({
      success: true,
      orderId,
      message: 'Order created successfully'
    })

  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

async function sendOrderNotifications(order: any) {
  try {
    // 1. Send confirmation email to customer
    await sendCustomerConfirmationEmail(order)

    // 2. Send notification email to admin
    await sendAdminNotificationEmail(order)

    // 3. Log the notification
    console.log(`Order notifications sent for order: ${order.id}`)

  } catch (error) {
    console.error('Error sending order notifications:', error)
  }
}

async function sendCustomerConfirmationEmail(order: any) {
  const customerEmail = order.guestEmail || order.user?.email
  
  console.log('Sending customer confirmation email to:', customerEmail)
  console.log('Order data:', { guestEmail: order.guestEmail, userEmail: order.user?.email })
  
  if (!customerEmail) {
    console.warn('No customer email found for order confirmation')
    return
  }

  try {
    console.log('Attempting to send email to customer:', customerEmail)
    
    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [customerEmail],
      subject: `Bestellbestätigung - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">ómorfo</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Vielen Dank für Ihre Bestellung!</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Bestellbestätigung</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Bestelldetails</h3>
              <p><strong>Bestellnummer:</strong> ${order.id}</p>
              <p><strong>Datum:</strong> ${new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
              <p><strong>Status:</strong> Bestätigt</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Bestellte Artikel</h3>
              ${order.items.map((item: any) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p style="margin: 5px 0;"><strong>${item.productName || 'Produkt'}</strong></p>
                  <p style="margin: 5px 0; color: #666;">Größe: ${item.size} | Menge: ${item.quantity}</p>
                  <p style="margin: 5px 0; color: #666;">Preis: €${item.price.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #667eea; margin-top: 0;">Zusammenfassung</h3>
              <p><strong>Zwischensumme:</strong> €${order.subtotal.toFixed(2)}</p>
              <p><strong>Versand:</strong> €${order.shipping.toFixed(2)}</p>
              ${order.discount > 0 ? `<p><strong>Rabatt:</strong> -€${order.discount.toFixed(2)}</p>` : ''}
              <p style="font-size: 18px; font-weight: bold; color: #667eea; border-top: 2px solid #eee; padding-top: 10px;">
                <strong>Gesamt:</strong> €${order.total.toFixed(2)}
              </p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #667eea; margin-top: 0;">Lieferadresse</h3>
              <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.zipCode} ${order.shippingAddress.city}</p>
              <p>${order.shippingAddress.country}</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Fragen? Kontaktieren Sie uns unter support@omorfodesign.com</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        Bestellbestätigung - ${order.id}
        
        Vielen Dank für Ihre Bestellung bei ómorfo!
        
        Bestelldetails:
        - Bestellnummer: ${order.id}
        - Datum: ${new Date(order.createdAt).toLocaleDateString('de-DE')}
        - Status: Bestätigt
        
        Bestellte Artikel:
        ${order.items.map((item: any) => 
          `- ${item.productName || 'Produkt'} (${item.size}, ${item.quantity}x) - €${item.price.toFixed(2)}`
        ).join('\n')}
        
        Zusammenfassung:
        - Zwischensumme: €${order.subtotal.toFixed(2)}
        - Versand: €${order.shipping.toFixed(2)}
        ${order.discount > 0 ? `- Rabatt: -€${order.discount.toFixed(2)}` : ''}
        - Gesamt: €${order.total.toFixed(2)}
        
        Lieferadresse:
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
        ${order.shippingAddress.address}
        ${order.shippingAddress.zipCode} ${order.shippingAddress.city}
        ${order.shippingAddress.country}
        
        Fragen? Kontaktieren Sie uns unter support@omorfodesign.com
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending customer confirmation email:', error)
      console.error('Resend error details:', { error, data })
    } else {
      console.log('Customer confirmation email sent successfully to:', customerEmail)
      console.log('Resend response:', { data })
    }

  } catch (error) {
    console.error('Error sending customer confirmation email:', error)
    console.error('Full error details:', error)
  }
}

async function sendAdminNotificationEmail(order: any) {
  const adminEmail = process.env.ADMIN_EMAIL || 'omorfodesigned@gmail.com'
  
  try {
    const { data, error } = await resend.emails.send({
      from: 'ómorfo <noreply@omorfodesign.com>',
      to: [adminEmail],
      subject: `Neue Bestellung erhalten - ${order.id}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #ff6b6b; padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Neue Bestellung!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Eine neue Bestellung wurde aufgegeben</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Bestelldetails</h2>
            
            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Bestellinformationen</h3>
              <p><strong>Bestellnummer:</strong> ${order.id}</p>
              <p><strong>Datum:</strong> ${new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
              <p><strong>Kunde:</strong> ${order.guestEmail || order.user?.email || 'Unbekannt'}</p>
              <p><strong>Status:</strong> ${order.status}</p>
              <p><strong>Gesamtbetrag:</strong> €${order.total.toFixed(2)}</p>
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Bestellte Artikel</h3>
              ${order.items.map((item: any) => `
                <div style="border-bottom: 1px solid #eee; padding: 10px 0;">
                  <p style="margin: 5px 0;"><strong>${item.productName || 'Produkt'}</strong></p>
                  <p style="margin: 5px 0; color: #666;">Größe: ${item.size} | Menge: ${item.quantity}</p>
                  <p style="margin: 5px 0; color: #666;">Preis: €${item.price.toFixed(2)}</p>
                </div>
              `).join('')}
            </div>

            <div style="background: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #ff6b6b; margin-top: 0;">Lieferadresse</h3>
              <p>${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
              <p>${order.shippingAddress.address}</p>
              <p>${order.shippingAddress.zipCode} ${order.shippingAddress.city}</p>
              <p>${order.shippingAddress.country}</p>
            </div>
          </div>

          <div style="background: #333; padding: 20px; text-align: center; color: white;">
            <p style="margin: 0;">Bitte bearbeiten Sie diese Bestellung in Ihrem Admin-Dashboard</p>
            <p style="margin: 10px 0 0 0; font-size: 12px;">© 2024 ómorfo. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      `,
      text: `
        Neue Bestellung erhalten - ${order.id}
        
        Eine neue Bestellung wurde aufgegeben:
        
        Bestellinformationen:
        - Bestellnummer: ${order.id}
        - Datum: ${new Date(order.createdAt).toLocaleDateString('de-DE')}
        - Kunde: ${order.guestEmail || order.user?.email || 'Unbekannt'}
        - Status: ${order.status}
        - Gesamtbetrag: €${order.total.toFixed(2)}
        
        Bestellte Artikel:
        ${order.items.map((item: any) => 
          `- ${item.productName || 'Produkt'} (${item.size}, ${item.quantity}x) - €${item.price.toFixed(2)}`
        ).join('\n')}
        
        Lieferadresse:
        ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}
        ${order.shippingAddress.address}
        ${order.shippingAddress.zipCode} ${order.shippingAddress.city}
        ${order.shippingAddress.country}
        
        Bitte bearbeiten Sie diese Bestellung in Ihrem Admin-Dashboard.
        
        © 2024 ómorfo. Alle Rechte vorbehalten.
      `
    })

    if (error) {
      console.error('Error sending admin notification email:', error)
    } else {
      console.log('Admin notification email sent successfully')
    }

  } catch (error) {
    console.error('Error sending admin notification email:', error)
  }
}
