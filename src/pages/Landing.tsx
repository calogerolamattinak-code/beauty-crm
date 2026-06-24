import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Calendar,
  Users,
  Euro,
  Package,
  ArrowRight,
  ChevronDown,
  LayoutDashboard,
  Scissors,
  Sparkle,
} from 'lucide-react';

const navLinks = [
  { label: 'Funzionalità', href: '#features' },
  { label: 'AI Stylist', href: '#ai-stylist' },
  { label: 'FAQ', href: '#faq' },
  { label: 'Scrivici', href: '#contact' },
];

const statsCards = [
  { icon: Users, color: '#A855F7', label: 'CLIENTI', value: '148', bg: 'rgba(168,85,247,0.1)' },
  { icon: Calendar, color: '#3B82F6', label: 'OGGI', value: '12', bg: 'rgba(59,130,246,0.1)' },
  { icon: Euro, color: '#10B981', label: 'INCASSO', value: '€ 890', bg: 'rgba(16,185,129,0.1)' },
  { icon: Package, color: '#F59E0B', label: 'SCORTA', value: '3', bg: 'rgba(245,158,11,0.1)' },
];

const sidebarIcons = [
  { icon: LayoutDashboard, color: '#EC4899' },
  { icon: Calendar, color: '#3B82F6' },
  { icon: Users, color: '#A855F7' },
  { icon: Euro, color: '#F59E0B' },
  { icon: Package, color: '#8B5CF6' },
];

