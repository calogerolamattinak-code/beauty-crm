import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mail } from 'lucide-react';

export function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Torna alla home
        </button>

        <h1 className="text-3xl font-bold mb-6">Chi Siamo</h1>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          {/* Mission */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La nostra missione</h2>
            <p>
              Beauty CRM nasce con un obiettivo semplice: rendere la gestione del salone di bellezza
              facile, veloce e accessibile a tutti. Crediamo che parrucchieri, estetisti e centri
              benessere meritino strumenti digitali moderni senza dover spendere una fortuna.
            </p>
          </section>

          {/* Story */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">La nostra storia</h2>
            <p>
              Beauty CRM è un progetto indipendente italiano, sviluppato da{' '}
              <strong className="text-white">Lamattina Calogero</strong> con sede a Campofranco (CL).
              Nato dall'esperienza diretta nel mondo della consulenza digitale per le PMI, abbiamo
              visto quanto fosse difficile per i piccoli saloni trovare un software gestionale
              semplice, economico e in italiano.
            </p>
            <p className="mt-2">
              Così abbiamo costruito Beauty CRM: un'app moderna, basata su tecnologie cloud sicure
              (Google Firebase), con un design pensato per essere usato ogni giorno senza formazione.
            </p>
          </section>

          {/* Valori */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-3">I nostri valori</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong className="text-white">Semplicità:</strong> un'interfaccia pulita e
                intuitiva, senza curve di apprendimento.
              </li>
              <li>
                <strong className="text-white">Accessibilità:</strong> un piano Free generoso
                (fino a 30 clienti) per permettere a ogni salone di iniziare senza barriere.
              </li>
              <li>
                <strong className="text-white">Privacy:</strong> i dati dei tuoi clienti sono
                protetti con crittografia su server Google Firebase, conformi al GDPR.
              </li>
              <li>
                <strong className="text-white">Made in Italy:</strong> tutto il software è
                sviluppato in Italia, pensato per il mercato italiano.
              </li>
            </ul>
          </section>

          {/* Founder */}
          <section className="rounded-2xl p-6 border border-white/10" style={{ background: '#16161F' }}>
            <h2 className="text-lg font-semibold text-white mb-3">Il fondatore</h2>
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white flex-shrink-0" style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)' }}>
                CL
              </div>
              <div>
                <p className="font-semibold text-white">Lamattina Calogero</p>
                <p className="text-xs text-gray-500 mt-0.5">Fondatore & Sviluppatore</p>
                <p className="mt-2 text-gray-400">
                  Imprenditore digitale e sviluppatore full-stack, con esperienza nella creazione
                  di SaaS per il mercato italiano. Beauty CRM nasce dalla sua visione: portare
                  la digitalizzazione nei piccoli saloni di bellezza con strumenti accessibili.
                </p>
              </div>
            </div>
          </section>

          {/* Contatti */}
          <section className="border-t border-white/10 pt-6 mt-8">
            <h2 className="text-lg font-semibold text-white mb-3">Contattaci</h2>
            <div className="space-y-2 text-gray-400">
              <p>
                Hai domande o vuoi saperne di più? Scrivici a{' '}
                <a href="mailto:info@beautycrm.website" className="text-[#D46AA8] hover:underline inline-flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  info@beautycrm.website
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-4">
                P.IVA: 02176270854 · Sede Legale: Piazza Europa 5, 93010 Campofranco (CL)
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
