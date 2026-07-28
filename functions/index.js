const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { onSchedule } = require('firebase-functions/v2/scheduler');

admin.initializeApp();
const db = admin.firestore();

/**
 * Crea una sessione Stripe Checkout per l'abbonamento Premium
 */
exports.createCheckoutSession = functions.https.onCall(
  async (data, context) => {
    functions.logger.info('createCheckoutSession called', {
      hasAuth: !!context.auth,
      authUid: context.auth?.uid,
      dataKeys: Object.keys(data || {}),
      dataUserId: data?.userId,
      dataEmail: data?.email,
    });

    // Prefer context.auth (token), fallback to explicit params
    const userId = context.auth?.uid || data?.userId;
    const email = context.auth?.token?.email || data?.email;

    if (!userId) {
      functions.logger.error('No userId found — auth and data both empty', {
        hasAuth: !!context.auth,
        data: JSON.stringify(data),
      });
      throw new functions.https.HttpsError(
        'unauthenticated', 'Devi essere loggato per passare a Premium'
      );
    }

    // Ottieni dati utente
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Utente non trovato');
    }
    const userEmail = email || userData?.email;
    if (!userEmail) {
      throw new functions.https.HttpsError('failed-precondition', 'Email utente mancante');
    }

    const stripeSecretKey = functions.config().stripe.secret_key;
    if (!stripeSecretKey) {
      functions.logger.error('Stripe secret key not configured');
      throw new functions.https.HttpsError('internal', 'Stripe non configurato');
    }

    const stripe = require('stripe')(stripeSecretKey);

    const priceId = data.priceId || functions.config().stripe.price_monthly;
    const appUrl = functions.config().app.url;

    functions.logger.info(`Creating checkout session for user ${userId}, price=${priceId}, appUrl=${appUrl}`);

    try {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        customer_email: userEmail,
        client_reference_id: userId,
        metadata: { userId },
        success_url: `${appUrl}/dashboard?upgrade=success`,
        cancel_url: `${appUrl}/settings`,
      });

      functions.logger.info(`Checkout session created: ${session.id}`);
      return { url: session.url };
    } catch (stripeErr) {
      functions.logger.error('Stripe error:', stripeErr?.message || stripeErr, {
        type: stripeErr?.type,
        code: stripeErr?.code,
        statusCode: stripeErr?.statusCode,
      });
      throw new functions.https.HttpsError('internal', `Errore Stripe: ${stripeErr?.message || 'errore sconosciuto'}`);
    }
  }
);

/**
 * Webhook Stripe — chiamato da Stripe dopo eventi di pagamento
 */
exports.stripeWebhook = functions.https.onRequest(
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = require('stripe')(functions.config().stripe.secret_key);

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, functions.config().stripe.webhook_secret);
    } catch (err) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    const session = event.data.object;

    switch (event.type) {
      case 'checkout.session.completed':
        if (session.mode === 'subscription' && session.payment_status === 'paid') {
          const userId = session.metadata.userId || session.client_reference_id;
          await db.collection('users').doc(userId).update({
            isPremium: true,
            premiumSince: admin.firestore.FieldValue.serverTimestamp(),
            stripeCustomerId: session.customer,
            stripeSubscriptionId: session.subscription,
          });
          functions.logger.info(`User ${userId} upgraded to Premium`);
        }
        break;

      case 'customer.subscription.deleted':
        const userSnapshot = await db.collection('users')
          .where('stripeCustomerId', '==', session.customer)
          .get();
        userSnapshot.forEach(async (doc) => {
          await db.collection('users').doc(doc.id).update({
            isPremium: false,
          });
          functions.logger.info(`User ${doc.id} downgraded from Premium`);
        });
        break;
    }

    res.json({ received: true });
  }
);

/**
 * Promemoria WhatsApp giornalieri (Premium)
 * Ogni giorno alle 8:00 (Europe/Rome)
 * Invia via Meta WhatsApp Cloud API (credenziali centralizzate Beauty CRM)
 */
