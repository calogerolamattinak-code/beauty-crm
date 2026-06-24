import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';

export const FREE_CLIENT_LIMIT = 30;
export const PREMIUM_PRICE = 9.90;

export function useSubscription() {
  const { firebaseUser } = useAuth();
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) {
      setLoading(false);
      return;
    }

    // Listen to real-time premium status
    const unsub = onSnapshot(doc(db, 'users', uid), (snap) => {
      if (snap.exists()) {
        setIsPremium(snap.data()?.isPremium === true);
      }
      setLoading(false);
    });

    return unsub;
  }, [firebaseUser?.uid]);

  const features = isPremium
    ? {
        clientLimit: Infinity,
        whatsappReminders: true,
        analytics: true,
        weeklyCalendar: true,
        backup: true,
        customBranding: true,
      }
    : {
        clientLimit: FREE_CLIENT_LIMIT,
        whatsappReminders: false,
        analytics: false,
        weeklyCalendar: true,
        backup: false,
        customBranding: false,
      };

  return { isPremium, loading, features };
}

export function getPremiumFeatures() {
  return [
    {
      icon: '♾️',
      title: 'Clienti illimitati',
      desc: 'Nessun limite, cresci senza preoccupazioni',
    },
    {
      icon: '💬',
      title: 'Promemoria WhatsApp automatici',
      desc: 'Riduci le mancate presenze del 50%',
    },
    {
      icon: '📊',
      title: 'Statistiche e Report',
      desc: 'Guadagni, visite, ore di punta',
    },
    {
      icon: '☁️',
      title: 'Backup automatico',
      desc: 'I tuoi dati sempre al sicuro',
    },
    {
      icon: '🎨',
      title: 'Brand personalizzato',
      desc: 'L\'app col nome del tuo salone',
    },
  ];
}

export function createCheckoutSession(priceId: string): string {
  // Placeholder — will redirect to Stripe Checkout
  // Cloud Function creates session, returns URL
  return `${import.meta.env.VITE_API_URL || ''}/api/create-checkout?price=${priceId}&userId=${useAuth().firebaseUser?.uid}`;
}
