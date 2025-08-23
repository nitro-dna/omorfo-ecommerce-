# Stripe Setup Guide für ómorfo

## 🔧 **Schritt-für-Schritt Anleitung**

### **1. Stripe-Konto erstellen**
1. Gehen Sie zu [stripe.com](https://stripe.com)
2. Klicken Sie auf "Start now" oder "Sign up"
3. Erstellen Sie ein kostenloses Konto
4. Verifizieren Sie Ihre E-Mail-Adresse
5. Füllen Sie Ihr Geschäftsprofil aus

### **2. API-Keys finden**
1. Nach der Anmeldung klicken Sie auf "Developers" im linken Menü
2. Klicken Sie auf "API keys"
3. Sie sehen zwei wichtige Keys:
   - **Publishable key** (beginnt mit `pk_test_` oder `pk_live_`)
   - **Secret key** (beginnt mit `sk_test_` oder `sk_live_`)

### **3. Test vs Live Keys**
- **Test-Keys** (mit `_test_`): Für Entwicklung und Tests
- **Live-Keys** (mit `_live_`): Für echte Zahlungen

**Für die Entwicklung empfehlen wir Test-Keys!**

### **4. Keys in .env.local eintragen**
Öffnen Sie Ihre `.env.local` Datei und ersetzen Sie die Stripe-Keys:

```env
# Stripe (Test Keys für Entwicklung)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_IHR_TEST_PUBLISHABLE_KEY"
STRIPE_SECRET_KEY="sk_test_IHR_TEST_SECRET_KEY"
```

### **5. Server neu starten**
```bash
npm run dev
```

### **6. Testen**
1. Gehen Sie zu `/test` auf Ihrer Website
2. Klicken Sie auf "Teste Stripe"
3. Sie sollten eine erfolgreiche Antwort sehen

## 🚨 **Wichtige Hinweise**

### **Für Entwicklung (empfohlen):**
- Verwenden Sie **Test-Keys** (`pk_test_` und `sk_test_`)
- Diese sind kostenlos und sicher
- Sie können Test-Zahlungen simulieren

### **Für Produktion:**
- Verwenden Sie **Live-Keys** (`pk_live_` und `sk_live_`)
- Diese sind für echte Zahlungen
- Erfordern vollständige Stripe-Verifizierung

### **Test-Kreditkarten:**
Mit Test-Keys können Sie diese Test-Karten verwenden:
- **Visa**: 4242 4242 4242 4242
- **Mastercard**: 5555 5555 5555 4444
- **Beliebiger zukünftiger Ablauf**: 12/25
- **Beliebige 3-stellige CVC**: 123

## 🔍 **Troubleshooting**

### **"Invalid API Key" Fehler:**
- Überprüfen Sie, ob die Keys korrekt kopiert wurden
- Stellen Sie sicher, dass Sie Test-Keys für Entwicklung verwenden
- Starten Sie den Server neu nach Änderungen

### **"Failed to initialize payment" Fehler:**
- Überprüfen Sie die Server-Logs
- Stellen Sie sicher, dass beide Keys gesetzt sind
- Testen Sie mit der `/test` Seite

### **Mock-Stripe (Fallback):**
Wenn keine gültigen Stripe-Keys gefunden werden, verwendet die App automatisch Mock-Stripe für die Entwicklung.

## 📞 **Support**
- Stripe Support: [support.stripe.com](https://support.stripe.com)
- Stripe Dokumentation: [stripe.com/docs](https://stripe.com/docs)
