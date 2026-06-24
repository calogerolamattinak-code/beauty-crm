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
        <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: Giugno 2026</p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Informazioni Generali</h2>
            <p>
              Beauty CRM (di seguito "il Servizio" o "la Piattaforma") è un software di gestione 
              per saloni di bellezza, estetisti, barberie e professionisti del settore benessere, 
              sviluppato e offerto da [Nome Azienda], con sede legale in [Indirizzo] 
              (di seguito "il Titolare", "noi" o "nostro").
            </p>
            <p className="mt-2">
              I presenti Termini e Condizioni Generali (di seguito "le Condizioni") costituiscono 
              un accordo legalmente vincolante tra l'utente (di seguito "l'Utente", "tu" o "titolare 
              dell'account") e il Titolare in relazione all'accesso e all'utilizzo del Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Accettazione delle Condizioni</h2>
            <p>
              Registrandoti e utilizzando il Servizio, l'Utente dichiara di aver letto, compreso e 
              accettato tutte le presenti Condizioni. Se non accetti una qualsiasi parte delle Condizioni, 
              non sei autorizzato a registrarti o utilizzare il Servizio.
            </p>
            <p className="mt-2">
              L'uso continuato del Servizio dopo la pubblicazione di eventuali modifiche costituisce 
              accettazione automatica delle nuove Condizioni. Ti consigliamo di consultare periodicamente 
              questa pagina.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Registrazione e Account</h2>
            <p>Per accedere al Servizio, l'Utente deve creare un account fornendo:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Nome e cognome</li>
              <li>Indirizzo email valido</li>
              <li>Nome del salone o attività</li>
              <li>Una password sicura</li>
            </ul>
            <p className="mt-2">
              L'Utente garantisce che tutte le informazioni fornite sono veritiere, aggiornate e complete. 
              È responsabile della riservatezza delle proprie credenziali di accesso e di tutte le attività 
              che avvengono sotto il proprio account. In caso di utilizzo non autorizzato, l'Utente deve 
              comunicarlo immediatamente al supporto.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Descrizione del Servizio</h2>
            <p>
              Beauty CRM mette a disposizione degli operatori del settore benessere una suite completa 
              di strumenti digitali per la gestione quotidiana della propria attività. Le funzionalità 
              includono:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Agenda e Calendario:</strong> gestione appuntamenti con vista settimanale, slot da 30 minuti, orario 05:00-20:00</li>
              <li><strong>Anagrafica Clienti:</strong> archivio clienti con cronologia appuntamenti, preferenze, note e foto</li>
              <li><strong>Servizi e Listino:</strong> catalogo servizi personalizzabile con durata, prezzo e colore</li>
              <li><strong>Dashboard e Statistiche:</strong> riepilogo giornaliero con incassi, appuntamenti e trend (piano Premium)</li>
              <li><strong>Promemoria WhatsApp:</strong> notifiche automatiche ai clienti 24h prima dell'appuntamento (piano Premium)</li>
              <li><strong>Backup automatico:</strong> salvaguardia quotidiana dei dati su cloud (piano Premium)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Piani e Corrispettivi</h2>
            <p>
              Il Servizio è offerto secondo i seguenti piani di abbonamento:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-2">
              <li>
                <strong>Piano Free (gratuito):</strong> accesso illimitato alle funzionalità base con 
                un limite massimo di 30 clienti registrati. Include calendario, gestione clienti base 
                e servizi. Nessuna carta di credito richiesta.
              </li>
              <li>
                <strong>Piano Premium (a pagamento):</strong> tutte le funzionalità senza limiti, 
                inclusi clienti illimitati, promemoria WhatsApp automatici, statistiche avanzate, 
                brand personalizzato e backup automatico. Il costo è di €9,90 (IVA inclusa) al mese, 
                con pagamento ricorrente elaborato tramite Stripe.
              </li>
            </ul>
            <p className="mt-2">
              I prezzi possono essere modificati con preavviso di 30 giorni via email. Le modifiche 
              non si applicano al ciclo di fatturazione in corso.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Fatturazione e Rinnovo</h2>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L'abbonamento Premium si rinnova automaticamente ogni mese</li>
              <li>Il pagamento viene addebitato il primo giorno di ogni ciclo di fatturazione</li>
              <li>L'Utente può cancellare l'abbonamento in qualsiasi momento dalle impostazioni dell'account o contattando il supporto</li>
              <li>In caso di cancellazione, l'accesso alle funzionalità Premium rimane attivo fino alla fine del periodo di fatturazione corrente</li>
              <li>Non sono previsti rimborsi per periodi parziali</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Obblighi dell'Utente</h2>
            <p>L'Utente si impegna a:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Utilizzare il Servizio in conformità con le leggi e normative applicabili</li>
              <li>Non utilizzare il Servizio per scopi illeciti, fraudolenti o dannosi</li>
              <li>Non tentare di accedere a parti non autorizzate del sistema, API o dati altrui</li>
              <li>Non diffondere virus, malware o codice dannoso attraverso la Piattaforma</li>
              <li>Rispettare la normativa GDPR nel trattamento dei dati dei propri clienti</li>
              <li>Non rivendere, cedere o sublicenziare l'account a terzi</li>
              <li>Comunicare tempestivamente eventuali violazioni della sicurezza</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Trattamento dei Dati Personali</h2>
            <p>
              Il trattamento dei dati personali è disciplinato dalla nostra Privacy Policy, 
              disponibile alla pagina dedicata. In sintesi:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>L'Utente è il Titolare del trattamento dei dati dei propri clienti inseriti nella Piattaforma</li>
              <li>Il Titolare del Servizio agisce come Responsabile del trattamento ai sensi dell'art. 28 GDPR</li>
              <li>I dati sono trattati esclusivamente per erogare il Servizio e non vengono ceduti a terzi</li>
              <li>I dati sono crittografati in transito (TLS) e a riposo</li>
              <li>I server sono situati in Europa (Google Cloud, Belgio)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Proprietà Intellettuale</h2>
            <p>
              Tutti i diritti di proprietà intellettuale relativi al Servizio, inclusi software, 
              design, loghi, marchi e contenuti originali, sono di proprietà esclusiva del Titolare 
              o dei suoi licenziatari. L'Utente non acquisisce alcun diritto di proprietà 
              sull'utilizzo del Servizio.
            </p>
            <p className="mt-2">
              I dati inseriti dall'Utente (clienti, appuntamenti, servizi) rimangono di piena 
              proprietà dell'Utente, che può esportarli in qualsiasi momento richiedendone una copia.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Limitazione di Responsabilità</h2>
            <p>
              Il Servizio viene fornito "così com'è" e "come disponibile", senza garanzie esplicite 
              o implicite di funzionamento ininterrotto o privo di errori. Il Titolare non sarà 
              responsabile per:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Danni diretti o indiretti derivanti dall'uso o dall'impossibilità di usare il Servizio</li>
              <li>Perdita di dati o profitti, anche se prevedibile</li>
              <li>Interruzioni del servizio dovute a manutenzione, guasti tecnici o cause di forza maggiore</li>
              <li>Contenuti o condotta degli utenti</li>
              <li>Danni derivanti da attacchi informatici nonostante l'adozione di misure di sicurezza standard</li>
            </ul>
            <p className="mt-2">
              La responsabilità complessiva del Titolare per qualsiasi reclamo relativo al Servizio 
              è limitata all'importo pagato dall'Utente nei 12 mesi precedenti il reclamo.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Sospensione e Cancellazione</h2>
            <p>
              Il Titolare si riserva il diritto di sospendere o cancellare l'account di un Utente in 
              caso di violazione delle presenti Condizioni, uso fraudolento o inattività prolungata 
              (oltre 12 mesi). L'Utente può cancellare il proprio account in qualsiasi momento 
              contattando il supporto.
            </p>
            <p className="mt-2">
              In caso di cancellazione, i dati dell'Utente saranno conservati per 30 giorni, 
              trascorsi i quali verranno eliminati definitivamente, salvo obblighi di legge 
              (es. dati fiscali conservati per 10 anni).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">12. Legge Applicabile e Foro Competente</h2>
            <p>
              Le presenti Condizioni sono regolate dalla legge italiana. Per qualsiasi controversia 
              che dovesse sorgere in relazione all'interpretazione, esecuzione o validità delle 
              presenti Condizioni, sarà competente il foro di residenza o domicilio dell'Utente, 
              se consumatore, o il Foro di Roma per le controversie tra professionisti.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">13. Contatti e Reclami</h2>
            <p>
              Per qualsiasi domanda, reclamo o richiesta relativa ai presenti Termini, contattaci:
            </p>
            <p className="mt-1">
              <strong>Email:</strong> info@beautycrm.website<br />
              <strong>Risposta:</strong> entro 48 ore lavorative
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}