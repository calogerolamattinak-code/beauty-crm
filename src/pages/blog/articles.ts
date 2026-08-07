export interface ArticleMeta {
  slug: string;
  title: string;
  excerpt: string;
  dateISO: string;
  readingTime: string;
}

/** Metadati degli articoli pubblicati — usati dall'indice /blog */
export const articles: ArticleMeta[] = [
  {
    slug: 'ridurre-no-show-salone',
    title: 'Come ridurre i no-show nel tuo salone: 7 strategie che funzionano davvero',
    excerpt: 'I clienti che non si presentano costano cari: buchi in agenda, fatturato perso e stress. Ecco 7 strategie concrete per ridurre le mancate presenze fino al 50%.',
    dateISO: '2026-08-06',
    readingTime: '6 min',
  },
  {
    slug: 'scegliere-gestionale-parrucchieri',
    title: 'Come scegliere un gestionale per parrucchieri: la checklist del 2026',
    excerpt: 'Prezzo, commissioni, facilità d\u2019uso, promemoria, dati: la checklist completa per valutare un software gestionale senza sbagliare — e le domande da fare alla demo.',
    dateISO: '2026-08-06',
    readingTime: '7 min',
  },
  {
    slug: 'costo-gestionale-salone-2026',
    title: 'Quanto costa un gestionale per salone nel 2026? Guida ai modelli di prezzo',
    excerpt: 'Commissioni sulle prenotazioni, abbonamento fisso o freemium? Come calcolare il costo reale di un gestionale e scegliere il modello giusto per il tuo salone.',
    dateISO: '2026-08-06',
    readingTime: '5 min',
  },
];
