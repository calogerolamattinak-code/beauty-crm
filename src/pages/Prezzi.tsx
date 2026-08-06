import { Link } from 'react-router-dom';
import { Check, ArrowRight, Scissors } from 'lucide-react';
import { useEffect } from 'react';

const faqsPrezzi = [
  {
    q: 'Beauty CRM è davvero gratis?',
    a: 'Sì. Il piano Free costa 0€ per sempre e include agenda completa, catalogo servizi, app mobile e gestione di fino a 30 clienti. Per registrarti non serve nessuna carta di credito.',
  },
  {
    q: 'Cosa succede quando il mio salone supera i 30 clienti?',
    a: 'Quando cresci oltre i 30 clienti puoi passare al piano Premium in un clic: clienti illimitati e funzioni avanzate, mantenendo tutti i dati già inseriti. Nessuna migrazione, nessuna perdita di informazioni.',
  },
  {
    q: 'Ci sono commissioni sulle prenotazioni o costi nascosti?',
    a: 'No. Beauty CRM ha un prezzo fisso e trasparente: 0€ con il piano Free, 9,90€ al mese con il piano Premium. Nessuna commissione sulle prenotazioni, nessun costo di attivazione, nessuna sorpresa in fattura.',
  },
  {
    q: 'Quali metodi di pagamento accettate per il piano Premium?',
    a: 'Carte di credito e debito (Visa, Mastercard, American Express) e PayPal. Per piani annuali o esigenze particolari è disponibile anche il bonifico bancario: scrivici a info@beautycrm.website.',
  },
  {
    q: 'Posso disdire il piano Premium quando voglio?',
    a: 'Sì, non ci sono vincoli né penali. Puoi tornare al piano Free in qualsiasi momento e i tuoi dati restano sempre tuoi e accessibili.',
  },
];

const confrontoRows = [
  { label: 'Clienti', free: 'Fino a 30', premium: 'Illimitati' },
  { label: 'Agenda digitale', free: '✓', premium: '✓' },
  { label: 'Catalogo servizi', free: '✓', premium: '✓' },
  { label: 'App mobile', free: '✓', premium: '✓' },
  { label: 'Promemoria WhatsApp', free: '—', premium: '✓' },
  { label: 'Statistiche avanzate', free: '—', premium: '✓' },
  { label: 'Backup automatico', free: '—', premium: '✓' },
  { label: 'Multi-operatore', free: '—', premium: '✓' },
  { label: 'Supporto prioritario', free: '—', premium: '✓' },
];

