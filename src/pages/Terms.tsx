import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Terms() {
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

        <h1 className="text-3xl font-bold mb-2">Termini e Condizioni Generali</h1>
        <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: 26/06/2026</p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <p>
            Le presenti condizioni generali regolano il rapporto tra <strong className="text-white">Lamattina Calogero</strong> (di seguito "<strong className="text-white">Proprietario</strong>"), titolare del servizio <strong className="text-white">Beauty CRM</strong> (di seguito "<strong className="text-white">Servizio</strong>" o "<strong className="text-white">Piattaforma</strong>"), con <strong className="text-white">P.IVA 02176270854</strong> e <strong className="text-white">Sede Legale in Piazza Europa 5, 93010 Campofranco (CL)</strong>, e l'Utente (di seguito "<strong className="text-white">Cliente</strong>"), e costituiscono una licenza "Software as a Service – SaaS" relativa alla Piattaforma per la fruizione dei servizi offerti.
          </p>

          {/* 01 — Oggetto e Definizioni */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">01 — Oggetto e Definizioni</h2>
            <p>
              Il Cliente è un professionista (studi legali, commercialisti, liberi professionisti) interessato a utilizzare la Piattaforma in connessione alla propria attività imprenditoriale o professionale. La Piattaforma non è rivolta a consumatori ai sensi dell'art. 4 del D.Lgs. 206/2005.
            </p>
            <p className="mt-2">
              L'Account è strettamente personale ed è fatto divieto di condividere le credenziali con terzi. L'accesso contemporaneo da più dispositivi non autorizzati costituisce grave inadempimento.
            </p>
          </section>

          {/* 02 — Servizi e Licenza SaaS */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">02 — Servizi e Licenza SaaS</h2>
            <p>
              Beauty CRM concede una licenza non esclusiva, non trasferibile e limitata alla durata del Contratto per l'utilizzo della Piattaforma. I servizi includono supporto alla visualizzazione, navigazione interattiva e analisi di testi normativi.
            </p>
            <p className="mt-2">
              Beauty CRM si avvale di Fornitori Terzi (cloud provider, AI provider, gestori pagamenti) per l'erogazione dei Servizi Essenziali. Il Cliente autorizza il Proprietario alla selezione e gestione di tali fornitori.
            </p>
            <p className="mt-2">
              In caso di sospensione o interruzione della connessione con canali di pubblicazioni di Enti Pubblici, o di sospensione o cessazione del rapporto contrattuale tra il Proprietario e un Fornitore Terzo ovvero tra il Cliente e un Fornitore Terzo ovvero tra il Cliente e/o il Proprietario e un Ente Terzo, il Servizio potrebbe non essere temporaneamente in grado di fornire tutti o parte dei Servizi. In tali casi il Proprietario farà quanto ragionevolmente in suo potere per individuare un nuovo canale di pubblicazione dell'Ente Pubblico o un nuovo Fornitore Terzo e ripristinare i Servizi sospesi nel minor tempo possibile.
            </p>
            <p className="mt-2">
              In ogni tempo, il Proprietario è libero di proporre modifiche al funzionamento della Piattaforma, che non siano pregiudizievoli per l'utilizzo dei Servizi. Nell'eventualità in cui sia necessario effettuare interventi di manutenzione, ordinari e/o straordinari, al fine di assicurare il corretto accesso ai Servizi, il Proprietario si riserva la facoltà di procedere, previa preventiva comunicazione al Cliente (a mezzo e-mail), alla sospensione temporanea dei Servizi impegnandosi a riattivarli nel più breve tempo possibile in base alla natura dell'intervento di manutenzione che si sarà reso necessario.
            </p>
          </section>

          {/* 03 — Uso dell'Intelligenza Artificiale */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">03 — Uso dell'Intelligenza Artificiale</h2>
            <p className="font-medium text-white">Disclaimer AI:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Il Sistema di Intelligenza Artificiale include un margine di incertezza e può generare contenuti non aggiornati o approssimativi.</li>
              <li>La Piattaforma non costituisce un "sistema di IA per finalità generali" ai sensi del Regolamento UE 2024/1689 (AI Act).</li>
              <li>I contenuti generati devono essere sempre validati da un professionista umano.</li>
            </ul>
          </section>

          {/* 04 — Limitazione di Responsabilità */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">04 — Limitazione di Responsabilità</h2>
            <p>
              Salvo dolo o colpa grave, Beauty CRM non è responsabile per decisioni o atti eseguiti dal Cliente sulla base dei Contenuti generati. Il servizio è un mero supporto tecnico e non sostituisce il controllo decisionale e la verifica professionale dell'Utente.
            </p>
          </section>

          {/* 05 — Corrispettivi e Pagamenti */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">05 — Corrispettivi e Pagamenti</h2>
            <p>
              Il Cliente si impegna al pagamento dei Corrispettivi previsti dal Piano selezionato. I pagamenti sono gestiti tramite Stripe (Gestore dei Pagamenti esterno). In caso di mancato pagamento, Beauty CRM si riserva il diritto di sospendere i Servizi e risolvere il Contratto.
            </p>
          </section>

          {/* 06 — Politica di Rimborso */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">06 — Politica di Rimborso</h2>

            <h3 className="text-white font-medium mt-3 mb-1">Politica di rimborso limitata</h3>
            <p>Offriamo rimborsi esclusivamente nei seguenti casi specifici:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Errore di fatturazione (addebito duplicato, importo errato, ecc.).</li>
              <li>Malfunzionamento grave del Servizio per cui non possiamo fornire una soluzione o una patch correttiva entro 14 giorni.</li>
              <li>Mancata erogazione o inaccessibilità prolungata ed ingiustificata delle funzionalità Premium.</li>
            </ul>

            <h3 className="text-white font-medium mt-3 mb-1">Procedura di rimborso</h3>
            <p>
              Le richieste di rimborso devono essere inviate entro 30 giorni dall'addebito. Contattaci all'indirizzo e-mail <a href="mailto:info@beautycrm.website" className="text-primary-500 hover:underline">info@beautycrm.website</a>. Verificheremo la richiesta e, se approvata, il rimborso sarà addebitato ed elaborato entro 10 giorni lavorativi.
            </p>

            <h3 className="text-white font-medium mt-3 mb-1">Nessun rimborso per cancellazione</h3>
            <p>
              Se cancelli il tuo abbonamento, non riceverai alcun rimborso per il periodo già pagato. La cancellazione avrà effetto immediato.
            </p>
          </section>

          {/* 07 — Cancellazione, Sospensione e Recesso */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">07 — Cancellazione, Sospensione e Recesso</h2>

            <h3 className="text-white font-medium mt-3 mb-1">Durata del Contratto</h3>
            <p>
              Il Contratto è efficace a partire dalla data di sottoscrizione (ovvero, se antecedente, dalla data di attivazione del Piano) e ha una durata pari a quanto indicato nel Piano selezionato, con rinnovo automatico per ugual periodo a ogni scadenza mensile o annuale con tacito rinnovo, salvo disdetta dell'Utente Proprietario o del Proprietario.
            </p>

            <h3 className="text-white font-medium mt-3 mb-1">Cancellazione e recesso da parte tua</h3>
            <p>
              Puoi cancellare il tuo abbonamento in qualsiasi momento direttamente dal tuo account. La cancellazione avrà effetto immediato. Non riceverai rimborsi per le porzioni di mesi o anni inutilizzati. La disdetta deve essere comunicata secondo la procedura indicata sulla Piattaforma.
            </p>

            <h3 className="text-white font-medium mt-3 mb-1">Sospensione o cancellazione da parte nostra</h3>
            <p>Possiamo sospendere o cancellare il tuo account se:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Violi questi Termini o la nostra Politica di Accettabile Utilizzo delle risorse e dell'IA di Beauty CRM.</li>
              <li>Sei rimasto inattivo per più di 12 mesi senza contattarci.</li>
              <li>Il tuo account è associato a tentativi di frode, abuso o in generale attività illegale.</li>
              <li>Non effettui i pagamenti dovuti entro 30 giorni dalla scadenza stabilita.</li>
            </ul>
            <p className="mt-2">
              Ti invieremo un preavviso scritto di almeno 30 giorni prima di procedere, a meno che la gravità della violazione non richieda una sospensione o cancellazione immediata per la sicurezza dell'infrastruttura.
            </p>
          </section>

          {/* 08 — Proprietà Intellettuale */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">08 — Proprietà Intellettuale</h2>
            <p>
              Tutti i diritti di proprietà intellettuale relativi alla Piattaforma (software, algoritmi, know-how) sono di esclusiva titolarità di Beauty CRM. È vietato il reverse engineering o la duplicazione della tecnologia. Beauty CRM ha diritto di utilizzare il logo del Cliente per finalità di marketing (case history), salvo revoca scritta.
            </p>
          </section>

          {/* 09 — Modifiche al Contratto */}
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">09 — Modifiche al Contratto</h2>
            <p>
              L'Utente prende atto e accetta che il Proprietario potrà in qualsiasi momento modificare il Contratto per sopravvenute esigenze tecniche (considerato che i Servizi vengono svolti con tecnologie in continua evoluzione), economiche e gestionali e per modifiche e riforme delle leggi e dei regolamenti applicabili (ivi incluso, a titolo esemplificativo e non esaustivo, i Corrispettivi, la tipologia e la modalità di funzionamento della Piattaforma ed esecuzione dei Servizi).
            </p>
          </section>

          {/* Contatti Legali */}
          <section className="border-t border-white/10 pt-6 mt-8">
            <h2 className="text-lg font-semibold text-white mb-3">Contatti Legali</h2>
            <div className="space-y-1 text-gray-400">
              <p><strong className="text-white">Beauty CRM</strong> (Servizio)</p>
              <p><strong className="text-white">Lamattina Calogero</strong> (Proprietario)</p>
              <p>Sede Legale: Piazza Europa 5, 93010 Campofranco (CL)</p>
              <p>P.IVA: 02176270854</p>
              <p>
                E-mail:{' '}
                <a href="mailto:info@beautycrm.website" className="text-primary-500 hover:underline">
                  info@beautycrm.website
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}