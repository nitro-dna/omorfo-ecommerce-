# 🚀 Supabase Migration Guide für ómorfo

## 📋 Schritt-für-Schritt Anleitung

### 1. Supabase Projekt erstellen

1. **Gehe zu [supabase.com](https://supabase.com)**
2. **Erstelle ein kostenloses Konto**
3. **Klicke auf "New Project"**
4. **Wähle deine Organisation**
5. **Projekt-Name:** `omorfo-ecommerce`
6. **Database Password:** Wähle ein sicheres Passwort
7. **Region:** Wähle die nächstgelegene Region (z.B. West Europe)
8. **Klicke auf "Create new project"**

### 2. Environment Variables setzen

Nach der Projekterstellung findest du die Keys unter:
**Settings → API → Project API keys**

Füge diese zu deiner `.env.local` hinzu:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project-id.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
```

### 3. Database Schema erstellen

1. **Gehe zu SQL Editor** in deinem Supabase Dashboard
2. **Kopiere den Inhalt von `supabase-schema.sql`**
3. **Führe das SQL aus**

### 4. Sample Data hinzufügen

1. **Gehe wieder zu SQL Editor**
2. **Kopiere den Inhalt von `supabase-sample-data.sql`**
3. **Führe das SQL aus**

### 5. Row Level Security (RLS) testen

Die RLS-Policies sind bereits im Schema enthalten. Teste sie:

```sql
-- Teste öffentlichen Zugriff auf Produkte
SELECT * FROM products LIMIT 5;

-- Teste Kategorie-Zugriff
SELECT * FROM categories;
```

### 6. API Routes testen

```bash
# Teste die neuen Supabase API Routes
curl -X GET "http://localhost:3000/api/supabase/products"

# Teste einzelnes Produkt
curl -X GET "http://localhost:3000/api/supabase/products/abstract-geometric-harmony"

# Teste mit Parametern
curl -X GET "http://localhost:3000/api/supabase/products?featured=true&limit=3"
```

### 7. Frontend Integration

Die API Routes sind bereit! Du kannst jetzt:

1. **Mock-Daten entfernen** aus den Komponenten
2. **Supabase API Routes verwenden** statt der alten Prisma Routes
3. **Real-time Features hinzufügen** mit Supabase Subscriptions

## 🔧 Nützliche Supabase Features

### Real-time Subscriptions
```typescript
// Live Cart Updates
const { data: cartItems } = supabase
  .channel('cart-updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'cart_items' },
    (payload) => {
      console.log('Cart updated:', payload)
    }
  )
  .subscribe()
```

### Storage für Bilder
```typescript
// Bild hochladen
const { data, error } = await supabase.storage
  .from('product-images')
  .upload('path/to/image.jpg', file)
```

### Auth Integration
```typescript
// User Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
})
```

## 📊 Migration Checklist

- [ ] Supabase Projekt erstellt
- [ ] Environment Variables gesetzt
- [ ] Database Schema erstellt
- [ ] Sample Data hinzugefügt
- [ ] API Routes getestet
- [ ] Frontend auf Supabase umgestellt
- [ ] Auth migriert
- [ ] Real-time Features implementiert

## 🎯 Nächste Schritte

1. **Supabase Projekt erstellen** (5 Minuten)
2. **Schema migrieren** (10 Minuten)
3. **API Routes testen** (15 Minuten)
4. **Frontend anpassen** (30 Minuten)

## 💡 Tipps

- **Backup:** Exportiere deine aktuellen Daten vor der Migration
- **Testing:** Teste alle Features nach der Migration
- **Performance:** Supabase ist sehr schnell, aber monitor die Performance
- **Costs:** Free Tier ist sehr großzügig (500MB DB, 50MB Storage)

## 🆘 Support

Bei Problemen:
1. **Supabase Docs:** [supabase.com/docs](https://supabase.com/docs)
2. **Discord Community:** [supabase.com/discord](https://supabase.com/discord)
3. **GitHub Issues:** [github.com/supabase/supabase](https://github.com/supabase/supabase)

---

**Viel Erfolg mit der Migration! ��**