export function Prezzi() {
  // FAQPage structured data: rich snippet idoneo per questa pagina
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqsPrezzi.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById('faq-jsonld')?.remove();
    };
  }, []);

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
          <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Prezzi</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 sm:mb-5 tracking-tight">
            Quanto costa un gestionale per parrucchieri e centri estetici?
          </h1>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl">
            Con Beauty CRM parti <strong className="text-white">gratis</strong>: il piano Free costa 0€ per sempre
            e include agenda, gestione clienti (fino a 30) e catalogo servizi. Il piano{' '}
            <strong className="text-white">Premium costa 9,90€ al mese</strong>, senza commissioni sulle
            prenotazioni e senza vincoli: disdici quando vuoi. Nessuna carta di credito per iniziare.
          </p>
        </header>

        {/* Cards piani */}
        <section className="mb-10 sm:mb-14" aria-label="Piani e prezzi">
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            <div className="rounded-2xl p-6 sm:p-8 border border-white/5" style={{ background: '#16161F' }}>
              <h2 className="text-base sm:text-lg font-bold text-white mb-1">Free</h2>
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
              <Link
                to="/login?register=true"
                className="block w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white text-center border border-white/15 hover:border-white/30 hover:bg-white/5 transition-all min-h-[48px] leading-[24px]"
              >
                Inizia gratis
              </Link>
            </div>

            <div className="rounded-2xl p-6 sm:p-8 border-2 relative" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.05), rgba(168,85,247,0.05))', borderColor: 'rgba(236,72,153,0.3)' }}>
              <div className="absolute -top-3 right-4 sm:right-6 px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                POPOLARE
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white mb-1">Premium</h2>
              <p className="text-xs sm:text-sm text-[#A0A0B8] mb-5 sm:mb-6">Per professionisti</p>
              <p className="text-3xl sm:text-4xl font-extrabold text-white mb-1">€9,90</p>
              <p className="text-xs sm:text-sm text-[#6B6B82] mb-5 sm:mb-6">al mese, IVA inclusa</p>
              <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
                {['Clienti illimitati', 'Tutto del piano Free', 'Promemoria WhatsApp', 'Statistiche avanzate', 'Backup automatico', 'Multi-operatore'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs sm:text-sm text-[#D0D0DC]">
                    <Check className="w-4 h-4 text-[#D46AA8] flex-shrink-0" />{f}
                  </li>
                ))}
              </ul>
              <Link
                to="/login?register=true"
                className="block w-full py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold text-white text-center transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px] leading-[24px]"
                style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
              >
                Prova Premium
              </Link>
            </div>
          </div>
        </section>

        {/* Tabella confronto */}
        <section className="mb-10 sm:mb-14" aria-label="Confronto dettagliato dei piani">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">Confronto completo: Free vs Premium</h2>
          <div className="rounded-2xl overflow-hidden border border-white/5" style={{ background: '#16161F' }}>
            <div className="grid grid-cols-3 text-xs sm:text-sm font-semibold border-b border-white/5" style={{ background: '#1C1C28' }}>
              <div className="p-3 sm:p-4 text-[#6B6B82]">Caratteristica</div>
              <div className="p-3 sm:p-4 text-center text-white">Free</div>
              <div className="p-3 sm:p-4 text-center" style={{ color: '#D46AA8' }}>Premium</div>
            </div>
            {confrontoRows.map((row, i) => (
              <div key={i} className="grid grid-cols-3 text-xs sm:text-sm border-b border-white/5 last:border-b-0">
                <div className="p-3 sm:p-4 text-[#D0D0DC]">{row.label}</div>
                <div className={`p-3 sm:p-4 text-center ${row.free === '✓' ? 'text-[#34D399]' : row.free === '—' ? 'text-[#6B6B82]' : 'text-[#A0A0B8]'}`}>{row.free}</div>
                <div className={`p-3 sm:p-4 text-center ${row.premium === '✓' ? 'text-[#34D399]' : row.premium === '—' ? 'text-[#6B6B82]' : 'text-[#A0A0B8]'}`}>{row.premium}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Perché senza commissioni */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 tracking-tight">Perché "senza commissioni" fa la differenza</h2>
          <div className="space-y-3 text-sm sm:text-base text-[#A0A0B8] leading-relaxed">
            <p>
              Molte piattaforme di prenotazione online applicano una <strong className="text-white">commissione su ogni
              appuntamento</strong> ricevuto tramite il loro marketplace, oppure prevedono canoni mensili molto più alti
              con costi di attivazione. Più il tuo salone cresce, più paghi.
            </p>
            <p>
              Beauty CRM funziona al contrario: un <strong className="text-white">prezzo fisso di 9,90€ al mese</strong>,
              indipendentemente da quante prenotazioni ricevi. Il 100% di quello che incassi resta a te.
            </p>
          </div>
        </section>

        {/* FAQ prezzi — native details/summary: accessibili e crawler-friendly */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 tracking-tight">Domande frequenti sui prezzi</h2>
          <div className="space-y-2 sm:space-y-3">
            {faqsPrezzi.map((faq, i) => (
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

        {/* Link interni alle landing verticali */}
        <section className="mb-10 sm:mb-14">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 tracking-tight">Scopri Beauty CRM per il tuo settore</h2>
          <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
            <Link
              to="/gestionale-parrucchieri"
              className="rounded-2xl p-5 border border-white/5 card-hover block"
              style={{ background: '#16161F' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Scissors className="w-5 h-5" style={{ color: '#D46AA8' }} />
                <h3 className="font-semibold text-white text-sm sm:text-base">Gestionale per parrucchieri</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">
                Agenda, schede cliente e promemoria WhatsApp pensati per saloni di acconciatura e barberie.
              </p>
            </Link>
            <Link
              to="/gestionale-centri-estetici"
              className="rounded-2xl p-5 border border-white/5 card-hover block"
              style={{ background: '#16161F' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <Check className="w-5 h-5" style={{ color: '#D46AA8' }} />
                <h3 className="font-semibold text-white text-sm sm:text-base">Gestionale per centri estetici</h3>
              </div>
              <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">
                Appuntamenti, trattamenti e statistiche per centri estetici e istituti di bellezza.
              </p>
            </Link>
          </div>
        </section>

        {/* CTA finale */}
        <section className="text-center rounded-3xl p-8 sm:p-10 border border-white/5" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Inizia oggi, gratis</h2>
          <p className="text-sm sm:text-base text-[#A0A0B8] mb-6 max-w-md mx-auto leading-relaxed">
            Configurazione in 5 minuti. Nessuna carta di credito richiesta.
          </p>
          <Link
            to="/login?register=true"
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 sm:py-4 rounded-xl text-sm sm:text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
            style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
          >
            Crea il tuo account gratis
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Link>
        </section>
      </div>
    </div>
  );
}
