import { useState, useRef } from 'react';
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
import { ALL_THEMES } from '../lib/themes';
import { Bell, Smartphone, Crown, Check, Sparkles, LogOut, XCircle, Image, Upload, FileText, Palette } from 'lucide-react';

interface SettingsProps {
  onGoPremium: () => void;
}

const DEFAULT_LOGOS = [
  { id: 'icon-01', label: 'Logo 1' },
  { id: 'icon-02', label: 'Logo 2' },
  { id: 'icon-03', label: 'Logo 3' },
  { id: 'icon-04', label: 'Logo 4' },
  { id: 'icon-05', label: 'Logo 5' },
  { id: 'icon-06', label: 'Logo 6' },
  { id: 'icon-07', label: 'Logo 7' },
  { id: 'icon-08', label: 'Logo 8' },
  { id: 'icon-09', label: 'Logo 9' },
  { id: 'icon-10', label: 'Logo 10' },
  { id: 'icon-11', label: 'Logo 11' },
  { id: 'icon-12', label: 'Logo 12' },
  { id: 'icon-13', label: 'Logo 13' },
  { id: 'icon-14', label: 'Logo 14' },
  { id: 'icon-15', label: 'Logo 15' },
];

function getLogoUrl(user: { logo?: string | null; logoPreset?: string | null }): string {
  if (user?.logo) return user.logo; // base64 custom
  const preset = user?.logoPreset || 'icon-01';
  return `/logos/${preset}.jpg?v=3`;
}

