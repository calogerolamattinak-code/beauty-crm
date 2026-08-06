import { Link } from 'react-router-dom';
import { BlogArticle } from '../../components/BlogArticle';
import { articles } from './articles';

const meta = articles.find((a) => a.slug === 'scegliere-gestionale-parrucchieri')!;

export function ScegliereGestionale() {
  return (
    <BlogArticle
      title={meta.title}
      description="Checklist pratica per scegliere un gestionale per parrucchieri nel 2026: costo reale, commissioni, facilità d'uso, promemoria, proprietà dei dati e le 6 domande da fare alla demo prima di decidere."
      slug={meta.slug}
      dateISO={meta.dateISO}
      readingTime={meta.readingTime}
    >
      <p>
        <strong>Il gestionale giusto si riconosce da 8 cose: costo totale reale, zero commissioni nascoste,
        semplicità d'uso, funzionamento da telefono, promemoria automatici, dati sempre tuoi, supporto in
        italiano e libertà di disdire.</strong> Se un software supera tutti e 8 i punti, difficilmente sbagli.
        Ecco la checklist completa, punto per punto.
      </p>

      <h2>La checklist: 8 punti da valutare</h2>

      <h3>1. Il costo totale, non quello in vetrina</h3>
      <p>
        Il prezzo che vedi in homepage non è quasi mai quello che paghi. Calcola il <strong>costo annuo reale</strong>:
        canone mensile × 12, più eventuali costi di attivazione, più le commissioni sulle prenotazioni, più i moduli
        "extra" che scopri dopo. Due software che sembrano costare uguale possono differire di centinaia di euro l'anno.
      </p>

      <h3>2. Commissioni sulle prenotazioni: il costo invisibile</h3>
      <p>
        I marketplace della bellezza ti portano clienti, ma trattengono una <strong>percentuale su ogni
        appuntamento</strong> — e più cresci, più paghi. Un abbonamento a prezzo fisso fa il percorso opposto:
        costa uguale sia che tu abbia 50 o 500 appuntamenti al mese. Fai due conti con il tuo volume prima di scegliere.
      </p>

      <h3>3. Lo usi davvero ogni giorno? (prova prima di pagare)</h3>
      <p>
        Il gestionale migliore è quello che usi. Se l'interfaccia è lenta o complicata, tornerai all'agenda di carta
        entro un mese — soldi buttati. Cerca un <strong>piano gratuito vero</strong> o una prova senza carta di
        credito: se un software non ti fa provare il prodotto reale, chiediti perché.
      </p>

      <h3>4. Deve funzionare dal telefono</h3>
      <p>
        In salone lavori in piedi, tra una cliente e l'altra. Se il gestionale è pensato solo per il PC della
        cassa, ti rallenta. Verifica che sia <strong>veloce da smartphone</strong> — oggi le web app moderne
        funzionano dal browser senza installare nulla e si aggiungono alla schermata home come un'app.
      </p>

      <h3>5. Promemoria automatici ai clienti</h3>
      <p>
        I no-show sono la perdita silenziosa di ogni salone. Un gestionale con <strong>promemoria WhatsApp
        automatici</strong> può dimezzarli. Chiedi sempre: i promemoria sono inclusi o sono un modulo a parte?
        Partono da soli o devi inviarli tu? (Su questo tema abbiamo scritto una <Link to="/blog/ridurre-no-show-salone">guida con 7 strategie anti no-show</Link>.)
      </p>

      <h3>6. I dati dei clienti restano tuoi</h3>
      <p>
        Nomi, numeri di telefono, storico trattamenti: sono il patrimonio del tuo salone. Verifica che il
        fornitore sia <strong>conforme al GDPR</strong>, che i dati siano su server sicuri e che tu possa
        esportarli se cambi software. Diffida di chi rende difficile andartene.
      </p>

      <h3>7. Supporto in italiano, quando serve</h3>
      <p>
        Prima o poi avrai un problema alle 9 di sabato mattina. Un supporto <strong>in italiano</strong>, via
        chat o email, che risponde in ore e non in giorni vale più di dieci funzioni in più nel listino.
      </p>

      <h3>8. Nessun vincolo di durata</h3>
      <p>
        Contratti annuali con rinnovo automatico e penali sono un segnale: chi è sicuro del proprio prodotto ti
        lascia libero. Scegli software con <strong>disdetta in qualsiasi momento</strong> e possibilità di
        tornare al piano gratuito mantenendo i dati.
      </p>

      <h2>Le 6 domande da fare alla demo</h2>
      <ol>
        <li>Quanto pagherò in totale in un anno, commissioni incluse?</li>
        <li>I promemoria ai clienti sono automatici? Su WhatsApp?</li>
        <li>Posso importare i clienti che ho già? Come?</li>
        <li>Se supero il piano attuale, cosa succede ai miei dati?</li>
        <li>Come esporto i miei dati se un giorno cambio software?</li>
        <li>Il supporto è in italiano? Con che tempi di risposta?</li>
      </ol>

      <h2>Gli errori più comuni da evitare</h2>
      <ul>
        <li><strong>Scegliere solo sul prezzo mensile</strong> ignorando commissioni e moduli extra.</li>
        <li><strong>Comprare un software pensato per altri settori</strong> (ristoranti, officine): saloni e centri estetici hanno esigenze specifiche di durata servizi, operatori e schede cliente.</li>
        <li><strong>Firmare vincoli annuali</strong> prima di aver usato il prodotto almeno due settimane.</li>
        <li><strong>Sottovalutare la semplicità</strong>: se serve un manuale, non lo userai.</li>
      </ul>

      <h2>In sintesi</h2>
      <p>
        Prendi la checklist, provala su 2-3 software e confronta le risposte. Beauty CRM è nato esattamente da
        questi 8 punti: <strong>gratis fino a 30 clienti, Premium a 9,90€/mese senza commissioni</strong>,
        promemoria WhatsApp automatici, dati tuoi, supporto italiano e disdetta quando vuoi. Puoi vedere il
        confronto completo nella <Link to="/prezzi">pagina prezzi</Link> — ma qualunque software tu scelga, ora sai
        esattamente cosa guardare.
      </p>
    </BlogArticle>
  );
}
