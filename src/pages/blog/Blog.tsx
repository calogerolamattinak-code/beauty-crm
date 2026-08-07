import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { articles } from './articles';

/** Indice del blog: guide e consigli per parrucchieri, barberie e centri estetici */
export function Blog() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#A0A0B8] hover:text-white mb-8 transition-colors text-sm min-h-[36px]"
        >
          ← Torna alla home
        </Link>

        <header className="mb-10 sm:mb-12">
          <p className="text-xs sm:text-sm font-semibold text-[#D46AA8] mb-2 sm:mb-3 tracking-wide uppercase">Guide e consigli</p>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4 tracking-tight">Il blog di Beauty CRM</h1>
          <p className="text-sm sm:text-base text-[#A0A0B8] leading-relaxed max-w-2xl">
            Guide pratiche per gestire meglio il tuo salone: meno no-show, più clienti fidelizzati,
            strumenti digitali spiegati senza paroloni.
          </p>
        </header>

        <div className="space-y-4 sm:space-y-5">
          {articles.map((a) => (
            <Link
              key={a.slug}
              to={`/blog/${a.slug}`}
              className="block rounded-2xl p-5 sm:p-6 border border-white/5 card-hover group"
              style={{ background: '#16161F' }}
            >
              <p className="text-xs text-[#6B6B82] mb-2">
                {new Date(a.dateISO).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })} · {a.readingTime} di lettura
              </p>
              <h2 className="text-base sm:text-xl font-bold text-white mb-2 group-hover:text-[#D46AA8] transition-colors flex items-start gap-2">
                {a.title}
                <ArrowRight className="w-4 h-4 mt-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#D46AA8' }} />
              </h2>
              <p className="text-xs sm:text-sm text-[#A0A0B8] leading-relaxed">{a.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
