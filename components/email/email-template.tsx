import React from 'react'

interface EmailTemplateProps {
  children: React.ReactNode
  title?: string
  previewText?: string
}

export function EmailTemplate({ children, title, previewText }: EmailTemplateProps) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || 'ómorfo - Custom Posters'}</title>
        {previewText && (
          <meta name="description" content={previewText} />
        )}
        <style>{`
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f9fafb;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 20px;
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .tagline {
            font-size: 16px;
            opacity: 0.9;
          }
          .content {
            padding: 40px 20px;
          }
          .footer {
            background-color: #f8f9fa;
            padding: 30px 20px;
            text-align: center;
            border-top: 1px solid #e9ecef;
          }
          .footer-text {
            color: #6c757d;
            font-size: 14px;
            margin-bottom: 15px;
          }
          .social-links {
            margin-bottom: 20px;
          }
          .social-link {
            display: inline-block;
            margin: 0 10px;
            color: #6c757d;
            text-decoration: none;
          }
          .social-link:hover {
            color: #495057;
          }
          .unsubscribe {
            font-size: 12px;
            color: #adb5bd;
          }
          .unsubscribe a {
            color: #adb5bd;
            text-decoration: none;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            margin: 10px 0;
          }
          .button:hover {
            background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          }
          .highlight-box {
            background-color: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 6px 6px 0;
          }
          .order-summary {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .order-item {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #e9ecef;
          }
          .order-item:last-child {
            border-bottom: none;
          }
          .total {
            font-weight: bold;
            font-size: 18px;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 2px solid #e9ecef;
          }
          @media only screen and (max-width: 600px) {
            .email-container {
              margin: 0;
              border-radius: 0;
            }
            .content {
              padding: 20px 15px;
            }
            .header {
              padding: 20px 15px;
            }
            .footer {
              padding: 20px 15px;
            }
          }
        `}</style>
      </head>
      <body>
        <div className="email-container">
          <div className="header">
            <div className="logo">ómorfo</div>
            <div className="tagline">Custom Posters & Design</div>
          </div>
          
          <div className="content">
            {children}
          </div>
          
          <div className="footer">
            <div className="footer-text">
              Vielen Dank für Ihr Vertrauen in ómorfo
            </div>
            
            <div className="social-links">
              <a href="#" className="social-link">Instagram</a>
              <a href="#" className="social-link">Facebook</a>
              <a href="#" className="social-link">Twitter</a>
            </div>
            
            <div className="footer-text">
              © 2024 ómorfo. Alle Rechte vorbehalten.
            </div>
            
            <div className="unsubscribe">
              <a href="/unsubscribe">Newsletter abbestellen</a>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}

// Specific email templates
export function WelcomeEmail({ customerName }: { customerName: string }) {
  return (
    <EmailTemplate 
      title="Willkommen bei ómorfo!"
      previewText="Entdecken Sie unsere custom Poster und Designs"
    >
      <h1>Willkommen bei ómorfo! 🎨</h1>
      
      <p>Hallo {customerName},</p>
      
      <p>herzlich willkommen bei ómorfo! Wir freuen uns, dass Sie sich für unsere custom Poster und Designs interessieren.</p>
      
      <div className="highlight-box">
        <h3>Was Sie bei uns erwartet:</h3>
        <ul>
          <li>🎨 Einzigartige custom Poster</li>
          <li>✨ Persönliche Designs</li>
          <li>🚀 Schnelle Lieferung</li>
          <li>💎 Premium Qualität</li>
        </ul>
      </div>
      
      <p>Stöbern Sie in unserer Kollektion und lassen Sie Ihrer Kreativität freien Lauf!</p>
      
      <a href="/" className="button">Jetzt entdecken</a>
      
      <p>Bei Fragen stehen wir Ihnen gerne zur Verfügung.</p>
      
      <p>Beste Grüße,<br />Ihr ómorfo Team</p>
    </EmailTemplate>
  )
}

export function OrderConfirmationEmail({ 
  orderId, 
  customerName, 
  orderItems, 
  totalAmount,
  shippingAddress 
}: {
  orderId: string
  customerName: string
  orderItems: Array<{ name: string; quantity: number; price: number }>
  totalAmount: number
  shippingAddress: string
}) {
  return (
    <EmailTemplate 
      title="Bestellbestätigung - ómorfo"
      previewText={`Ihre Bestellung #${orderId} wurde erfolgreich aufgegeben`}
    >
      <h1>Bestellbestätigung ✅</h1>
      
      <p>Hallo {customerName},</p>
      
      <p>vielen Dank für Ihre Bestellung! Wir haben Ihre Bestellung erfolgreich erhalten und beginnen sofort mit der Bearbeitung.</p>
      
      <div className="highlight-box">
        <h3>Bestelldetails:</h3>
        <p><strong>Bestellnummer:</strong> #{orderId}</p>
        <p><strong>Bestelldatum:</strong> {new Date().toLocaleDateString('de-DE')}</p>
      </div>
      
      <div className="order-summary">
        <h3>Ihre Bestellung:</h3>
        {orderItems.map((item, index) => (
          <div key={index} className="order-item">
            <span>{item.name} (x{item.quantity})</span>
            <span>{(item.price * item.quantity).toFixed(2)} €</span>
          </div>
        ))}
        <div className="order-item total">
          <span>Gesamtbetrag:</span>
          <span>{totalAmount.toFixed(2)} €</span>
        </div>
      </div>
      
      <div className="highlight-box">
        <h3>Lieferadresse:</h3>
        <p>{shippingAddress}</p>
      </div>
      
      <p>Wir werden Sie über den Status Ihrer Bestellung auf dem Laufenden halten.</p>
      
      <a href="/account" className="button">Bestellung verfolgen</a>
      
      <p>Bei Fragen erreichen Sie uns unter: support@omorfodesign.com</p>
      
      <p>Beste Grüße,<br />Ihr ómorfo Team</p>
    </EmailTemplate>
  )
}

export function NewsletterEmail({ 
  subject, 
  content 
}: {
  subject: string
  content: string
}) {
  return (
    <EmailTemplate 
      title={subject}
      previewText="Neueste Updates und Angebote von ómorfo"
    >
      <h1>{subject}</h1>
      
      <div dangerouslySetInnerHTML={{ __html: content }} />
      
      <a href="/" className="button">Shop besuchen</a>
      
      <p>Beste Grüße,<br />Ihr ómorfo Team</p>
    </EmailTemplate>
  )
}
