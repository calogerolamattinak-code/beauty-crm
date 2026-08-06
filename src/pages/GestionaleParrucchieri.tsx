import { Link } from 'react-router-dom';
import { Calendar, Users, MessageCircle, BarChart3, ArrowRight, Check } from 'lucide-react';

const punti = [
  {
    icon: Calendar,
    title: 'Agenda pensata per il salone',
    desc: 'Appuntamenti con drag & drop, durate personalizzate per ogni servizio (taglio, colore, piega) e calendario condiviso con il team. Zero doppie prenotazioni, zero telefonate perse.',
  },
  {
    icon: Users,
    title: 'Schede cliente con storico completo',
    desc: 'Per ogni cliente: cronologia dei servizi, preferenze (colore, taglio, prodotti usati) e note libere. Quando torna in salone, sai già tutto — e si vede.',
  },
  {
    icon: MessageCircle,
    title: 'Addio no-show con i promemoria WhatsApp',
    desc: 'Con il piano Premium il sistema invia in automatico un promemoria WhatsApp 24 ore prima dell\u2019appuntamento. Le mancate presenze si riducono fino al 50%.',
  },
  {
    icon: BarChart3,
    title: 'Statistiche per capire cosa funziona',
    desc: 'Incassi, servizi più richiesti, giornate piene e vuote: grafici chiari per decidere orari, prezzi e promozioni con dati veri, non a sensazione.',
  },
];

const faqsParrucchieri = [
  {
    q: 'Funziona da telefono o serve un computer?',
    a: 'Beauty CRM funziona da qualsiasi dispositivo con un browser: telefono, tablet o computer. Non devi installare né aggiornare nulla, e puoi aggiungerla alla schermata home come un\u2019app.',
  },
  {
    q: 'Ho una barberia: va bene anche per me?',
    a: 'Sì. Barberie e saloni uomo hanno le stesse esigenze di agenda, clienti e promemoria. Puoi personalizzare servizi, durate e prezzi sul tuo menu — dal taglio alla rasatura.',
  },
  {
    q: 'Posso importare i clienti che ho già?',
    a: 'Puoi aggiungere i tuoi clienti in pochi secondi dalla sezione Clienti. Stiamo lavorando all\u2019importazione massiva da Excel per chi ha archivi molto grandi.',
  },
  {
    q: 'Quanto costa?',
    a: 'Il piano Free è gratis per sempre, fino a 30 clienti. Il piano Premium costa 9,90€ al mese, senza commissioni sulle prenotazioni. Tutti i dettagli nella pagina prezzi.',
  },
];

export function GestionaleParrucchieri() {
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
          <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Per parrucchieri e barberie</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-5 tracking-tight">
            Il gestionale per parrucchieri che ti fa risparmiare ore ogni settimana
          </h1>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl">
            Beauty CRM è il <strong className="text-white">gestionale per parrucchieri 100% italiano</strong>: agenda
            smart, schede cliente, catalogo servizi e statistiche in un’unica app. Inizi{' '}
            <strong className="text-white">gratis fino a 30 clienti</strong>, senza carta di credito, e passi a Premium
            (9,90€/mese) solo quando ti serve — senza commissioni sulle prenotazioni.
          </p>
        </header>

        {/* Punti di forza */}
        <section className="mb-10 sm:mb-14" aria-label="Funzionalità per parrucchieri">
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

        {/* Multi-operatore */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Salone con più operatori? Nessun problema</h2>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl mb-4">
            Con il piano Premium gestisci l’agenda di <strong className="text-white">più operatori</strong> nello
            stesso account: ogni parrucchiere ha il suo calendario e i clienti prenotano con la persona giusta. Ideale
            per saloni con 2-10 postazioni e per barberie con più poltrone.
          </p>
          <ul className="space-y-2">
            {[
              'Un account per tutto il salone',
              'Agenda separata per ogni operatore',
              'Statistiche per operatore: chi lavora di più, chi fidelizza meglio',
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
            {faqsParrucchieri.map((faq, i) => (
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
            <Link to="/gestionale-centri-estetici" className="text-sm text-[#D46AA8] hover:text-white transition-colors underline underline-offset-4 min-h-[36px]">
              Gestionale per centri estetici →
            </Link>
          </div>
        </section>

        {/* CTA finale */}
        <section className="text-center rounded-3xl p-8 sm:p-10 border border-white/5" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Provalo gratis nel tuo salone</h2>
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