exports.sendWhatsAppReminders = onSchedule(
   { schedule: '0 8 * * *', timeZone: 'Europe/Rome' },
   async (event) => {
     const tomorrow = new Date();
     tomorrow.setDate(tomorrow.getDate() + 1);
     tomorrow.setHours(0, 0, 0, 0);

     const dayAfter = new Date(tomorrow);
     dayAfter.setDate(dayAfter.getDate() + 1);

     // Legge credenziali centralizzate dalle Firebase Functions config
     const waPhoneNumberId = functions.config().whatsapp?.phone_number_id;
     const waAccessToken = functions.config().whatsapp?.access_token;

     if (!waPhoneNumberId || !waAccessToken) {
       functions.logger.error('WhatsApp API not configured — set firebase functions:config:set whatsapp.phone_number_id=... whatsapp.access_token=...');
       return;
     }

     const snapshot = await db.collection('appointments')
       .where('startTime', '>=', tomorrow)
       .where('startTime', '<', dayAfter)
       .where('status', '==', 'confirmed')
       .where('reminderSent', '==', false)
       .get();

     if (snapshot.empty) {
       functions.logger.info('No appointments tomorrow — skipping reminders');
       return;
     }

     const sent = [];
     const errors = [];

     for (const doc of snapshot) {
       const appointment = doc.data();
       const userDoc = await db.collection('users').doc(appointment.userId).get();
       const user = userDoc.data();

       // Salta se: non Premium, reminder disabilitato, o niente telefono cliente
       if (!user?.isPremium) continue;
       if (!user?.settings?.reminderEnabled) continue;
       if (!appointment.clientPhone) continue;

       const startTime = appointment.startTime.toDate();
       const time = startTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
       const salonName = user.salonName || 'Salone';

       // Pulisce numero cliente: rimuove +, spazi, trattini
       const cleanPhone = appointment.clientPhone.replace(/[^\d]/g, '');
       const to = cleanPhone.startsWith('39') ? cleanPhone : `39${cleanPhone}`;

       try {
         // Meta WhatsApp Cloud API — usa template (obbligatorio per messaggi proattivi)
         const response = await fetch(
           `https://graph.facebook.com/v21.0/${waPhoneNumberId}/messages`,
           {
             method: 'POST',
             headers: {
               'Authorization': `Bearer ${waAccessToken}`,
               'Content-Type': 'application/json',
             },
             body: JSON.stringify({
               messaging_product: 'whatsapp',
               recipient_type: 'individual',
               to: to,
               type: 'template',
               template: {
                 name: 'appointment_reminder',
                 language: { code: 'it' },
                 components: [{
                   type: 'body',
                   parameters: [
                     { type: 'text', text: appointment.clientName },
                     { type: 'text', text: salonName },
                     { type: 'text', text: time },
                     { type: 'text', text: appointment.serviceName },
                   ],
                 }],
               },
             }),
           }
         );

         const result = await response.json();

         if (!response.ok) {
           // Se errore per template mancante/non approvato, prova con messaggio libero
           if (response.status === 403) {
             functions.logger.warn(`Template not approved, trying free-form message for ${appointment.clientName}`);
             const fallbackResponse = await fetch(
               `https://graph.facebook.com/v21.0/${waPhoneNumberId}/messages`,
               {
                 method: 'POST',
                 headers: {
                   'Authorization': `Bearer ${waAccessToken}`,
                   'Content-Type': 'application/json',
                 },
                 body: JSON.stringify({
                   messaging_product: 'whatsapp',
                   recipient_type: 'individual',
                   to: to,
                   type: 'text',
                   text: {
                     preview_url: false,
                     body: `Ciao ${appointment.clientName}! 👋\n\nTi ricordiamo il tuo appuntamento da ${salonName} domani alle ${time} per ${appointment.serviceName}.\n\nA domani! 💇‍♀️`,
                   },
                 }),
               }
             );
             const fallbackResult = await fallbackResponse.json();
             if (!fallbackResponse.ok) {
               throw new Error(`WhatsApp fallback error: ${JSON.stringify(fallbackResult)}`);
             }
           } else {
             throw new Error(`WhatsApp API error: ${JSON.stringify(result)}`);
           }
         }

         // Segna come inviato
         await db.collection('appointments').doc(doc.id).update({
           reminderSent: true,
         });

         sent.push(appointment.clientName);
         functions.logger.info(`WhatsApp reminder sent to ${appointment.clientName} (${to})`);
       } catch (err) {
         errors.push({ client: appointment.clientName, error: err.message });
         functions.logger.error(`Failed to send WhatsApp reminder to ${appointment.clientName}:`, err.message);
       }
     }

     functions.logger.info(`WhatsApp reminders: ${sent.length} sent, ${errors.length} errors`);
     if (sent.length > 0) {
       functions.logger.info(`Sent to: ${sent.join(', ')}`);
     }
     if (errors.length > 0) {
       functions.logger.error(`Errors: ${errors.map(e => `${e.client}: ${e.error}`).join(' | ')}`);
     }
   }
 );