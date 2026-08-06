import { Link } from 'react-router-dom';
import { Calendar, Users, MessageCircle, BarChart3, ArrowRight, Check } from 'lucide-react';

const punti = [
  {
    icon: Calendar,
    title: 'Agenda per trattamenti e cabine',
    desc: 'Ogni servizio ha la sua durata: pulizia viso, massaggi, manicure, epilazione. L\u2019agenda si organizza da sola e il calendario condiviso evita sovrapposizioni tra operatrici.',
  },
  {
    icon: Users,
    title: 'Schede cliente con trattamenti e preferenze',
    desc: 'Storico completo dei trattamenti, preferenze, allergie e note per ogni cliente. Accoglienza personalizzata che fa tornare le clienti — e parlare bene di te.',
  },
  {
    icon: MessageCircle,
    title: 'Meno appuntamenti saltati',
    desc: 'I promemoria WhatsApp automatici (piano Premium) avvisano la cliente 24 ore prima. Meno buchi in agenda, meno fatturato perso: le mancate presenze calano fino al 50%.',
  },
  {
    icon: BarChart3,
    title: 'Report chiari sul tuo centro',
    desc: 'Trattamenti più richiesti, orari di punta, andamento degli incassi: le statistiche ti dicono dove investire, dalle promo ai nuovi servizi.',
  },
];

const faqsEstetica = [
  {
    q: 'Va bene anche per un piccolo centro o per un\u2019estetista in proprio?',
    a: 'Sì, è pensato proprio per questo. Il piano Free copre fino a 30 clienti a costo zero: perfetto per iniziare. Quando il centro cresce, il piano Premium (9,90€/mese) sblocca clienti illimitati e multi-operatore.',
  },
  {
    q: 'Posso gestire più operatrici e cabine?',
    a: 'Con il piano Premium sì: ogni operatrice ha la sua agenda nel tuo stesso account e le clienti prenotano con la persona giusta. La configurazione richiede pochi minuti.',
  },
  {
    q: 'Le mie clienti devono scaricare un\u2019app?',
    a: 'No. Tu usi Beauty CRM dal browser di telefono, tablet o PC; le clienti ricevono i promemoria direttamente su WhatsApp, senza installare nulla.',
  },
  {
    q: 'Quanto costa?',
    a: 'Gratis fino a 30 clienti, per sempre. Premium a 9,90€ al mese, senza commissioni sulle prenotazioni e senza vincoli. Vedi la pagina prezzi per il confronto completo.',
  },
];

export function GestionaleCentriEstetici() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#A0A0B8] hover:text-white mb-8 transition-colors text-sm min-h-[36px]"
        >
          ← Torna alla home
        </Link>

        {/* Risposta diretta — citabile da Google AI Overviews e LLM */}
        <header className="mb-10 sm:mb-14">
          <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Per centri estetici</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-5 tracking-tight">
            Il gestionale per centri estetici semplice, italiano e senza commissioni
          </h1>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl">
            Beauty CRM è il <strong className="text-white">software gestionale per centri estetici</strong> che unisce
            agenda, schede cliente, catalogo trattamenti e statistiche. <strong className="text-white">Gratis fino a
            30 clienti</strong>, Premium a 9,90€/mese solo quando ti serve. Nessuna commissione sulle prenotazioni,
            nessuna carta di credito per iniziare.
          </p>
        </header>

        {/* Punti di forza */}
        <section className="mb-10 sm:mb-14" aria-label="Funzionalità per centri estetici">
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-5">
            {punti.map((p, i) => (
              <div key={i} className="rounded-2xl p-5 sm:p-6 border border-white/5" style={{ background: '#16161F' }}>
                <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center mb-3 sm:mb-4" style={{ background: 'rgba(236,72,153,0.1)' }}>
                  <p.icon className="w-5 h-5" style={{ color: '#D46AA8' }} />
                </div>
                <h2 className="text-sm sm:text-base font-semibold text-white mb-1.5 sm:mb-2">{p.title}</h2>
                <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Perché diverso dai marketplace */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Tuo il centro, tuoi gli incassi</h2>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl mb-4">
            A differenza dei marketplace della bellezza, Beauty CRM non trattiene percentuali sulle tue prenotazioni:
            paghi un <strong className="text-white">abbonamento fisso</strong> e il 100% di quello che incassi resta a
            te. I dati delle clienti sono tuoi, protetti e conformi al GDPR.
          </p>
          <ul className="space-y-2">
            {[
              'Nessuna commissione: prezzo fisso mensile',
              'Dati dei clienti di tua proprietà, su server sicuri Google Firebase',
              'Disdici quando vuoi, senza penali',
            ].map((f) => (
              <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#D0D0DC]">
                <Check className="w-4 h-4 text-[#34D399] flex-shrink-0" />{f}
              </li>
            ))}
          </ul>
        </section>

        {/* FAQ */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">Domande frequenti</h2>
          <div className="space-y-2 sm:space-y-3">
            {faqsEstetica.map((faq, i) => (
              <details key={i} className="rounded-2xl border border-white/5 overflow-hidden group" style={{ background: '#16161F' }}>
                <summary className="flex items-center justify-between p-4 sm:p-5 cursor-pointer list-none font-semibold text-white text-sm sm:text-base min-h-[52px] [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span className="text-[#6B6B82] group-open:rotate-180 transition-transform flex-shrink-0 ml-4">▾</span>
                </summary>
                <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-[#A0A0B8] leading-relaxed">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Cross-link */}
        <section className="mb-10 sm:mb-14">
          <div className="flex flex-col sm:flex-row gap-3">
            <Link to="/prezzi" className="text-sm text-[#D46AA8] hover:text-white transition-colors underline underline-offset-4 min-h-[36px]">
              Vedi prezzi e piani →
            </Link>
            <Link to="/gestionale-parrucchieri" className="text-sm text-[#D46AA8] hover:text-white transition-colors underline underline-offset-4 min-h-[36px]">
              Gestionale per parrucchieri →
            </Link>
          </div>
        </section>

        {/* CTA finale */}
        <section className="text-center rounded-3xl p-8 sm:p-10 border border-white/5" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Provalo gratis nel tuo centro</h2>
          <p className="text-sm sm:text-base text-[#A0A0B8] mb-6 max-w-md mx-auto leading-relaxed">
            Registrazione in 30 secondi, configurazione in 5 minuti. Nessuna carta richiesta.
          </p>
          <Link
            to="/login?register=true"
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
          >
            Inizia gratis
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
