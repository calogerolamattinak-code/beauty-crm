import { Link } from 'react-router-dom';
import { BlogArticle } from '../../components/BlogArticle';
import { articles } from './articles';

const meta = articles.find((a) => a.slug === 'ridurre-no-show-salone')!;

export function NoShow() {
  return (
    <BlogArticle
      title={meta.title}
      description="I no-show costano cari ai saloni italiani: buchi in agenda e fatturato perso. Ecco 7 strategie concrete — dai promemoria WhatsApp automatici alla lista d'attesa — per ridurre le mancate presenze fino al 50%."
      slug={meta.slug}
      dateISO={meta.dateISO}
      readingTime={meta.readingTime}
    >
      <p>
        <strong>Un cliente che non si presenta all'appuntamento ti costa due volte</strong>: perdi l'incasso
        di quel servizio e perdi la possibilità di dare quel posto a qualcun altro. La buona notizia è che il
        problema si può ridurre drasticamente: i saloni che usano promemoria automatici e qualche regola chiara
        vedono calare le mancate presenze <strong>fino al 50%</strong>. Ecco le 7 strategie che funzionano
        davvero, dalla più semplice alla più avanzata.
      </p>

      <h2>1. Invia un promemoria automatico 24 ore prima</h2>
      <p>
        È la strategia singola più efficace. La maggior parte dei no-show non è maleducazione: è{' '}
        <strong>dimenticanza</strong>. Un messaggio WhatsApp il giorno prima riporta l'appuntamento in cima
        alla mente del cliente, che ha ancora tempo per avvisarti se non può venire.
      </p>
      <ul>
        <li><strong>WhatsApp batte SMS ed email</strong>: è il canale che gli italiani aprono sempre.</li>
        <li><strong>Automatico, non manuale</strong>: se devi ricordarti tu di inviarli, prima o poi salta. Con <Link to="/gestionale-parrucchieri">un gestionale come Beauty CRM</Link> (piano Premium) il promemoria parte da solo 24 ore prima.</li>
        <li><strong>Testo semplice</strong>: data, ora, servizio e un modo facile per rispondere "non posso venire".</li>
      </ul>

      <h2>2. Chiedi la conferma attiva</h2>
      <p>
        Il promemoria non deve essere solo informativo: chiedi una risposta. "Confermi?" trasforma un messaggio
        passivo in un <strong>impegno preso dal cliente</strong> — e chi conferma per iscritto si presenta molto
        più spesso. Chi non risponde entro la sera? Lo richiami la mattina dopo, quando l'appuntamento è ancora
        recuperabile o riassegnabile.
      </p>

      <h2>3. Tieni una lista d'attesa per riempire i buchi</h2>
      <p>
        Anche con tutte le prevenzioni, qualche disdetta dell'ultimo minuto capiterà. La differenza è cosa succede
        dopo: se hai una <strong>lista di clienti pronti a subentrare</strong> ("mi chiami se si libera un posto?"),
        un buco in agenda si riempie con un messaggio. Segnati chi è flessibile con gli orari e contattalo per primo.
      </p>

      <h2>4. Metti nero su bianco la politica di cancellazione</h2>
      <p>
        Non serve essere aggressivi, serve essere <strong>chiari prima</strong>: "Puoi spostare o disdire gratis
        fino a 24 ore prima." Dillo alla prenotazione, scrivilo nel promemoria, mettilo sul biglietto da visita
        e sui social. I clienti rispettano molto di più le regole che conoscono — e tu hai un riferimento concreto
        quando qualcuno esagera.
      </p>

      <h2>5. Per i servizi lunghi, valuta un acconto</h2>
      <p>
        Colore completo, trattamenti da due ore, pacchetti: se un cliente salta, il danno è doppio. Per questi
        servizi molti saloni chiedono una <strong>piccola caparra</strong> o la conferma con carta. Non è
        obbligatorio per tutto: applicalo solo ai servizi ad alto valore o ai clienti con storico di no-show.
      </p>

      <h2>6. Conosci i tuoi "no-show seriali"</h2>
      <p>
        Con le schede cliente digitali vedi lo <strong>storico degli appuntamenti</strong> di ognuno, incluse le
        mancate presenze. Dopo 2-3 no-show, cambia approccio con quel cliente: conferma telefonica obbligatoria,
        prenotazioni solo negli orari meno richiesti, o acconto. Con i dati alla mano decidi tu, caso per caso,
        invece di subire.
      </p>

      <h2>7. Riempi l'agenda in modo intelligente</h2>
      <p>
        Le statistiche del tuo salone ti dicono quali sono le <strong>giornate e le fasce orarie a rischio</strong>
        (il sabato pomeriggio raramente ha no-show; il martedì mattina sì). Nei momenti deboli, concentra i clienti
        abituali e affidabili; nei momenti forti, dai priorità a chi ha sempre confermato. È un piccolo
        aggiustamento che riduce l'impatto dei buchi dove fanno più male.
      </p>

      <h2>Il punto di partenza</h2>
      <p>
        Non devi adottare tutto subito. Parti dalla strategia n.1 — il <strong>promemoria automatico</strong> —
        perché è quella con il miglior rapporto sforzo/risultato: la attivi una volta e lavora per te ogni giorno.
        Poi aggiungi conferma attiva e politica di cancellazione. Nel giro di un mese vedrai la differenza nel
        numero di sedie vuote.
      </p>
      <blockquote>
        I saloni che usano i promemoria WhatsApp automatici di Beauty CRM segnalano fino al 50% di mancate
        presenze in meno — senza telefonate, senza pensieri.
      </blockquote>
    </BlogArticle>
  );
}
