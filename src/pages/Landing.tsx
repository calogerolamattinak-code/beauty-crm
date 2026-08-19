import { useNavigate, Link } from 'react-router-dom';
import {
  CalendarDays,
  Users,
  Scissors,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  UserPlus,
  Settings as SettingsIcon,
  ChevronDown,
  Menu,
  X,
  Sun,
  Moon,
  MessageSquare,
  TrendingUp,
  Smartphone,
} from 'lucide-react';

function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.34a6.34 6.34 0 0 0-.85-.06A6.34 6.34 0 0 0 3.14 15.6a6.34 6.34 0 0 0 10.82 4.49 6.27 6.27 0 0 0 1.87-4.49V8.65a8.28 8.28 0 0 0 4.84 1.55v-3.46a4.85 4.85 0 0 1-1.08-.05z"/>
    </svg>
  );
}
import { useState } from 'react';
import { useTheme } from '../hooks/useTheme';

const navLinks = [
  { label: 'Funzionalità', href: '#features' },
  { label: 'Perché Noi', href: '#benefits' },
  { label: 'Come Funziona', href: '#how' },
  { label: 'Piani e Prezzi', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

const features = [
  {
    icon: CalendarDays,
    title: 'Agenda Smart & Veloce',
    badge: 'Zero Conflitti',
    desc: 'Visuale a settimana o a giornata con drag & drop istantaneo. Nessun doppio appuntamento, interfaccia pulita e rapidissima.',
  },
  {
    icon: Users,
    title: 'Schede Clienti Complete',
    badge: 'Fidelizzazione',
    desc: 'Storico visite, formule colore, preferenze, note personali dello stilista e promemoria compleanno automatico.',
  },
  {
    icon: MessageSquare,
    title: 'Promemoria WhatsApp Auto',
    badge: 'Meno No-Show',
    desc: 'Invia notifiche di conferma e promemoria 24 ore prima dell\'appuntamento. Riduci le mancate presenze del 50%.',
  },
  {
    icon: Scissors,
    title: 'Catalogo Trattamenti & Listino',
    badge: 'Organizzazione',
    desc: 'Gestisci durate, prezzi e categorie per parrucchieri ed estetiste in modo trasparente e intuitivo.',
  },
  {
    icon: TrendingUp,
    title: 'Statistiche & Incassi Live',
    badge: 'Crescita',
    desc: 'Monitora gli incassi giornalieri, i servizi più richiesti e l\'andamento del salone con metriche essenziali a colpo d\'occhio.',
  },
  {
    icon: Smartphone,
    title: 'Sempre con te (PWA / Mobile)',
    badge: 'Cloud Sync',
    desc: 'Utilizzabile da smartphone, tablet o PC in salone o a casa, senza installazioni complesse o costi hardware aggiuntivi.',
  },
];

const steps = [
  {
    num: '01',
    icon: UserPlus,
    title: 'Registrati in 30 Secondi',
    desc: 'Crea il tuo account gratis inserendo solo nome e salone. Nessuna carta di credito richiesta.',
  },
  {
    num: '02',
    icon: SettingsIcon,
    title: 'Inserisci i tuoi Servizi',
    desc: 'Personalizza il listino con tagli, pieghe o trattamenti estetici in 2 minuti.',
  },
  {
    num: '03',
    icon: CalendarDays,
    title: 'Prendi il Controllo dell\'Agenda',
    desc: 'Inserisci clienti e appuntamenti da qualsiasi dispositivo e azzera il disordine dell\'agenda cartacea.',
  },
];

const testimonials = [
  {
    name: 'Giulia Rossi',
    role: 'Titolare Centro Estetico · Milano',
    text: '“Prima usavo l\'agenda di carta e perdevo tempo a richiamare chi non si presentava. Da quando ho attivato i promemoria automatici, le mancate presenze si sono azzerate!”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Marco Tiberi',
    role: 'Hair Stylist · Roma',
    text: '“Cercavo un gestionale senza canoni da centinaia di euro o percentuali sugli appuntamenti. Beauty CRM è perfetto, veloce e facilissimo da usare.”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&h=120&fit=crop&crop=face',
  },
  {
    name: 'Sara Marchetti',
    role: 'Salone Beauty & Nails · Bologna',
    text: '“Poter consultare le schede cliente e le preferenze direttamente dal telefono mentre sono con la cliente mi fa fare una figura super professionale.”',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
  },
];

const faqs = [
  {
    q: 'È davvero gratuito per iniziare?',
    a: 'Sì! Il piano Free è gratuito per sempre fino a 30 clienti registrati e include tutte le funzioni essenziali di agenda e gestione clienti, senza dover inserire alcuna carta di credito.',
  },
  {
    q: 'Come funzionano i promemoria WhatsApp?',
    a: 'Con il piano Premium a 9,90€/mese, il sistema invia in automatico ai tuoi clienti un promemoria amichevole via WhatsApp 24 ore prima dell\'appuntamento, abbattendo drasticamente i no-show.',
  },
  {
    q: 'I miei dati sono protetti e al sicuro?',
    a: 'Certamente. Utilizziamo l\'infrastruttura cloud crittografata di Google Firebase con backup automatici e accesso protetto. Solo tu puoi visualizzare e gestire i dati del tuo salone.',
  },
  {
    q: 'Posso usarlo da smartphone o tablet?',
    a: 'Assolutamente sì. Beauty CRM è una Progressive Web App (PWA) ottimizzata per funzionare in modo fluido su iPhone, Android, iPad, tablet e computer desktop.',
  },
  {
    q: 'Posso cancellare o modificare il piano in qualsiasi momento?',
    a: 'Sì, non c\'è nessun vincolo o contratto vincolante. Puoi passare dal piano Premium al piano Free o cancellare l\'abbonamento in qualsiasi momento con un solo click.',
  },
];

function FAQItem({ faq }: { faq: { q: string; a: string } }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-[var(--border-light)] overflow-hidden transition-all bg-[var(--bg-card)]">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-5 text-left transition-colors hover:bg-[var(--bg-hover)]"
        aria-expanded={open}
      >
        <span className="font-semibold text-[var(--text-dark)] text-base pr-4">{faq.q}</span>
        <ChevronDown
          className={`w-5 h-5 text-[var(--text-dim)] flex-shrink-0 transition-transform duration-200 ${
            open ? 'rotate-180 text-[var(--primary-500)]' : ''
          }`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 text-sm text-[var(--text-muted)] leading-relaxed border-t border-[var(--border)] pt-3 animate-fade-in">
          {faq.a}
        </div>
      )}
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const { theme, toggleMode } = useTheme();

  return (
    <div className="min-h-screen bg-[var(--bg-warm)] text-[var(--text-dark)] flex flex-col selection:bg-[var(--primary-500)] selection:text-white">
      {/* ─── Top Glow Background ─── */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none opacity-40 blur-[120px] bg-[radial-gradient(ellipse_at_center,#EC4899_0%,transparent_70%)] -z-10" />

      {/* ─── Sticky Navbar ─── */}
      <header className="sticky top-0 z-50 glass border-b border-[var(--border-light)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md ring-1 ring-[var(--border-strong)] transition-transform group-hover:scale-105">
              <img src="/logo.jpg" alt="Beauty CRM" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight gradient-text">Beauty CRM</span>
              <span className="text-[10px] text-[var(--text-muted)] font-medium uppercase tracking-wider">
                Software Saloni
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="hover:text-[var(--text-dark)] transition-colors hover:scale-105"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://www.instagram.com/beautycrm.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost p-2 rounded-xl text-[var(--text-muted)] hover:text-[#E1306C] hover:scale-110 transition-all"
              title="Instagram @beautycrm.website"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@beautycrm.website"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost p-2 rounded-xl text-[var(--text-muted)] hover:text-[#00F2FE] hover:scale-110 transition-all"
              title="TikTok @beautycrm.website"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <button
              onClick={toggleMode}
              className="btn-ghost p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-dark)]"
              title={theme.mode === 'dark' ? 'Passa al tema Chiaro' : 'Passa al tema Scuro'}
            >
              {theme.mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => navigate('/login')}
              className="text-sm font-semibold px-4 py-2 rounded-xl text-[var(--text-dark)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              Accedi
            </button>
            <button
              onClick={() => navigate('/login?register=true')}
              className="btn-primary text-sm !py-2.5 !px-5 shadow-lg"
            >
              Inizia Gratis <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <a
              href="https://www.instagram.com/beautycrm.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--text-muted)] hover:text-[#E1306C]"
              title="Instagram"
            >
              <InstagramIcon className="w-5 h-5" />
            </a>
            <a
              href="https://www.tiktok.com/@beautycrm.website"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-[var(--text-muted)] hover:text-[#00F2FE]"
              title="TikTok"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>
            <button
              onClick={toggleMode}
              className="p-2 text-[var(--text-muted)] hover:text-[var(--text-dark)]"
            >
              {theme.mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 text-[var(--text-dark)]"
              aria-label="Menu"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="md:hidden glass border-b border-[var(--border-strong)] px-6 py-5 space-y-4 animate-fade-in">
            {navLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="block text-base font-medium text-[var(--text-dark)] py-1"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-4 border-t border-[var(--border-light)] space-y-3">
              <button
                onClick={() => { setMenuOpen(false); navigate('/login'); }}
                className="w-full text-center py-2.5 text-sm font-semibold text-[var(--text-dark)] bg-[var(--bg-card)] border border-[var(--border-strong)] rounded-xl"
              >
                Accedi al Salone
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate('/login?register=true'); }}
                className="w-full btn-primary text-sm py-3 justify-center"
              >
                Registrati Gratis (≤30 Clienti)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ─── HERO SECTION ─── */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 px-4 sm:px-6 max-w-6xl mx-auto text-center">
        {/* Value badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--primary-100)] border border-[var(--primary-300)]/40 text-[var(--primary-600)] text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" />
          Software Gestionale per Saloni & Centri Estetici
        </div>

        {/* Main title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-dark)] leading-[1.15] max-w-4xl mx-auto mb-6">
          L'Agenda Digitale che{' '}
          <span className="gradient-text">Azzera i No-Show</span> e Fa Crescere il Tuo Salone.
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-xl text-[var(--text-muted)] max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
          Basta carta e appuntamenti persi. Gestisci prenotazioni con drag & drop, invia promemoria WhatsApp automatici e fidelizza i tuoi clienti a <strong>zero commissioni</strong>.
        </p>

        {/* CTA Group */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto mb-12">
          <button
            onClick={() => navigate('/login?register=true')}
            className="w-full sm:w-auto btn-primary !text-base !py-3.5 !px-8 shadow-xl"
          >
            Inizia Gratis per Sempre <ArrowRight className="w-5 h-5" />
          </button>
          <a
            href="#how"
            className="w-full sm:w-auto btn-secondary !text-base !py-3.5 !px-6"
          >
            Guarda come funziona
          </a>
        </div>

        {/* Guarantee strip */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-[var(--text-muted)] font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            <span>Gratis fino a 30 clienti</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            <span>Nessuna carta richiesta</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--success)]" />
            <span>Attivo in 2 minuti</span>
          </div>
        </div>

        {/* Hero Preview Card / App Mockup */}
        <div className="mt-14 sm:mt-18 relative rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-[var(--border-strong)] bg-[var(--bg-card)] shadow-2xl overflow-hidden text-left">
          <div className="flex items-center justify-between border-b border-[var(--border-light)] pb-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
              <span className="ml-3 text-xs text-[var(--text-dim)] font-mono">beautycrm.website/agenda</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-[var(--primary-100)] text-[var(--primary-600)]">
                ● Live Sync
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Mockup Card 1: Agenda */}
            <div className="lg:col-span-2 rounded-xl border border-[var(--border-light)] p-4 bg-[var(--bg-soft)] space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-dark)] flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-[var(--primary-600)]" />
                  Agenda di Oggi (Mercoledì)
                </h3>
                <span className="text-xs text-[var(--text-muted)]">6 appuntamenti confermati</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 rounded-lg border border-[var(--primary-500)]/30 bg-[var(--primary-100)]/40 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--primary-600)]">09:30 - 10:15</span>
                    <p className="text-sm font-semibold text-[var(--text-dark)]">Laura Colombo · Taglio & Piega Glam</p>
                  </div>
                  <span className="text-xs font-bold text-[var(--success)] bg-[var(--success)]/10 px-2 py-0.5 rounded-md">
                    WhatsApp Inviato ✓
                  </span>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-dim)]">10:30 - 11:30</span>
                    <p className="text-sm font-semibold text-[var(--text-dark)]">Valentina Riva · Colore & Trattamento</p>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">€65,00</span>
                </div>
                <div className="p-3 rounded-lg border border-[var(--border-light)] bg-[var(--bg-card)] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[var(--text-dim)]">11:30 - 12:00</span>
                    <p className="text-sm font-semibold text-[var(--text-dark)]">Elena Martini · Manicure Semipermanente</p>
                  </div>
                  <span className="text-xs font-medium text-[var(--text-muted)]">€28,00</span>
                </div>
              </div>
            </div>

            {/* Mockup Card 2: Quick Metrics */}
            <div className="rounded-xl border border-[var(--border-light)] p-4 bg-[var(--bg-soft)] flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  Incasso Stimato Oggi
                </span>
                <p className="text-3xl font-extrabold text-[var(--text-dark)] mt-1">€345,00</p>
                <p className="text-xs text-[var(--success)] font-medium mt-1">↑ +18% rispetto alla media</p>
              </div>
              <div className="border-t border-[var(--border-light)] pt-3 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">No-Show Evitati:</span>
                  <span className="font-bold text-[var(--text-dark)]">4 questa settimana</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Clienti in Anagrafica:</span>
                  <span className="font-bold text-[var(--text-dark)]">128 fidelizzati</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PROBLEM VS SOLUTION ─── */}
      <section id="benefits" className="py-16 sm:py-24 border-t border-[var(--border-light)] bg-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
              Perché Dire Addio all'Agenda Cartacea?
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
              Il metodo tradizionale ti costa centinaia di euro in appuntamenti mancati e ore di tempo perso ogni settimana.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vecchio metodo */}
            <div className="rounded-2xl p-6 sm:p-8 border border-red-500/20 bg-red-500/5 space-y-4">
              <h3 className="text-lg font-bold text-red-500 flex items-center gap-2">
                <X className="w-5 h-5" /> Con l'Agenda Tradizionale / Carta
              </h3>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>No-Show frequenti:</strong> I clienti dimenticano l'orario e non si presentano, lasciando buchi scoperti.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Telefonate e messaggi continui:</strong> Passi la sera a rispondere su WhatsApp invece di riposare.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Formule e note perse:</strong> Difficile ricordare il colore esatto o le preferenze di ogni cliente.</span>
                </li>
              </ul>
            </div>

            {/* Nuovo metodo con Beauty CRM */}
            <div className="rounded-2xl p-6 sm:p-8 border border-[var(--success)]/30 bg-[var(--success)]/5 space-y-4">
              <h3 className="text-lg font-bold text-[var(--success)] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Con Beauty CRM
              </h3>
              <ul className="space-y-3 text-sm text-[var(--text-muted)]">
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--success)] font-bold">✓</span>
                  <span><strong>Promemoria Automatici 24h:</strong> Il cliente riceve la notifica WhatsApp e conferma con un click.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--success)] font-bold">✓</span>
                  <span><strong>Tutto sincronizzato sul telefono:</strong> Controlli la giornata ovunque ti trovi in tempo reale.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-[var(--success)] font-bold">✓</span>
                  <span><strong>Scheda Cliente Dettagliata:</strong> Storico visite, compleanno, preferenze e note personali protette.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES GRID ─── */}
      <section id="features" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-100)] text-[var(--primary-600)] text-xs font-semibold uppercase tracking-wider mb-3">
            Funzionalità Complete
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
            Tutto Ciò che Serve al Tuo Salone, Senza Complicazioni
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl p-6 border border-[var(--border-light)] bg-[var(--bg-card)] card-hover flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-[var(--primary-100)] text-[var(--primary-600)] flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-strong)] text-[var(--text-muted)]">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-dark)]">{f.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="how" className="py-16 sm:py-24 border-t border-[var(--border-light)] bg-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
              Pronto all'Uso in 3 Semplici Passaggi
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
              Nessun manuale complicato o configurazione tecnica. Solo accendi e usi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              return (
                <div key={idx} className="relative rounded-2xl p-6 border border-[var(--border-light)] bg-[var(--bg-soft)] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black gradient-text font-mono">{s.num}</span>
                    <div className="w-10 h-10 rounded-xl bg-[var(--primary-100)] text-[var(--primary-600)] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-[var(--text-dark)]">{s.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-16 sm:py-24 max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--primary-100)] text-[var(--primary-600)] text-xs font-semibold uppercase tracking-wider mb-3">
            Prezzi Trasparenti
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
            Nessuna Commissione, Nessun Costo Nascosto
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-muted)] mt-3">
            Inizia gratis per sempre. Passa a Premium solo se il tuo salone cresce oltre 30 clienti.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Piano Free */}
          <div className="rounded-3xl p-8 border border-[var(--border-strong)] bg-[var(--bg-card)] flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Piano Base</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[var(--text-dark)]">0€</span>
                <span className="text-sm text-[var(--text-muted)]">/ per sempre</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Ideale per iniziare o per professionisti con piccolo giro clienti.</p>

              <ul className="space-y-3 text-sm text-[var(--text-dark)] pt-4 border-t border-[var(--border-light)]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  <span>Fino a <strong>30 clienti</strong> in anagrafica</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  <span>Agenda appuntamenti illimitata</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  <span>Listino servizi e categorie</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--success)] shrink-0" />
                  <span>Accesso da smartphone e PC</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/login?register=true')}
              className="w-full btn-secondary !py-3 text-center justify-center font-bold"
            >
              Registrati Gratis
            </button>
          </div>

          {/* Piano Premium */}
          <div className="relative rounded-3xl p-8 border-2 border-[var(--primary-500)] bg-[var(--bg-card)] shadow-2xl flex flex-col justify-between space-y-6">
            <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-[#EC4899] to-[#A855F7] text-white text-[11px] font-bold uppercase tracking-wider py-1 px-3.5 rounded-full shadow-md">
              Più Popolare
            </div>

            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary-500)]">Piano Premium</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-[var(--text-dark)]">9,90€</span>
                <span className="text-sm text-[var(--text-muted)]">/ al mese</span>
              </div>
              <p className="text-sm text-[var(--text-muted)]">Per saloni e centri estetici che vogliono automatizzare tutto.</p>

              <ul className="space-y-3 text-sm text-[var(--text-dark)] pt-4 border-t border-[var(--border-light)]">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  <span><strong>Clienti Illimitati</strong></span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  <span><strong>Promemoria WhatsApp Automatici</strong> 24h prima</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  <span>Statistiche avanzate & report incassi</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  <span>Assistenza prioritaria dedicata</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--primary-600)] shrink-0" />
                  <span>Disdici quando vuoi con un click</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate('/login?register=true')}
              className="w-full btn-primary !py-3.5 text-center justify-center font-bold shadow-lg"
            >
              Inizia la Prova Gratuita
            </button>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-16 sm:py-24 border-t border-[var(--border-light)] bg-[var(--bg-card)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
              Scelto da Oltre 100 Saloni in Tutta Italia
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div key={idx} className="rounded-2xl p-6 border border-[var(--border-light)] bg-[var(--bg-soft)] flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex text-[var(--gold)]">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-[var(--text-dark)] italic leading-relaxed">{t.text}</p>
                </div>
                <div className="flex items-center gap-3 pt-3 border-t border-[var(--border-light)]">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover ring-1 ring-[var(--border-strong)]" />
                  <div>
                    <h4 className="text-sm font-bold text-[var(--text-dark)]">{t.name}</h4>
                    <p className="text-xs text-[var(--text-muted)]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
            Domande Frequenti
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <FAQItem key={idx} faq={faq} />
          ))}
        </div>
      </section>

      {/* ─── SOCIAL & COMMUNITY CHANNELS ─── */}
      <section className="py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Instagram Card */}
          <a
            href="https://www.instagram.com/beautycrm.website/"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-3xl p-6 border border-[var(--border-strong)] bg-gradient-to-br from-[#F58529]/10 via-[#DD2A7B]/10 to-[#8134AF]/10 hover:border-[#DD2A7B]/40 transition-all card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-white p-1 shadow-md ring-2 ring-[#DD2A7B]/30 flex-shrink-0 group-hover:scale-105 transition-transform">
                <img
                  src="/instagram-qr.png"
                  alt="Instagram QR Code Beauty CRM"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#DD2A7B]/15 text-[#E1306C] text-[11px] font-bold uppercase tracking-wider">
                  <InstagramIcon className="w-3 h-3" />
                  Instagram
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)]">
                  @beautycrm.website
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Pillole quotidiane, consigli pratici e aggiornamenti per il tuo salone.
                </p>
              </div>
            </div>
          </a>

          {/* TikTok Embed Card */}
          <a
            href="https://www.tiktok.com/@beautycrm.website"
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-3xl p-6 border border-[var(--border-strong)] bg-gradient-to-br from-[#00F2FE]/10 via-[#4FACFE]/5 to-[#FE0979]/10 hover:border-[#00F2FE]/40 transition-all card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[var(--bg-card)] border border-[var(--border-strong)] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform text-[var(--text-dark)]">
                <TikTokIcon className="w-10 h-10 text-[#00F2FE]" />
              </div>
              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00F2FE]/15 text-[#00F2FE] text-[11px] font-bold uppercase tracking-wider">
                  <TikTokIcon className="w-3 h-3" />
                  TikTok Ufficiale
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-dark)]">
                  @beautycrm.website
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  Video brevi su strategie salone, azzeramento no-show e trucchi di crescita.
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-20 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl p-8 sm:p-14 border border-[var(--primary-300)]/40 bg-gradient-to-br from-[var(--bg-card)] via-[var(--primary-100)]/30 to-[var(--bg-card)] shadow-2xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--text-dark)] tracking-tight">
              Pronto a Digitalizzare il Tuo Salone Oggi?
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-muted)]">
              Unisciti ai professionisti della bellezza che hanno eliminato i no-show e semplificato la loro giornata.
            </p>
            <button
              onClick={() => navigate('/login?register=true')}
              className="btn-primary !text-base !py-4 !px-9 shadow-2xl"
            >
              Crea Account Gratuito Subito <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[var(--border-light)] bg-[var(--bg-card)] py-12 px-4 sm:px-6 text-sm text-[var(--text-muted)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <img src="/logo.jpg" alt="Beauty CRM" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-[var(--text-dark)]">Beauty CRM</span>
            </div>
            <a
              href="https://www.instagram.com/beautycrm.website/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#DD2A7B]/10 border border-[#DD2A7B]/20 text-[#E1306C] hover:scale-105 transition-all text-xs font-semibold"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <a
              href="https://www.tiktok.com/@beautycrm.website"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#00F2FE]/10 border border-[#00F2FE]/20 text-[#00F2FE] hover:scale-105 transition-all text-xs font-semibold"
            >
              <TikTokIcon className="w-3.5 h-3.5" />
              <span>TikTok</span>
            </a>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <Link to="/chi-siamo" className="hover:text-[var(--text-dark)]">Chi Siamo</Link>
            <Link to="/prezzi" className="hover:text-[var(--text-dark)]">Prezzi</Link>
            <Link to="/gestionale-parrucchieri" className="hover:text-[var(--text-dark)]">Per Parrucchieri</Link>
            <Link to="/gestionale-centri-estetici" className="hover:text-[var(--text-dark)]">Per Centri Estetici</Link>
            <Link to="/blog" className="hover:text-[var(--text-dark)]">Blog</Link>
            <Link to="/privacy" className="hover:text-[var(--text-dark)]">Privacy Policy</Link>
            <Link to="/termini" className="hover:text-[var(--text-dark)]">Termini di Servizio</Link>
          </div>

          <p className="text-xs text-[var(--text-dim)]">
            © 2026 Beauty CRM · Tutti i diritti riservati.
          </p>
        </div>
      </footer>
    </div>
  );
}
