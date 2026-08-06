import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useEffect } from 'react';

interface BlogArticleProps {
  title: string;
  description: string;
  slug: string;
  dateISO: string;
  readingTime: string;
  children: React.ReactNode;
}

/**
 * Shell condivisa per gli articoli del blog.
 * - Inietta JSON-LD Article (rich results)
 * - Stile tipografico via selettori discendenti (niente plugin typography)
 * - CTA finale standard
 */
export function BlogArticle({ title, description, slug, dateISO, readingTime, children }: BlogArticleProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'article-jsonld';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description,
      datePublished: dateISO,
      dateModified: dateISO,
      inLanguage: 'it-IT',
      author: { '@type': 'Organization', name: 'Beauty CRM', url: 'https://beautycrm.website' },
      publisher: {
        '@type': 'Organization',
        name: 'Beauty CRM',
        logo: { '@type': 'ImageObject', url: 'https://beautycrm.website/logo.png' },
      },
      mainEntityOfPage: `https://beautycrm.website/blog/${slug}`,
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById('article-jsonld')?.remove();
    };
  }, [title, description, slug, dateISO]);

  return (
    <div className="min-h-screen bg-black text-white">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-[#A0A0B8] hover:text-white mb-8 transition-colors text-sm min-h-[36px]"
        >
          ← Tutte le guide
        </Link>

        <header className="mb-8 sm:mb-10">
          <p className="text-xs sm:text-sm text-[#6B6B82] mb-3">
            Guida Beauty CRM · {readingTime} di lettura · {new Date(dateISO).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">{title}</h1>
        </header>

        {/* Corpo articolo: stile applicato ai tag discendenti */}
        <div
          className="
            [&_h2]:text-xl [&_h2]:sm:text-2xl [&_h2]:font-bold [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h2]:text-white
            [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-semibold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:text-white
            [&_p]:text-sm [&_p]:sm:text-base [&_p]:text-[#A0A0B8] [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_ul]:mb-4 [&_ul]:text-sm [&_ul]:sm:text-base [&_ul]:text-[#A0A0B8]
            [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-2 [&_ol]:mb-4 [&_ol]:text-sm [&_ol]:sm:text-base [&_ol]:text-[#A0A0B8]
            [&_strong]:text-white
            [&_a]:text-[#D46AA8] [&_a]:underline [&_a]:underline-offset-4 [&_a:hover]:text-white
            [&_blockquote]:border-l-2 [&_blockquote]:border-[#D46AA8] [&_blockquote]:pl-4 [&_blockquote]:my-5 [&_blockquote]:text-sm [&_blockquote]:sm:text-base [&_blockquote]:text-[#D0D0DC] [&_blockquote]:italic
          "
        >
          {children}
        </div>

        {/* CTA finale */}
        <footer className="mt-12 text-center rounded-3xl p-8 sm:p-10 border border-white/5" style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.06), rgba(168,85,247,0.06))' }}>
          <h2 className="text-xl sm:text-2xl font-bold mb-3 tracking-tight">Prova Beauty CRM gratis</h2>
          <p className="text-sm sm:text-base text-[#A0A0B8] mb-6 max-w-md mx-auto leading-relaxed">
            Agenda, clienti, servizi e statistiche per il tuo salone. Gratis fino a 30 clienti, senza carta di credito.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/login?register=true"
              className="inline-flex items-center gap-2 px-7 sm:px-8 py-3.5 rounded-xl text-sm sm:text-base font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px]"
              style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
            >
              Inizia gratis
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </Link>
            <Link to="/prezzi" className="text-sm text-[#D46AA8] hover:text-white transition-colors underline underline-offset-4 min-h-[36px]">
              Vedi i prezzi →
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}
