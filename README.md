# Beauty CRM 💅

CRM per estetisti e parrucchieri — React + Vite + Firebase + Hostinger

## 🚀 Per avviare

```bash
cd beauty-crm
npm install
npm run dev
```

Apri **http://localhost:5173** nel browser

## 🌐 Per fare il deploy su Hostinger

```bash
npm run build
# Carica la cartella dist/ su Hostinger via hPanel
```

## 💳 Per attivare i pagamenti Stripe

1. Crea account su stripe.com
2. Recupera chiave segreta (sk_live_...)
3. Crea un prodotto "Beauty CRM Premium" a 9,90€/mese
4. Poi:
```bash
cd beauty-crm
npx firebase login
npx firebase deploy --only functions
npx firebase functions:config:set stripe.secret_key="sk_live_..."
npx firebase functions:config:set stripe.price_monthly="price_abc123"
```

## 📁 Struttura

```
src/
├── pages/         # Login, Dashboard, Calendar, Clients, Services, Settings, Checkout
├── components/    # UI (Button, Card, Modal, Avatar, PremiumGate)
├── hooks/         # useAuth, useSubscription
├── lib/           # firebase.js, helpers
└── types/         # TypeScript interfaces

functions/
└── index.js       # Cloud Functions: Stripe checkout, webhook, WhatsApp reminders
```

## 🎨 Design

- Rosa palette (#FF6B9D → #C44A8C)
- Font Inter
- Mobile-first (bottom tab nav su mobile, sidebar su desktop)
- Italiano 100%