export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/')}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C10 2 4 6 4 14s6 12 10 12 10-4 10-12S18 2 14 2z" fill="none" stroke="#EC4899" strokeWidth="1.5"/>
              <path d="M14 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" fill="#EC4899" opacity="0.6"/>
              <path d="M10 18c0-2 1.5-4 4-4s4 2 4 4" stroke="#22C55E" strokeWidth="1.5" fill="none"/>
              <path d="M12 20c0-1 1-2 2-2s2 1 2 2" stroke="#22C55E" strokeWidth="1" fill="none"/>
            </svg>
            <span className="text-lg font-bold tracking-tight">Beauty <span className="text-white">CRM</span></span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm text-gray-300 hover:text-white border border-white/10 hover:border-white/20 rounded-lg transition-all"
            >
              Accedi
            </button>
            <button
              onClick={() => navigate('/login?register=true')}
              className="px-5 py-2 text-sm font-semibold text-white rounded-lg"
              style={{
                background: 'linear-gradient(135deg, #EC4899, #A855F7)',
              }}
            >
              Prova gratis
            </button>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-30"
            style={{
              background: 'radial-gradient(circle, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.1) 30%, transparent 70%)',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Left: Text */}
          <div className="space-y-6">
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-purple-500/20 bg-purple-500/5 text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              Powered by AI STYLIST
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Il gestionale che
              </span>
              <br />
              <span className="text-orange-500">fa</span>
              <br />
              <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">
                crescere il salone
              </span>
            </h1>

            {/* Subheadline */}
            <h2 className="text-xl md:text-2xl text-orange-400/80 font-medium">
              Un software completo, non solo un'agenda
            </h2>

            {/* Body */}
            <p className="text-gray-400 text-base md:text-lg max-w-lg leading-relaxed">
              Agenda, clienti, cassa, magazzino e AI Stylist — tutto in un unico software. Semplice, veloce, pensato per i saloni italiani.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => navigate('/login?register=true')}
                className="group px-8 py-3.5 rounded-xl text-sm font-bold text-white flex items-center gap-2 shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #EC4899, #A855F7)',
                }}
              >
                Inizia gratis
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-3.5 rounded-xl text-sm font-medium text-gray-300 border border-white/10 hover:border-white/20 hover:text-white transition-all"
              >
                Accedi al CRM
              </button>
            </div>

            <p className="text-xs text-gray-500">Nessuna carta di credito richiesta</p>
          </div>

          {/* Right: Product Mockup */}
          <div className="relative hidden lg:block">
            {/* Main mockup */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/5"
              style={{ background: '#1a1a2e' }}>
              {/* Window controls */}
              <div className="flex gap-1.5 px-4 py-3" style={{ background: '#16213e' }}>
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>

              <div className="flex">
                {/* Sidebar */}
                <div className="flex flex-col items-center gap-4 px-3 py-4 border-r border-white/5"
                  style={{ background: '#0f3460' }}>
                  {sidebarIcons.map((item, i) => (
                    <div
                      key={i}
                      className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                      style={{ background: i === 0 ? 'rgba(236,72,153,0.2)' : 'transparent' }}
                    >
                      <item.icon className="w-4 h-4" style={{ color: i === 0 ? '#EC4899' : item.color, opacity: i === 0 ? 1 : 0.5 }} />
                    </div>
                  ))}
                </div>

                {/* Dashboard */}
                <div className="flex-1 p-4 space-y-4">
                  <h3 className="text-sm font-semibold text-pink-400">Dashboard</h3>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    {statsCards.map((card, i) => (
                      <div key={i} className="rounded-xl p-3 border border-white/5"
                        style={{ background: '#1a1a2e' }}>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-6 h-6 rounded-md flex items-center justify-center"
                            style={{ background: card.bg }}>
                            <card.icon className="w-3 h-3" style={{ color: card.color }} />
                          </div>
                          <span className="text-[10px] font-medium tracking-wider text-gray-500">{card.label}</span>
                        </div>
                        <p className="text-lg font-bold text-white">{card.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Mini chart */}
                  <div className="h-12 rounded-lg flex items-end gap-1 px-2 pt-2" style={{ background: '#16213e' }}>
                    {[30, 45, 25, 60, 40, 75, 55, 90, 65, 85].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-sm transition-all"
                        style={{
                          height: `${h}%`,
                          background: i === 7
                            ? 'linear-gradient(to top, #EC4899, #A855F7)'
                            : '#ffffff10',
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-right text-[10px] text-gray-500">GIORNI</div>
                </div>
              </div>
            </div>

            {/* Floating popup: AI Stylist */}
            <div className="absolute -top-3 -right-3 rounded-xl px-3 py-2 shadow-lg border border-purple-500/10 backdrop-blur-sm"
              style={{ background: 'rgba(26,26,46,0.95)' }}>
              <p className="text-[10px] text-gray-400 mb-0.5">AI Stylist</p>
              <div className="flex items-center gap-1.5">
                <Sparkle className="w-3 h-3 text-pink-400" />
                <span className="text-xs font-semibold text-pink-400">Attivo</span>
              </div>
            </div>

            {/* Floating popup: Appointment */}
            <div className="absolute -bottom-2 -left-4 rounded-xl px-3 py-2 shadow-lg border border-blue-500/10 backdrop-blur-sm"
              style={{ background: 'rgba(26,26,46,0.95)' }}>
              <p className="text-[10px] text-gray-400 mb-1">Prossimo appuntamento</p>
              <div className="flex items-center gap-2 text-xs">
                <Calendar className="w-3 h-3 text-blue-400" />
                <span className="text-white font-medium">14:30 — Sofia M.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] tracking-widest text-gray-500">SCORRI</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>
      </section>

      {/* ─── Features Section ─── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tutto ciò che serve al tuo{' '}
              <span className="bg-gradient-to-r from-pink-500 to-purple-400 bg-clip-text text-transparent">salone</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Ogni funzionalità è pensata per farti risparmiare tempo e far crescere il tuo business.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Calendar, title: 'Agenda smart', desc: 'Gestisci appuntamenti con drag & drop, promemoria automatici e calendario condiviso.' },
              { icon: Users, title: 'Gestione clienti', desc: 'Scheda cliente completa con cronologia, preferenze, foto e note personali.' },
              { icon: Euro, title: 'Cassa e pagamenti', desc: 'Incassa in modo semplice, emetti ricevute e tieni traccia di ogni transazione.' },
              { icon: Scissors, title: 'Servizi e listino', desc: 'Crea il tuo catalogo servizi con durata, prezzo e categorie personalizzate.' },
              { icon: Package, title: 'Magazzino', desc: 'Tieni sotto controllo le scorte di prodotti e ricevi notifiche quando finiscono.' },
              { icon: Sparkles, title: 'AI Stylist', desc: 'Consigli intelligenti per i tuoi clienti basati sulle loro preferenze e cronologia.' },
            ].map((feature, i) => (
              <div
                key={i}
                className="rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-all group"
                style={{ background: '#0a0a1a' }}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors"
                  style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <feature.icon className="w-5 h-5 text-pink-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Section ─── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto a{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">trasformare</span>{' '}
            il tuo salone?
          </h2>
          <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Inizia oggi, nessuna carta di credito richiesta. Configurazione in 5 minuti.
          </p>
          <button
            onClick={() => navigate('/login?register=true')}
            className="group px-10 py-4 rounded-xl text-base font-bold text-white flex items-center gap-2 mx-auto shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg, #EC4899, #A855F7)',
            }}
          >
            Inizia gratis
            <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 2C10 2 4 6 4 14s6 12 10 12 10-4 10-12S18 2 14 2z" fill="none" stroke="#EC4899" strokeWidth="1.5"/>
              <path d="M14 6c-2 0-4 2-4 4s2 4 4 4 4-2 4-4-2-4-4-4z" fill="#EC4899" opacity="0.6"/>
            </svg>
            <span className="text-sm font-semibold">Beauty CRM</span>
          </div>
          <p className="text-xs text-gray-500">© 2026 Beauty CRM. Tutti i diritti riservati.</p>
        </div>
      </footer>
    </div>
  );
}