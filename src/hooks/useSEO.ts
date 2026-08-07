import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOData {
  title: string;
  description: string;
  ogTitle?: string;
  ogDescription?: string;
  noindex?: boolean;
}

const BASE_URL = 'https://beautycrm.website';

// Route private (area riservata): per queste vale la SEO di fallback, mai noindex-404
const PRIVATE_PREFIXES = ['/dashboard', '/calendar', '/clients', '/services', '/settings', '/statistiche', '/onboarding', '/checkout'];

const NOT_FOUND_SEO: SEOData = {
  title: 'Pagina non trovata | Beauty CRM',
  description: 'La pagina che stai cercando non esiste. Torna alla home di Beauty CRM, il gestionale per parrucchieri e centri estetici.',
  noindex: true,
};

const SEO_MAP: Record<string, SEOData> = {
  '/': {
    title: 'Beauty CRM — Gestionale per Parrucchieri e Centri Estetici',
    description: 'Il gestionale completo per il tuo salone di bellezza. Agenda smart, gestione clienti, catalogo servizi e statistiche. Provalo gratis, nessuna carta di credito.',
    ogTitle: 'Beauty CRM — Gestionale per Parrucchieri e Centri Estetici',
    ogDescription: 'Agenda smart, gestione clienti, catalogo servizi e statistiche. Tutto in un unico software per il tuo salone. Provalo gratis.',
  },
  '/login': {
    title: 'Accedi | Beauty CRM',
    description: 'Accedi al tuo account Beauty CRM. Gestisci appuntamenti, clienti e servizi del tuo salone.',
  },
  '/terms': {
    title: 'Termini e Condizioni | Beauty CRM',
    description: 'Termini e condizioni generali di Beauty CRM. Licenza SaaS, politiche di rimborso, cancellazione e recesso.',
  },
  '/termini': {
    title: 'Termini e Condizioni | Beauty CRM',
    description: 'Termini e condizioni generali di Beauty CRM. Licenza SaaS, politiche di rimborso, cancellazione e recesso.',
  },
  '/privacy': {
    title: 'Privacy Policy | Beauty CRM',
    description: 'Informativa sulla privacy di Beauty CRM. Come trattiamo e proteggiamo i tuoi dati personali ai sensi del GDPR.',
  },
  '/chi-siamo': {
    title: 'Chi Siamo | Beauty CRM',
    description: 'Beauty CRM è il gestionale italiano per parrucchieri e centri estetici. Scopri la nostra missione, i nostri valori e il team.',
    ogTitle: 'Chi Siamo | Beauty CRM — Il gestionale per il tuo salone',
    ogDescription: 'Scopri la storia, la missione e i valori di Beauty CRM. Un progetto italiano per la digitalizzazione dei saloni di bellezza.',
  },
  '/prezzi': {
    title: 'Gestionale per Parrucchieri e Centri Estetici: Prezzi 2026 | Beauty CRM',
    description: 'Quanto costa un gestionale per salone? Beauty CRM: gratis fino a 30 clienti, Premium a 9,90€/mese senza commissioni sulle prenotazioni. Confronta i piani.',
    ogTitle: 'Prezzi Beauty CRM — Gratis fino a 30 clienti, Premium 9,90€/mese',
    ogDescription: 'Piano Free a 0€ per sempre. Premium a 9,90€/mese senza commissioni né vincoli. Scopri il confronto completo.',
  },
  '/gestionale-parrucchieri': {
    title: 'Gestionale per Parrucchieri e Barberie | Beauty CRM',
    description: 'Il gestionale per parrucchieri 100% italiano: agenda smart, schede cliente, promemoria WhatsApp anti no-show e statistiche. Gratis fino a 30 clienti.',
    ogTitle: 'Gestionale per Parrucchieri | Beauty CRM',
    ogDescription: 'Agenda, schede cliente e promemoria WhatsApp per il tuo salone. Gratis fino a 30 clienti, senza commissioni.',
  },
  '/gestionale-centri-estetici': {
    title: 'Gestionale per Centri Estetici | Beauty CRM',
    description: 'Software gestionale per centri estetici: appuntamenti, schede cliente con trattamenti e preferenze, promemoria WhatsApp e report. Gratis fino a 30 clienti.',
    ogTitle: 'Gestionale per Centri Estetici | Beauty CRM',
    ogDescription: 'Agenda, trattamenti e statistiche per il tuo centro estetico. Gratis fino a 30 clienti, senza commissioni.',
  },
};

export function useSEO() {
  const { pathname } = useLocation();

  useEffect(() => {
    const canonicalUrl = `${BASE_URL}${pathname}`;
    const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p));
    const seo = SEO_MAP[pathname] || (isPrivate ? SEO_MAP['/'] : NOT_FOUND_SEO);

    // Canonical
    let canonicalEl = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = seo.noindex ? BASE_URL : canonicalUrl;

    // Title
    document.title = seo.title;

    // Meta description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = seo.description;
    }

    // Robots (noindex per pagina 404)
    let robotsEl = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robotsEl) {
      robotsEl = document.createElement('meta');
      robotsEl.name = 'robots';
      document.head.appendChild(robotsEl);
    }
    robotsEl.content = seo.noindex
      ? 'noindex, nofollow'
      : 'index, follow, max-snippet:-1, max-image-preview:large';

    // OG
    const setMeta = (property: string, content: string, isName = false) => {
      const attr = isName ? 'name' : 'property';
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, property);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    setMeta('og:url', canonicalUrl);
    setMeta('twitter:url', canonicalUrl, true);
    setMeta('og:title', seo.ogTitle || seo.title);
    setMeta('twitter:title', seo.ogTitle || seo.title, true);
    setMeta('og:description', seo.ogDescription || seo.description);
    setMeta('twitter:description', seo.ogDescription || seo.description, true);
  }, [pathname]);
}