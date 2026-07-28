import { useState } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Crown, Check, ArrowLeft, Sparkles } from 'lucide-react';
import { PREMIUM_PRICE, getPremiumFeatures } from '../lib/subscription';
import { useAuth } from '../hooks/useAuth';

interface CheckoutProps {
  onBack: () => void;
  salonName?: string;
}

export function Checkout({ onBack, salonName }: CheckoutProps) {
  const [loading, setLoading] = useState(false);
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const { firebaseUser, user } = useAuth();

  const features = getPremiumFeatures();
  const yearlyPrice = PREMIUM_PRICE * 10; // 2 mesi gratis

  const handleUpgrade = async () => {
    if (!firebaseUser) {
      alert('Devi essere loggato per passare a Premium');
      return;
    }
    setLoading(true);
    try {
      // Use Stripe Payment Link directly — pass userId so webhook can upgrade the user
      const baseUrl = billing === 'monthly'
        ? 'https://buy.stripe.com/3cI5kD7Ny82ke4n8LE0VO01'
        : 'https://buy.stripe.com/14AaEXebW3M4f8r7HA0VO02';
      const params = new URLSearchParams({
        client_reference_id: firebaseUser.uid,
      });
      const email = user?.email || firebaseUser.email;
      if (email) params.set('prefilled_email', email);
      window.location.href = `${baseUrl}?${params.toString()}`;
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Errore durante il reindirizzamento a Stripe. Riprova più tardi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <button onClick={onBack} className="btn-ghost flex items-center gap-2 mb-6">
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm">Indietro</span>
      </button>

      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-text-dark mb-2">
          Passa a Premium 🚀
        </h1>
        <p className="text-text-muted">
          {salonName ? `${salonName} — ` : ''}Sblocca tutte le funzionalità
        </p>
      </div>

      {/* Billing toggle */}
      <div className="bg-[var(--bg-card)] rounded-2xl p-1 border border-[var(--border-light)] flex mb-4">
        <button
          onClick={() => setBilling('monthly')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
            billing === 'monthly' ? 'bg-[var(--text-dark)] text-[var(--bg-soft)] shadow-sm' : 'text-[var(--text-dim)] hover:text-[var(--text-muted)]'
          }`}
        >
          Mensile
        </button>
        <button
          onClick={() => setBilling('yearly')}
          className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
            billing === 'yearly' ? 'bg-[var(--text-dark)] text-[var(--bg-soft)] shadow-sm' : 'text-[var(--text-dim)] hover:text-[var(--text-muted)]'
          }`}
        >
          Annuale
          <span className="absolute -top-2 -right-1 bg-success text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            -17%
          </span>
        </button>
      </div>

      {/* Price card */}
      <Card className="text-center py-8 mb-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 gradient-primary" />
        <p className="text-4xl font-bold text-text-dark mb-1">
          €{billing === 'monthly' ? PREMIUM_PRICE.toFixed(2) : yearlyPrice.toFixed(2)}
        </p>
        <p className="text-text-muted text-sm mb-6">
          {billing === 'monthly' ? 'al mese' : 'all\'anno (2 mesi gratis)'}
        </p>

        <Button
          fullWidth
          onClick={handleUpgrade}
          disabled={loading}
          className="mb-3"
        >
          {loading ? 'Reindirizzamento...' : `Attiva Premium — €${billing === 'monthly' ? PREMIUM_PRICE.toFixed(2) : yearlyPrice.toFixed(2)}/mese`}
        </Button>

        <p className="text-xs text-text-muted">
          🔒 Pagamento sicuro via Stripe · Disdici quando vuoi
        </p>
      </Card>

      {/* Features */}
      <h2 className="font-bold text-text-dark mb-3 flex items-center gap-2">
        <Sparkles className="w-4 h-4 text-gold-500" />
        Tutto incluso
      </h2>
      <div className="space-y-2">
        {features.map((f, i) => (
          <Card key={i} className="flex items-center gap-3 py-3">
            <span className="text-xl">{f.icon}</span>
            <div>
              <p className="font-medium text-text-dark text-sm">{f.title}</p>
              <p className="text-xs text-text-muted">{f.desc}</p>
            </div>
            <Check className="w-4 h-4 text-success ml-auto" />
          </Card>
        ))}
      </div>
    </div>
  );
}
