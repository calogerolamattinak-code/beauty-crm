import { useNavigate, Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Scissors,
  Sparkles,
  ArrowRight,
  Check,
  Star,
  UserPlus,
  Settings as SettingsIcon,
  CalendarDays,
  Mail,
  ChevronDown,
  Menu,
  X,
  Download,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

const navLinks = [
  { label: 'Funzionalità', href: '#features' },
  { label: 'Benefici', href: '#benefits' },
  { label: 'Come funziona', href: '#how' },
  { label: 'Piani', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const features = [
  { icon: Calendar, title: 'Agenda Smart', desc: 'Gestisci appuntamenti con drag & drop, promemoria automatici e calendario condiviso.' },
  { icon: Users, title: 'Clienti', desc: 'Scheda cliente completa con cronologia, preferenze, note e storia degli appuntamenti.' },
  { icon: Scissors, title: 'Servizi', desc: 'Crea il tuo catalogo con prezzi, durate e categorie personalizzate.' },
  { icon: Sparkles, title: 'Statistiche', desc: 'Visualizza l\u2019andamento del salone con grafici chiari e report dettagliati.' },
];

const steps = [
  { icon: UserPlus, title: 'Registrati', desc: 'Crea il tuo account gratis in 30 secondi. Nessuna carta di credito.' },
  { icon: SettingsIcon, title: 'Configura', desc: 'Inserisci i tuoi servizi, orari e clienti. Pronto in 5 minuti.' },
  { icon: CalendarDays, title: 'Inizia a usare', desc: 'Gestisci appuntamenti, clienti e statistiche dal tuo telefono o computer.' },
];

/* MARKETING */
const benefits = [
  { icon: Sparkles, title: 'Risparmia tempo', desc: 'Automatizza promemoria, conferme e agenda. Recupera fino a 5 ore a settimana.' },
  { icon: Users, title: 'Meno assenteismo', desc: 'I promemoria WhatsApp riducono le mancate presenze fino al 50%.' },
  { icon: Scissors, title: 'Più professionale', desc: 'Scheda cliente digitale, storico e preferenze: ogni cliente si sente speciale.' },
  { icon: CalendarDays, title: 'Sempre accessibile', desc: 'Il tuo salone nel palmo della mano. Gestisci tutto da telefono, tablet o PC.' },
];

const testimonials = [
  { name: 'Giulia Rossi', role: 'Estetista, Milano', text: 'Finalmente un gestionale semplice! In 5 minuti ho configurato tutto e ora risparmio ore ogni settimana.', rating: 5, avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face' },
  { name: 'Marco Tiberi', role: 'Parrucchiere, Roma', text: 'I promemoria WhatsApp hanno ridotto le mancate presenze del 50%. Indispensabile.', rating: 5, avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face' },
  { name: 'Sara Marchetti', role: 'Centro estetico, Bologna', text: 'Le schede cliente con cronologia e preferenze mi fanno sembrare una professionista organizzatissima.', rating: 5, avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face' },
];

const faqs = [
  { q: 'È davvero gratis?', a: 'Sì! Il piano Free è gratis per sempre, con fino a 30 clienti e tutte le funzioni principali. Nessuna carta di credito richiesta per registrarti.' },
  { q: 'Posso importare i miei clienti esistenti?', a: 'Sì, puoi aggiungere manualmente i tuoi clienti in pochi secondi dalla sezione "Clienti". Stiamo lavorando all\u2019importazione massiva da Excel.' },
  { q: 'Funziona sul telefono?', a: 'Assolutamente sì. Beauty CRM è ottimizzato per mobile e funziona direttamente dal browser, senza scaricare nessuna app.' },
  { q: 'I promemoria WhatsApp come funzionano?', a: 'Con il piano Premium, il sistema invia automaticamente un messaggio WhatsApp ai tuoi clienti 24 ore prima dell\u2019appuntamento. Riduci le mancate presenze fino al 50%.' },
  { q: 'I miei dati sono al sicuro?', a: 'Sì. I dati sono archiviati su server sicuri di Google Firebase con crittografia. Ogni utente vede solo i propri dati, protetti da autenticazione.' },
  { q: 'Posso disdire quando voglio?', a: 'Sì, non ci sono vincoli. Puoi passare dal piano Premium al piano Free in qualsiasi momento, mantenendo tutti i tuoi dati.' },
  /* MARKETING */
  { q: 'Come si cancellano gli appuntamenti?', a: 'Puoi cancellare un appuntamento con un clic dalla sezione Agenda. Il cliente riceve automaticamente una notifica di cancellazione. Puoi anche gestire gli spostamenti direttamente dalla scheda cliente.' },
  { q: 'Posso avere più di un operatore?', a: 'Sì! Con il piano Premium puoi gestire più operatori (parrucchieri, estetiste, ecc.) nel tuo salone. Ogni operatore ha la propria agenda e i clienti prenotano con l\'operatore specifico.' },
  { q: 'Si può usare su tablet?', a: 'Certamente! Beauty CRM è ottimizzato per tablet, smartphone e computer. Funziona su qualsiasi dispositivo con browser moderno, con interfaccia responsive che si adatta a ogni schermo.' },
  { q: 'Accettate bonifico?', a: 'Per il pagamento del piano Premium accettiamo carte di credito/debito e PayPal. Il bonifico bancario è disponibile per piani annuali o soluzioni business personalizzate — contattaci per maggiori informazioni.' },
];

const statsCards = [
  { icon: Users, color: '#D46AA8', label: 'CLIENTI', value: '148' },
  { icon: Calendar, color: '#60A5FA', label: 'OGGI', value: '12' },
  { icon: Sparkles, color: '#34D399', label: 'INCASSO', value: '€890' },
];

const sidebarIcons = [
  { icon: CalendarDays, active: true },
  { icon: Calendar, active: false },
  { icon: Users, active: false },
  { icon: Scissors, active: false },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: '#16161F' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 sm:p-5 text-left min-h-[52px]"
        aria-expanded={open}
      >
        <span className="font-semibold text-white text-sm sm:text-base pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[#6B6B82] flex-shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-[#A0A0B8] leading-relaxed animate-fade-in">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // PWA install prompt
  const [_installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isStandalone, setIsStandalone] = useState(false);
  const deferredPromptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    // Check if already running as PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      deferredPromptRef.current = e as BeforeInstallPromptEvent;
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Track app installed
    const installedHandler = () => {
      setIsStandalone(true);
      setInstallPrompt(null);
      deferredPromptRef.current = null;
    };
    window.addEventListener('appinstalled', installedHandler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', installedHandler);
    };
  }, []);

  const handleInstall = async () => {
    const prompt = deferredPromptRef.current;
    if (prompt) {
      prompt.prompt();
      const { outcome } = await prompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
        deferredPromptRef.current = null;
      }
      return;
    }
    // Fallback: show instructions for browsers that don't support native install prompt
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase());
    const isAndroid = /android/.test(navigator.userAgent.toLowerCase());
    if (isIOS) {
      alert('📱 Su iPhone: tocca il pulsante Condividi (📤) in Safari, poi "Aggiungi a Home"');
    } else if (isAndroid) {
      alert('📱 Su Android: apri il menu (⋮) in Chrome e tocca "Installa app" o "Aggiungi a schermata Home"');
    } else {
      alert("📱 Per installare l'app: apri il menu del browser e cerca 'Installa' o 'Aggiungi a Home'");
    }
  };

  const scrollTo = (href: string) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0E0E18] text-white overflow-hidden">
      {/* MARKETING JSON-LD Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://beautycrm.website" },
              { "@type": "ListItem", "position": 2, "name": "Funzionalità", "item": "https://beautycrm.website/#features" },
              { "@type": "ListItem", "position": 3, "name": "Benefici", "item": "https://beautycrm.website/#benefits" },
              { "@type": "ListItem", "position": 4, "name": "Piani", "item": "https://beautycrm.website/#pricing" },
              { "@type": "ListItem", "position": 5, "name": "FAQ", "item": "https://beautycrm.website/#faq" },
            ],
          }),
        }}
      />
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/5 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 sm:gap-2.5 cursor-pointer flex-shrink-0">
            <img src="/logo.jpg" alt="Beauty CRM" className="h-7 sm:h-8 w-auto object-contain rounded-lg" />
            <span className="text-xs sm:text-sm font-bold tracking-tight truncate max-w-[120px] sm:max-w-none">Beauty CRM</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                className="text-sm text-[#A0A0B8] hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            {!isStandalone && (
              <button
                onClick={handleInstall}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#D0D0DC] hover:text-white hover:bg-white/10 rounded-lg transition-colors min-h-[40px]"
                title="Installa app"
                aria-label="Installa l'app Beauty CRM"
              >
                <Download className="w-4 h-4" />
                <span className="hidden lg:inline">App</span>
              </button>
            )}
            <Link
              to="/login"
              className="px-4 lg:px-5 py-2 text-sm text-[#A0A0B8] hover:text-white transition-colors min-h-[40px] flex items-center"
            >
              Accedi
            </Link>
            <Link
              to="/login?register=true"
              className="px-4 lg:px-5 py-2 text-sm font-semibold text-white rounded-lg transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[40px] flex items-center"
              style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}
            >
              Prova gratis
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-[#D0D0DC] hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile slide-down menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#16161F]/95 backdrop-blur-xl animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                  className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#D0D0DC] hover:bg-white/5 hover:text-white transition-colors min-h-[48px]"
                >
                  {link.label}
                </a>
              ))}
              <div className="border-t border-white/5 my-2" />
              {!isStandalone && (
                <button
                  onClick={() => { handleInstall(); }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#D0D0DC] hover:bg-white/5 hover:text-white transition-colors min-h-[48px]"
                >
                  <Download className="w-4 h-4" />
                  Installa app
                </button>
              )}
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="block w-full text-left px-4 py-3 rounded-xl text-sm font-medium text-[#A0A0B8] hover:bg-white/5 hover:text-white transition-colors min-h-[48px]"
              >
                Accedi
              </Link>
              <Link
                to="/login?register=true"
                onClick={() => setMenuOpen(false)}
                className="block w-full px-4 py-3 rounded-xl text-sm font-bold text-white text-center min-h-[48px]"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}
              >
                Prova gratis
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-14 sm:h-16" />

      {/* ─── Hero ─── */}
      <section className="relative py-12 sm:py-16 md:py-20 lg:min-h-[calc(100vh-4rem)] flex items-center">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[900px] h-[600px] sm:h-[900px] rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.06) 0%, rgba(236,72,153,0.04) 30%, transparent 70%)' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 w-full">
          <div className="space-y-5 sm:space-y-7 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.15] sm:leading-[1.1] tracking-tight">
              Il gestionale{' '}
              <br className="hidden sm:block" />
              completo per il{' '}
              <br className="sm:hidden" />
              <span
                className="bg-clip-text text-transparent"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', WebkitBackgroundClip: 'text' }}
              >
                tuo salone
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-[#A0A0B8] max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Agenda, clienti, servizi e statistiche.{' '}
              <br className="hidden sm:block" />
              Tutto in un unico software, semplice e veloce.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start pt-1 sm:pt-2">
              <button
                onClick={() => navigate('/login?register=true')}
                className="group px-7 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
              >
                Inizia gratis
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-7 py-3.5 sm:py-4 rounded-xl text-sm font-medium text-[#D0D0DC] border border-white/15 hover:border-white/30 hover:text-white transition-all min-h-[48px] w-full sm:w-auto"
              >
                Accedi al CRM
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#8A8A9E]">Gratis per sempre · Nessuna carta di credito</p>
          </div>

          {/* Right: Product Mockup (desktop only) */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-white/8 glow-primary" style={{ background: '#16161F' }}>
              <div className="flex gap-1.5 px-4 py-3 border-b border-white/5" style={{ background: '#1C1C28' }}>
                <div className="w-3 h-3 rounded-full bg-[#F87171]/60" />
                <div className="w-3 h-3 rounded-full bg-[#FBBF24]/60" />
                <div className="w-3 h-3 rounded-full bg-[#34D399]/60" />
              </div>
              <div className="flex">
                <div className="flex flex-col items-center gap-3 px-3 py-5 border-r border-white/5" style={{ background: '#12121B' }}>
                  {sidebarIcons.map((item, i) => (
                    <div key={i} className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: item.active ? 'rgba(236,72,153,0.15)' : 'transparent' }}>
                      <item.icon className="w-5 h-5" style={{ color: item.active ? '#D46AA8' : '#6B6B82' }} />
                    </div>
                  ))}
                </div>
                <div className="flex-1 p-5 space-y-4">
                  <h3 className="text-sm font-semibold text-[#F5F5FA]">Dashboard</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {statsCards.map((card, i) => (
                      <div key={i} className="rounded-xl p-3 border border-white/5" style={{ background: '#1C1C28' }}>
                        <card.icon className="w-4 h-4 mb-2" style={{ color: card.color }} />
                        <p className="text-lg font-bold text-white">{card.value}</p>
                        <p className="text-[9px] font-medium tracking-wider text-[#6B6B82]">{card.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-16 rounded-lg flex items-end gap-1 px-2 pt-2" style={{ background: '#1C1C28' }}>
                    {[30, 45, 25, 60, 40, 75, 55, 90, 65, 85].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t-sm" style={{ height: `${h}%`, background: i === 7 ? 'linear-gradient(to top, #EC4899, #A855F7)' : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  <div className="rounded-lg p-3 border border-white/5 flex items-center gap-3" style={{ background: '#1C1C28' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}>SM</div>
                    <div className="flex-1">
                      <p className="text-xs font-medium text-white">Sofia M.</p>
                      <p className="text-[10px] text-[#6B6B82]">Taglio + Colore</p>
                    </div>
                    <p className="text-xs font-bold text-[#D46AA8]">14:30</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Funzionalità</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Tutto ciò che serve al tuo salone</h2>
            <p className="text-sm sm:text-base text-[#A0A0B8] max-w-xl mx-auto leading-relaxed">
              Ogni funzione è pensata per farti risparmiare tempo e far crescere il tuo business.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {features.map((feature, i) => (
              <div key={i} className="rounded-2xl p-4 sm:p-6 border border-white/5 card-hover" style={{ background: '#16161F' }}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <feature.icon className="w-5 h-5" style={{ color: '#D46AA8' }} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARKETING ─── Benefits ─── */}
      <section id="benefits" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Perché sceglierci</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">I benefici del CRM per il tuo salone</h2>
            <p className="text-sm sm:text-base text-[#A0A0B8] max-w-xl mx-auto leading-relaxed">
              Ogni giorno, <strong className="text-white">250+ saloni</strong> risparmiano tempo e aumentano i profitti con Beauty CRM.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
            {benefits.map((benefit, i) => (
              <div key={i} className="rounded-2xl p-4 sm:p-6 border border-white/5 card-hover text-center" style={{ background: '#16161F' }}>
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.15), rgba(168,85,247,0.15))' }}>
                  <benefit.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#D46AA8' }} />
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2">{benefit.title}</h3>
                <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section id="how" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Come funziona</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Pronto in 5 minuti</h2>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-6 sm:gap-8">
            {steps.map((step, i) => (
              <div key={i} className="text-center flex flex-row sm:flex-col items-center gap-4 sm:gap-0 sm:items-center">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <step.icon className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: '#D46AA8' }} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full text-xs font-bold text-white flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                    {i + 1}
                  </span>
                </div>
                <div className="text-left sm:text-center flex-1">
                  <h3 className="text-sm sm:text-lg font-semibold text-white mb-1 sm:mb-2">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials (mobile carousel + desktop grid) ─── */}
      <section className="py-16 sm:py-24 px-0 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-16 px-4 sm:px-0">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Recensioni</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Già usato da 250+ saloni</h2>
          </div>

          {/* Mobile: horizontal scroll */}
          <div className="flex md:hidden gap-4 overflow-x-auto px-4 pb-2 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-5 border border-white/5 flex-shrink-0 w-[85vw] max-w-[340px] snap-center" style={{ background: '#16161F' }}>
                <div className="flex gap-1 mb-3">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-sm text-[#D0D0DC] leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#6B6B82]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: 3-column grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 px-6">
            {testimonials.map((t, i) => (
              <div key={i} className="rounded-2xl p-6 border border-white/5" style={{ background: '#16161F' }}>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, s) => (
                    <Star key={s} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
                <p className="text-sm text-[#D0D0DC] leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" loading="lazy" />
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-[#6B6B82]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator (mobile) */}
          <div className="flex md:hidden justify-center gap-1.5 mt-4 px-4">
            {testimonials.map((_, i) => (
              <div key={i} className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#D46AA8]' : 'bg-[#3A3A4A]'}`} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Piani</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Semplice e trasparente</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-2xl p-6 sm:p-8 border border-white/5" style={{ background: '#16161F' }}>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Free</h3>
              <p className="text-xs sm:text-sm text-[#A0A0B8] mb-5 sm:mb-6">Per iniziare</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">€0</p>
              <p className="text-xs sm:text-sm text-[#6B6B82] mb-5 sm:mb-6">gratis per sempre</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {['Fino a 30 clienti', 'Agenda completa', 'Catalogo servizi', 'App mobile'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#D0D0DC]">
                    <Check className="w-4 h-4 text-[#34D399] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login?register=true')}
                className="w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all min-h-[48px]"
              >
                Inizia gratis
              </button>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 border-2 relative" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(168,85,247,0.05))', borderColor: 'rgba(236,72,153,0.3)' }}>
              <div className="absolute -top-3 right-4 sm:right-6 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                POPOLARE
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-1">Premium</h3>
              <p className="text-xs sm:text-sm text-[#A0A0B8] mb-5 sm:mb-6">Per professionisti</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">€9,90</p>
              <p className="text-xs sm:text-sm text-[#6B6B82] mb-5 sm:mb-6">al mese</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {['Clienti illimitati', 'Tutto del piano Free', 'Promemoria WhatsApp', 'Statistiche avanzate', 'Backup automatico'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#D0D0DC]">
                    <Check className="w-4 h-4 text-[#D46AA8] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/login?register=true')}
                className="w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
              >
                Prova Premium
              </button>
            </div>
          </div>

          {/* MARKETING ─── Pricing comparison table ─── */}
          <div className="mt-8 sm:mt-12 max-w-3xl mx-auto">
            <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: '#16161F' }}>
              <div className="grid grid-cols-3 text-xs sm:text-sm font-semibold border-b border-white/5" style={{ background: '#1C1C28' }}>
                <div className="p-3 sm:p-4 text-[#6B6B82]">Caratteristica</div>
                <div className="p-3 sm:p-4 text-center text-white">Free</div>
                <div className="p-3 sm:p-4 text-center" style={{ color: '#D46AA8' }}>Premium</div>
              </div>
              {[
                { label: 'Clienti', free: 'Fino a 30', premium: 'Illimitati' },
                { label: 'Agenda digitale', free: '✓', premium: '✓' },
                { label: 'Catalogo servizi', free: '✓', premium: '✓' },
                { label: 'App mobile', free: '✓', premium: '✓' },
                { label: 'Promemoria WhatsApp', free: '—', premium: '✓' },
                { label: 'Statistiche avanzate', free: '—', premium: '✓' },
                { label: 'Backup automatico', free: '—', premium: '✓' },
                { label: 'Multi-operatore', free: '—', premium: '✓' },
                { label: 'Supporto prioritario', free: '—', premium: '✓' },
              ].map((row, i) => (
                <div key={i} className="grid grid-cols-3 text-xs sm:text-sm border-b border-white/5 last:border-b-0">
                  <div className="p-3 sm:p-4 text-[#D0D0DC]">{row.label}</div>
                  <div className={`p-3 sm:p-4 text-center ${row.free === '✓' ? 'text-[#34D399]' : row.free === '—' ? 'text-[#6B6B82]' : 'text-[#A0A0B8]'}`}>{row.free}</div>
                  <div className={`p-3 sm:p-4 text-center ${row.premium === '✓' ? 'text-[#34D399]' : row.premium === '—' ? 'text-[#6B6B82]' : 'text-[#A0A0B8]'}`}>{row.premium}</div>
                </div>
              ))}
            </div>
          </div>

          {/* MARKETING ─── Garanzia ─── */}
          <div className="mt-6 sm:mt-8 max-w-3xl mx-auto">
            <div className="rounded-2xl p-5 sm:p-6 border border-white/5 text-center" style={{ background: 'rgba(236,72,153,0.04)', borderColor: 'rgba(236,72,153,0.15)' }}>
              <p className="text-sm sm:text-base font-semibold text-white">
                🔒 Nessun vincolo. Disdici quando vuoi. I tuoi dati sono sempre tuoi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10 sm:mb-16">
            <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">FAQ</p>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">Domande frequenti</h2>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} />
            ))}
          </div>
        </div>
      </section>

      {/* MARKETING ─── Enhanced CTA ─── */}
      <section className="py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl p-8 sm:p-12 md:p-16 border border-white/5 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))' }}>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)' }} />
            </div>
            <div className="relative z-10">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 tracking-tight">
                Pronto a trasformare{' '}
                <br className="sm:hidden" />
                il tuo salone?
              </h2>
              <p className="text-sm sm:text-base text-[#A0A0B8] mb-8 sm:mb-10 max-w-lg mx-auto leading-relaxed">
                Inizia oggi. Configurazione in 5 minuti, nessuna carta richiesta.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button
                  onClick={() => navigate('/login?register=true')}
                  className="group px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px] w-full sm:w-auto"
                  style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
                >
                  Inizia gratis
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={() => scrollTo('#features')}
                  className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-medium text-[#D0D0DC] border border-white/15 hover:border-white/30 hover:text-white transition-all min-h-[48px] w-full sm:w-auto"
                >
                  Vedi demo
                </button>
                <button
                  onClick={handleInstall}
                  className="px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-medium text-[#D0D0DC] border border-white/15 hover:border-white/30 hover:text-white transition-all min-h-[48px] w-full sm:w-auto flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Scarica l'app
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Mobile sticky CTA bar ─── */}
      <div className="md:hidden sticky bottom-0 left-0 right-0 glass border-t border-white/5 p-3 safe-area-bottom z-40">
        <button
          onClick={() => navigate('/login?register=true')}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white min-h-[48px]"
          style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
        >
          Inizia gratis — Nessuna carta richiesta
        </button>
      </div>

      {/* ─── Footer ─── */}
      <footer id="contact" className="border-t border-white/5 py-10 sm:py-12 px-4 sm:px-6 pb-24 md:pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <img src="/logo.jpg" alt="Beauty CRM" className="h-6 sm:h-7 w-auto object-contain rounded" />
                <span className="font-bold text-white text-sm sm:text-base">Beauty CRM</span>
              </div>
              <p className="text-xs sm:text-sm text-[#6B6B82] leading-relaxed mb-4 max-w-xs">
                Il gestionale completo per parrucchieri e centri estetici. Semplice, veloce, italiano.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4">Risorse</p>
              <div className="space-y-2">
                <a href="#features" onClick={(e) => { e.preventDefault(); scrollTo('#features'); }} className="block text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[36px]">Funzionalità</a>
                <a href="#how" onClick={(e) => { e.preventDefault(); scrollTo('#how'); }} className="block text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[36px]">Come funziona</a>
                <a href="#pricing" onClick={(e) => { e.preventDefault(); scrollTo('#pricing'); }} className="block text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[36px]">Piani e prezzi</a>
                <a href="#faq" onClick={(e) => { e.preventDefault(); scrollTo('#faq'); }} className="block text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[36px]">Domande frequenti</a>
                <Link to="/chi-siamo" className="block text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[36px]">Chi siamo</Link>
              </div>
            </div>

            {/* Contact */}
            <div>
              <p className="text-xs sm:text-sm font-semibold text-white mb-3 sm:mb-4">Contatti</p>
              <a href="mailto:info@beautycrm.website" className="flex items-center gap-2 text-xs sm:text-sm text-[#6B6B82] hover:text-[#D0D0DC] transition-colors mb-2 min-h-[36px]">
                <Mail className="w-4 h-4 flex-shrink-0" />
                info@beautycrm.website
              </a>
              <div className="flex items-center gap-2 mt-3 sm:mt-4">
                <Link to="/termini" className="text-xs text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[32px]">Termini</Link>
                <span className="text-[#3A3A4A]">·</span>
                <Link to="/privacy" className="text-xs text-[#6B6B82] hover:text-[#D0D0DC] transition-colors min-h-[32px]">Privacy</Link>
              </div>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 sm:pt-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
            <p className="text-xs text-[#6B6B82]">© 2025 Beauty CRM. Tutti i diritti riservati.</p>
            <p className="text-xs text-[#6B6B82]">Made with ❤️ in Italy</p>
          </div>
        </div>
      </footer>
    </div>
  );
}