const functions = require('firebase-functions');
const admin = require('firebase-admin');
const { defineSecret, defineString } = require('firebase-functions/params');
const { onSchedule } = require('firebase-functions/v2/scheduler');

// Parametri configurabili tramite variabili d'ambiente
const STRIPE_PRICE_MONTHLY = defineString('STRIPE_PRICE_MONTHLY');
const APP_URL = defineString('APP_URL');

// Segreti (crittografati)
const STRIPE_SECRET_KEY = defineSecret('STRIPE_SECRET_KEY');
const STRIPE_WEBHOOK_SECRET = defineSecret('STRIPE_WEBHOOK_SECRET');

admin.initializeApp();
const db = admin.firestore();

/**
 * Crea una sessione Stripe Checkout per l'abbonamento Premium
 */
exports.createCheckoutSession = functions.https.onCall(
  { secrets: [STRIPE_SECRET_KEY] },
  async (data, context) => {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        'unauthenticated', 'Devi essere loggato per passare a Premium'
      );
    }

    const userId = context.auth.uid;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();
    const email = userData?.email || context.auth.token.email;

    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{
        price: data.priceId || STRIPE_PRICE_MONTHLY.value(),
        quantity: 1,
      }],
      customer_email: email,
      client_reference_id: userId,
      metadata: { userId },
      success_url: `${APP_URL.value()}/dashboard?upgrade=success`,
      cancel_url: `${APP_URL.value()}/settings`,
    });

    return { url: session.url };
  }
);

/**
 * Webhook Stripe — chiamato da Stripe dopo eventi di pagamento
 */
exports.stripeWebhook = functions.https.onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET] },
  async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const stripe = require('stripe')(STRIPE_SECRET_KEY.value());

    let event;
    try {
      event = stripe.webhooks.constructEvent(req.rawBody, sig, STRIPE_WEBHOOK_SECRET.value());
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
 */
exports.sendWhatsAppReminders = onSchedule(
  { schedule: '0 8 * * *', timeZone: 'Europe/Rome' },
  async (event) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

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

    for (const doc of snapshot) {
      const appointment = doc.data();
      const userDoc = await db.collection('users').doc(appointment.userId).get();
      const user = userDoc.data();

      if (!user?.isPremium || !user?.settings?.reminderEnabled) continue;
      if (!appointment.clientPhone) continue;

      const startTime = appointment.startTime.toDate();
      const time = startTime.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });

      const message = `Ciao ${appointment.clientName}! 👋\n\nTi ricordiamo il tuo appuntamento da ${user.salonName || 'salone'} domani alle ${time} per ${appointment.serviceName}.\n\nA domani! 💇‍♀️`;

      functions.logger.info(`Would send WhatsApp to ${appointment.clientPhone}: ${message}`);

      // In produzione con Twilio:
      // await twilioClient.messages.create({
      //   from: `whatsapp:${functions.config().twilio.whatsapp_number}`,
      //   to: `whatsapp:${appointment.clientPhone}`,
      //   body: message,
      // });

      await db.collection('appointments').doc(doc.id).update({
        reminderSent: true,
      });

      sent.push(appointment.clientName);
    }

    functions.logger.info(`Sent ${sent.length} WhatsApp reminders for: ${sent.join(', ')}`);
    return { sent: sent.length };
  }
);
