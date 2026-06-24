import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export function Privacy() {
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

        <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
        <p className="text-sm text-gray-500 mb-8">Ultimo aggiornamento: Giugno 2026</p>

        <div className="space-y-6 text-gray-300 text-sm leading-relaxed">
          <section>
            <h2 className="text-lg font-semibold text-white mb-2">1. Premessa</h2>
            <p>
              Beauty CRM (di seguito "il Titolare" o "noi") protegge la privacy degli utenti 
              in conformità con il Regolamento Generale sulla Protezione dei Dati (Regolamento UE 
              2016/679, di seguito "GDPR") e il D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018 
              ("Codice Privacy").
            </p>
            <p className="mt-2">
              La presente Privacy Policy descrive come raccogliamo, utilizziamo, conserviamo e 
              proteggiamo i dati personali degli utenti che visitano il nostro sito web 
              (beautycrm.website) e utilizzano il nostro servizio software CRM. Ti invitiamo a 
              leggere attentamente questo documento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Titolare del Trattamento</h2>
            <p>Il Titolare del trattamento dei dati è:</p>
            <p className="mt-1 text-white">
              [Nome Azienda]<br />
              [Indirizzo Sede Legale]<br />
              <strong>Email:</strong> info@beautycrm.website
            </p>
            <p className="mt-2">
              Per esercitare i tuoi diritti o per qualsiasi domanda relativa al trattamento dei 
              dati personali, puoi contattarci all'indirizzo email sopra indicato. Risponderemo 
              entro 30 giorni.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Categorie di Dati Raccolti</h2>

            <h3 className="text-white font-medium mt-3 mb-1">3.1 Dati dell'Utente (Titolare dell'Account)</h3>
            <p>Quando crei un account, raccogliamo:</p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Nome e cognome</li>
              <li>Indirizzo email (utilizzato anche per l'autenticazione)</li>
              <li>Numero di telefono (opzionale, per promemoria)</li>
              <li>Nome del salone o attività</li>
              <li>Orari di lavoro e preferenze di calendario</li>
              <li>Preferenza tema (verde, rosa, viola)</li>
              <li>Stato dell'abbonamento (Free/Premium)</li>
            </ul>

            <h3 className="text-white font-medium mt-3 mb-1">3.2 Dati dei Clienti dell'Utente</h3>
            <p className="mt-1">
              L'Utente può inserire volontariamente nella Piattaforma dati personali dei propri 
              clienti, tra cui:
            </p>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Nome e cognome</li>
              <li>Numero di telefono</li>
              <li>Indirizzo email</li>
              <li>Cronologia appuntamenti e servizi ricevuti</li>
              <li>Preferenze e note personali</li>
              <li>Data di nascita (opzionale)</li>
            </ul>
            <p className="mt-2">
              IMPORTANTE: Per questi dati, l'Utente del Servizio agisce come Titolare autonomo 
              del trattamento. Beauty CRM agisce esclusivamente come Responsabile del trattamento 
              (art. 28 GDPR). È responsabilità dell'Utente ottenere il consenso dei propri clienti 
              al trattamento dei dati e informarli della presente Privacy Policy.
            </p>

            <h3 className="text-white font-medium mt-3 mb-1">3.3 Dati di Navigazione</h3>
            <ul className="list-disc pl-5 mt-1 space-y-1">
              <li>Indirizzo IP (anonimizzato dopo 24 ore)</li>
              <li>Tipo di browser e versione</li>
              <li>Sistema operativo</li>
              <li>Pagine visitate e interazioni con l'interfaccia</li>
              <li>Durata della sessione</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Finalità del Trattamento</h2>
            <p>I dati personali sono trattati esclusivamente per le seguenti finalità:</p>
            <table className="w-full mt-3 text-sm border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-2 pr-4 text-white font-medium">Finalità</th>
                  <th className="text-left py-2 text-white font-medium">Base Giuridica</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Fornire, gestire e mantenere il Servizio CRM</td>
                  <td className="py-2 text-gray-400">Esecuzione del contratto (art. 6.1.b GDPR)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Autenticazione e sicurezza dell'account</td>
                  <td className="py-2 text-gray-400">Obbligo legale (art. 6.1.c GDPR)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Inviare promemoria WhatsApp ai clienti</td>
                  <td className="py-2 text-gray-400">Consenso (art. 6.1.a GDPR)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Elaborare pagamenti (abbonamento Premium)</td>
                  <td className="py-2 text-gray-400">Esecuzione del contratto (art. 6.1.b GDPR)</td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-2 pr-4">Comunicazioni di servizio (fatture, aggiornamenti)</td>
                  <td className="py-2 text-gray-400">Obbligo legale (art. 6.1.c GDPR)</td>
                </tr>
                <tr>
                  <td className="py-2 pr-4">Miglioramento del Servizio tramite analisi statistiche anonime</td>
                  <td className="py-2 text-gray-400">Legittimo interesse (art. 6.1.f GDPR)</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Destinatari dei Dati</h2>
            <p>I dati personali possono essere comunicati ai seguenti fornitori autorizzati, tutti conformi al GDPR:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                <strong>Google Cloud / Firebase (Irlanda/Belgio):</strong> hosting del database 
                (Firestore), autenticazione (Firebase Auth), storage file. 
                <a href="https://cloud.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline ml-1">Privacy Google</a>
              </li>
              <li>
                <strong>Stripe (UE/Stati Uniti):</strong> elaborazione pagamenti per abbonamenti Premium. 
                Stripe è certificato Privacy Shield. 
                <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline ml-1">Privacy Stripe</a>
              </li>
              <li>
                <strong>Twilio (se attivo):</strong> invio di promemoria WhatsApp. 
                <a href="https://www.twilio.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline ml-1">Privacy Twilio</a>
              </li>
            </ul>
            <p className="mt-2">
              I dati non vengono venduti, ceduti o condivisi con terzi per finalità di marketing 
              o profilazione commerciale. Non utilizziamo pubblicità comportamentale.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Periodo di Conservazione</h2>
            <p>I dati personali sono conservati per il tempo strettamente necessario alle finalità sopra descritte:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Dati dell'account:</strong> per tutta la durata dell'account e fino a 12 mesi dopo la cancellazione</li>
              <li><strong>Dati dei clienti dell'Utente:</strong> vengono eliminati entro 30 giorni dalla cancellazione dell'account dell'Utente</li>
              <li><strong>Dati di fatturazione:</strong> conservati per 10 anni per obblighi fiscali (art. 2220 c.c.)</li>
              <li><strong>Log di navigazione:</strong> anonimizzati dopo 24 ore, conservati in forma aggregata per 26 mesi</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Trasferimento dei Dati</h2>
            <p>
              I dati personali sono trattati principalmente all'interno dello Spazio Economico 
              Europeo (SEE). Se alcuni fornitori (es. Stripe) trasferiscono dati al di fuori del SEE, 
              ciò avviene sulla base di Clausole Contrattuali Standard (SCC) approvate dalla 
              Commissione Europea, che garantiscono un livello di protezione adeguato.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Misure di Sicurezza</h2>
            <p>
              Adottiamo misure di sicurezza tecniche e organizzative adeguate per proteggere i dati 
              personali, tra cui:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Crittografia TLS 1.3 per tutti i dati in transito</li>
              <li>Crittografia a riposo dei dati su Firestore e Storage</li>
              <li>Autenticazione a due fattori (via Google o email/password)</li>
              <li>Firebase Authentication con protezione anti-brute-force</li>
              <li>Accesso ai dati limitato ai soli amministratori autorizzati</li>
              <li>Audit periodici di sicurezza</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Diritti dell'Interessato</h2>
            <p>In qualità di interessato, hai diritto di:</p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li><strong>Accesso</strong> — ottenere conferma se i tuoi dati sono trattati e accedervi (art. 15 GDPR)</li>
              <li><strong>Rettifica</strong> — correggere dati inesatti o incompleti (art. 16 GDPR)</li>
              <li><strong>Cancellazione</strong> — ottenere la cancellazione dei dati (diritto all'oblio, art. 17 GDPR)</li>
              <li><strong>Limitazione</strong> — limitare il trattamento in determinate circostanze (art. 18 GDPR)</li>
              <li><strong>Portabilità</strong> — ricevere i dati in formato strutturato e trasferirli (art. 20 GDPR)</li>
              <li><strong>Opposizione</strong> — opporti al trattamento per legittimo interesse (art. 21 GDPR)</li>
              <li><strong>Revoca del consenso</strong> — in qualsiasi momento, senza pregiudicare la liceità del trattamento precedente</li>
            </ol>
            <p className="mt-2">
              Per esercitare i tuoi diritti, scrivi a: <strong>info@beautycrm.website</strong>. 
              Risponderemo entro 30 giorni. Hai inoltre il diritto di proporre reclamo al 
              Garante per la Protezione dei Dati Personali (<a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">www.garanteprivacy.it</a>).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Cookie e Tecnologie Analoghe</h2>
            <p>
              Il Servizio utilizza esclusivamente cookie tecnici essenziali per il funzionamento:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Token di autenticazione</strong> (Firebase Auth, durata sessione)</li>
              <li><strong>Preferenza tema</strong> (nome del tema selezionato, localStorage, persistente)</li>
            </ul>
            <p className="mt-2">
              NON utilizziamo cookie di profilazione, tracciamento pubblicitario, analytics di 
              terze parti o social media pixel. I nostri log di navigazione sono anonimizzati.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Modifiche alla Privacy Policy</h2>
            <p>
              Il Titolare si riserva il diritto di aggiornare la presente Privacy Policy in qualsiasi 
              momento per riflettere cambiamenti normativi, tecnologici o organizzativi. Le modifiche 
              saranno comunicate:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Tramite email all'indirizzo associato all'account</li>
              <li>Tramite avviso nella dashboard del Servizio</li>
              <li>Con almeno 30 giorni di preavviso per modifiche sostanziali</li>
            </ul>
            <p className="mt-2">
              Ti consigliamo di consultare periodicamente questa pagina per rimanere aggiornato.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">12. Contatti</h2>
            <p>
              Per qualsiasi domanda, richiesta o chiarimento relativo alla presente Privacy Policy 
              e al trattamento dei tuoi dati personali:
            </p>
            <p className="mt-2 text-white">
              <strong>Email:</strong> info@beautycrm.website<br />
              <strong>Tempo di risposta:</strong> entro 30 giorni<br />
              <strong>Autorità di controllo:</strong> Garante per la Protezione dei Dati Personali — 
              <a href="https://www.garanteprivacy.it" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">www.garanteprivacy.it</a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}