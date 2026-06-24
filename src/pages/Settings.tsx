import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PremiumBadge } from '../components/ui/PremiumGate';
import { useSubscription, PREMIUM_PRICE } from '../lib/subscription';
import { useTheme } from '../hooks/useTheme';
import { Bell, Smartphone, Crown, Check, Sparkles, LogOut, XCircle } from 'lucide-react';

interface SettingsProps {
  onGoPremium: () => void;
}

export function Settings({ onGoPremium }: SettingsProps) {
  const { user, firebaseUser, logout } = useAuth();
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const { themeName, setTheme } = useTheme();
  const [saving, setSaving] = useState(false);
  const [salonName, setSalonName] = useState(user?.salonName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [reminderEnabled, setReminderEnabled] = useState(user?.settings?.reminderEnabled || false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const uid = firebaseUser?.uid;

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        salonName,
        phone,
        'settings.reminderEnabled': reminderEnabled,
      });
      alert('Impostazioni salvate! ✅');
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setSaving(false);
    }
  };

  const premiumFeatures = [
    { icon: '♾️', label: 'Clienti illimitati', unlocked: true },
    { icon: '📊', label: 'Statistiche e report', unlocked: isPremium },
    { icon: '💬', label: 'Promemoria WhatsApp automatici', unlocked: isPremium },
    { icon: '🎨', label: 'Brand personalizzato', unlocked: isPremium },
    { icon: '☁️', label: 'Backup automatico', unlocked: isPremium },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-dark">Impostazioni</h1>
            <PremiumBadge isPremium={isPremium} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Profile */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-primary-500" />
              Profilo
            </h2>
          </CardHeader>
          <div className="space-y-3">
            <Input
              label="Nome salone"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}
            />
            <Input
              label="Telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
            />
            <Input
              label="Email"
              value={user?.email || ''}
              disabled
              className="bg-[var(--bg-card)]"
            />
          </div>
        </Card>

        {/* WhatsApp Reminders */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary-500" />
              Promemoria WhatsApp
            </h2>
          </CardHeader>
          <div className="space-y-4">
            {isPremium ? (
              <>
                <label className="flex items-center justify-between cursor-pointer">
                  <div>
                    <p className="font-medium text-text-dark">Promemoria automatici</p>
                    <p className="text-xs text-text-muted">Invia promemoria WhatsApp 24h prima dell'appuntamento</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reminderEnabled}
                    onChange={(e) => setReminderEnabled(e.target.checked)}
                    className="w-5 h-5 rounded-lg accent-primary-500"
                  />
                </label>
                <div className="bg-[var(--success)]/10 rounded-xl p-4 text-sm">
                  ✅ I promemoria WhatsApp sono attivi sul tuo piano Premium
                </div>
              </>
            ) : (
              <div className="text-center py-2">
                <div className="w-12 h-12 bg-[var(--gold)]/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Crown className="w-6 h-6 text-gold-500" />
                </div>
                <p className="font-medium text-text-dark mb-1">💬 Promemoria WhatsApp</p>
                <p className="text-sm text-text-muted mb-4">
                  Riduci le mancate presenze del 50% con promemoria automatici
                </p>
                <Button size="sm" onClick={onGoPremium}>
                  Sblocca con Premium
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Tema */}

        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <svg className="w-4 h-4" style={{color: 'var(--primary-500)'}} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>
              Tema
            </h2>
          </CardHeader>
          <div className="flex gap-3">
            {([
              { name: 'green' as const, label: 'Verde', emoji: '🌿', color: '#2E7D32' },
              { name: 'rose' as const, label: 'Rosa', emoji: '💕', color: '#E8537E' },
              { name: 'purple' as const, label: 'Viola', emoji: '💜', color: '#9C27B0' },
            ]).map((t) => (
              <button
                key={t.name}
                onClick={() => setTheme(t.name)}
                className={`flex-1 rounded-2xl border-2 p-4 text-center transition-all ${
                  themeName === t.name
                    ? 'border-[var(--primary-500)] bg-[var(--primary-50)]'
                    : 'border-[var(--border-light)] bg-[var(--bg-card)]'
                }`}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 text-white text-lg"
                  style={{ background: t.color }}
                >
                  {t.emoji}
                </div>
                <p className="text-sm font-semibold text-[var(--text-dark)]">{t.label}</p>
                {themeName === t.name && (
                  <p className="text-[10px] mt-1" style={{color: 'var(--primary-500)'}}>attivo</p>
                )}
              </button>
            ))}
          </div>
        </Card>

        {/* Piano / Upgrade */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <Crown className="w-4 h-4 text-gold-500" />
              Piano {isPremium ? 'Premium' : 'Free'}
            </h2>
          </CardHeader>
          <div className="space-y-3">
            {premiumFeatures.map((f, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <span>{f.icon}</span>
                  <span className={`text-sm ${f.unlocked ? 'text-text-dark' : 'text-text-muted'}`}>
                    {f.label}
                  </span>
                </div>
                {f.unlocked ? (
                  <Check className="w-4 h-4 text-success" />
                ) : (
                  <Crown className="w-4 h-4 text-gold-500" />
                )}
              </div>
            ))}

            {!isPremium && (
              <Button fullWidth onClick={onGoPremium} className="mt-2">
                <Sparkles className="w-4 h-4 mr-1" />
                Attiva Premium — €{PREMIUM_PRICE.toFixed(2)}/mese
              </Button>
            )}
          </div>
        </Card>

        {/* Save button */}
        <Button fullWidth onClick={handleSave} disabled={saving}>
          {saving ? 'Salvataggio...' : 'Salva Impostazioni'}
        </Button>

        {/* Divider */}
        <div className="border-t border-[var(--border-light)] pt-4" />

        {/* Cancel Subscription */}
        {isPremium && (
          <Card>
            <CardHeader>
              <h2 className="font-bold text-text-dark flex items-center gap-2">
                <XCircle className="w-4 h-4 text-danger" />
                Abbonamento
              </h2>
            </CardHeader>
            <div className="space-y-3">
              <p className="text-sm text-text-muted">
                Sei attualmente abbonato al piano Premium a €{PREMIUM_PRICE.toFixed(2)}/mese.
                Puoi disdire in qualsiasi momento.
              </p>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => {
                  alert('Per disdire l\'abbonamento, contatta il supporto all\'email: info@beautycrm.website. La disdetta sarà effettiva dal prossimo ciclo di fatturazione.');
                }}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Disdici Abbonamento
              </Button>
            </div>
          </Card>
        )}

        {/* Logout */}
        <div className="text-center">
          {confirmLogout ? (
            <div className="flex gap-3 justify-center">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setConfirmLogout(false)}
              >
                Annulla
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={async () => {
                  await logout();
                  navigate('/login');
                }}
              >
                <LogOut className="w-4 h-4 mr-1" />
                Conferma Logout
              </Button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmLogout(true)}
              className="text-sm text-text-muted hover:text-danger transition-colors flex items-center gap-1 mx-auto"
            >
              <LogOut className="w-4 h-4" />
              Esci dall'account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}