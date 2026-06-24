import { Crown, Lock } from 'lucide-react';
import { type ReactNode } from 'react';
import { Button } from './Button';

interface PremiumGateProps {
  isPremium: boolean;
  feature: string;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PremiumGate({ isPremium, feature, children, fallback }: PremiumGateProps) {
  if (isPremium) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="relative">
      {/* Blur overlay for non-premium */}
      <div className="absolute inset-0 backdrop-blur-[2px] bg-white/40 z-10 rounded-2xl flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-gold-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Crown className="w-6 h-6 text-gold-500" />
          </div>
          <p className="font-semibold text-text-dark mb-1">Funzione Premium</p>
          <p className="text-sm text-text-muted mb-3">{feature}</p>
          <Button size="sm">
            Passa a Premium — 9,90€/mese
          </Button>
        </div>
      </div>
      {/* Original content blurred */}
      <div className="opacity-30 pointer-events-none">
        {children}
      </div>
    </div>
  );
}

export function PremiumBadge({ isPremium }: { isPremium: boolean }) {
  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 bg-gold-500/10 text-gold-500 text-xs font-bold px-2 py-1 rounded-lg">
        <Crown className="w-3 h-3" />
        PREMIUM
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 bg-[#F0E8E8] text-text-muted text-xs font-medium px-2 py-1 rounded-lg">
      <Lock className="w-3 h-3" />
      FREE
    </span>
  );
}

export function ClientLimitBar({ current, max }: { current: number; max: number }) {
  const percent = max === Infinity ? 0 : Math.min((current / max) * 100, 100);
  const isNearLimit = percent >= 80;
  const isAtLimit = percent >= 100;

  if (max === Infinity) return null;

  return (
    <div className="bg-white rounded-2xl border border-[#F0E8E8] p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-text-dark">
          {isAtLimit ? '🔒 Limite raggiunto' : isNearLimit ? '⚠️ Quasi al limite' : '📊 Clienti'}
        </p>
        <p className="text-xs font-bold text-text-muted">
          {current} / {max}
        </p>
      </div>
      <div className="h-2 bg-[#F0E8E8] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isAtLimit ? 'bg-danger' : isNearLimit ? 'bg-warning' : 'bg-primary-500'
          }`}
          style={{ width: `${percent}%` }}
        />
      </div>
      {isAtLimit && (
        <div className="mt-3 bg-primary-50 rounded-xl p-3 text-center">
          <p className="text-sm text-text-dark font-medium mb-2">
            🎯 Hai raggiunto il limite gratuito
          </p>
          <Button size="sm">
            Passa a Premium — 9,90€/mese
          </Button>
        </div>
      )}
    </div>
  );
}