export function Settings({ onGoPremium }: SettingsProps) {
  const { user, firebaseUser, logout } = useAuth();
  const { themeName, setTheme } = useTheme();
  const navigate = useNavigate();
  const { isPremium } = useSubscription();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [saving, setSaving] = useState(false);
  const [salonName, setSalonName] = useState(user?.salonName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [fiscalCode, setFiscalCode] = useState(user?.fiscalCode || '');
  const [billingAddress, setBillingAddress] = useState(user?.billingAddress || '');
  const [selectedPreset, setSelectedPreset] = useState(user?.logoPreset || 'scissors');
  const [customLogo, setCustomLogo] = useState<string | null>(user?.logo || null);
  const [reminderEnabled, setReminderEnabled] = useState(user?.settings?.reminderEnabled || false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const uid = firebaseUser?.uid;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Seleziona un file immagine valido (JPG, PNG, SVG)');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('L\'immagine è troppo grande (max 2MB). Usa un\'immagine più piccola.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      // Compress image via canvas to keep Firestore doc small
      const img = document.createElement('img');
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxSize = 200; // 200x200 max
        let { width, height } = img;
        if (width > height) {
          if (width > maxSize) { height = (height * maxSize) / width; width = maxSize; }
        } else {
          if (height > maxSize) { width = (width * maxSize) / height; height = maxSize; }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) { setCustomLogo(dataUrl); return; }
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        setCustomLogo(compressed);
        setSelectedPreset('');
      };
      img.onerror = () => {
        setCustomLogo(dataUrl);
        setSelectedPreset('');
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPreset = (id: string) => {
    setSelectedPreset(id);
    setCustomLogo(null); // clear custom when preset selected
  };

  const handleSave = async () => {
    if (!uid) return;
    setSaving(true);
    try {
      // Update only fields that changed
      const updates: Record<string, unknown> = {
        salonName,
        phone,
        fiscalCode,
        billingAddress,
      };
      if (customLogo) {
        updates.logo = customLogo;
        updates.logoPreset = '';
      } else {
        updates.logoPreset = selectedPreset;
        updates.logo = '';
      }
      updates['settings.reminderEnabled'] = reminderEnabled;

      await updateDoc(doc(db, 'users', uid), updates);
      alert('Impostazioni salvate! ✅');
    } catch (err) {
      console.error('Error saving settings:', err);
      alert('❌ Errore durante il salvataggio. Controlla la connessione e riprova.');
    } finally {
      setSaving(false);
    }
  };

  const currentLogoUrl = customLogo || `/logos/${selectedPreset}.jpg?v=3`;

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
            <h1 className="text-2xl font-bold text-text-dark">Gestione</h1>
            <PremiumBadge isPremium={isPremium} />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* ─── Logo ─── */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <Image className="w-4 h-4 text-primary-500" />
              Logo del salone
            </h2>
          </CardHeader>
          <div>
            {/* Preview */}
            <div className="flex items-center gap-4 mb-4 p-4 bg-[var(--bg-soft)] rounded-xl">
              <div className="w-16 h-16 rounded-xl overflow-hidden bg-white shadow-sm flex-shrink-0">
                <img
                  src={currentLogoUrl}
                  alt="Logo salone"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = '/logos/icon-01.jpg'; }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-text-dark text-sm truncate">
                  {salonName || 'Il tuo salone'}
                </p>
                <p className="text-xs text-text-muted">
                  {customLogo ? 'Logo personalizzato' : `Logo: ${DEFAULT_LOGOS.find(l => l.id === selectedPreset)?.label || selectedPreset}`}
                </p>
              </div>
            </div>

            {/* Default logos — 4 visibili, resto a scorrimento */}
            <p className="text-sm font-medium text-text-dark mb-3">Scegli un logo predefinito</p>
            <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
              {DEFAULT_LOGOS.map((logo) => (
                <button
                  key={logo.id}
                  onClick={() => handleSelectPreset(logo.id)}
                  className={`snap-start flex-shrink-0 w-[68px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selectedPreset === logo.id && !customLogo
                      ? 'border-primary-500 ring-2 ring-primary-200'
                      : 'border-[var(--border-light)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <img
                    src={`/logos/${logo.id}.jpg?v=3`}
                    alt={logo.label}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            {/* Custom upload */}
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-1" />
                Carica logo personalizzato
              </Button>
              {customLogo && (
                <button
                  onClick={() => { setCustomLogo(null); setSelectedPreset(user?.logoPreset || 'scissors'); }}
                  className="text-xs text-text-muted hover:text-danger transition-colors"
                >
                  Rimuovi
                </button>
              )}
            </div>
          </div>
        </Card>

        {/* ─── Tema / Aspetto ─── */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-[var(--text-dark)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--primary-500)]" />
              Tema & Aspetto Visivo
            </h2>
          </CardHeader>
          <div className="grid grid-cols-3 gap-3">
            {ALL_THEMES.map((t) => {
              const isSelected = themeName === t.name;
              return (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTheme(t.name)}
                  className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--primary-500)] bg-[var(--primary-50)] text-[var(--text-dark)] shadow-sm'
                      : 'border-[var(--border-light)] bg-[var(--bg-soft)] text-[var(--text-muted)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <span className="text-xs font-bold">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Card>

        {/* ─── Profile ─── */}
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
              placeholder="Es. Beauty Studio di Maria"
              value={salonName}
              onChange={(e) => setSalonName(e.target.value)}

            />
            <Input
              label="Telefono"
              placeholder="+39 333 123 4567"
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

        {/* ─── Dati Fatturazione ─── */}
        <Card>
          <CardHeader>
            <h2 className="font-bold text-text-dark flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-500" />
              Dati Fatturazione
            </h2>
          </CardHeader>
          <div className="space-y-3">
            <Input
              label="Partita IVA / Codice Fiscale"
              placeholder="Es. 01234567890"
              value={fiscalCode}
              onChange={(e) => setFiscalCode(e.target.value)}
            />
            <Input
              label="Indirizzo fatturazione"
              placeholder="Es. Via Roma 123, Milano"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
            />
          </div>
        </Card>

        {/* ─── WhatsApp Reminders ─── */}
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
                <div className="bg-[var(--success)]/10 rounded-xl p-4 text-sm flex items-start gap-3">
                  <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-text-dark">
                      {reminderEnabled ? 'Promemoria WhatsApp attivi ✅' : 'Promemoria disattivati'}
                    </p>
                    <p className="text-xs text-text-muted mt-1">
                      {reminderEnabled
                        ? 'Il sistema invierà automaticamente un promemoria ogni giorno alle 8:00 per gli appuntamenti del giorno dopo.'
                        : 'Attiva per ridurre le mancate presenze del 50%'}
                    </p>
                  </div>
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

        {/* ─── Piano / Upgrade ─── */}
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
          {saving ? 'Salvataggio...' : 'Salva'}
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

/** Helper to get a user's current logo URL (exported for use in AppLayout) */
export function getUserLogoUrl(user: { logo?: string | null; logoPreset?: string | null }): string {
  return getLogoUrl(user);
}