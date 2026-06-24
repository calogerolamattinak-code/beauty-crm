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
            <h2 className="text-lg font-semibold text-white mb-2">1. Introduzione</h2>
            <p>
              La presente Privacy Policy descrive come Beauty CRM (di seguito "il Titolare") raccoglie, 
              utilizza e protegge i dati personali degli utenti che utilizzano il servizio.
            </p>
            <p className="mt-2">
              Il Titolare tratta i dati personali nel rispetto del Regolamento Generale sulla Protezione 
              dei Dati (GDPR) e del D.Lgs. 196/2003 (Codice Privacy).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Titolare del Trattamento</h2>
            <p>
              Il Titolare del trattamento è:
            </p>
            <p className="mt-1">
              [Nome Azienda]<br />
              [Indirizzo]<br />
              Email: info@beautycrm.website
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Dati Raccolti</h2>
            <p>Raccogliamo le seguenti categorie di dati personali:</p>

            <h3 className="text-white font-medium mt-3 mb-1">3.1 Dati dell'Utente</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Nome e cognome</li>
              <li>Indirizzo email</li>
              <li>Numero di telefono</li>
              <li>Nome del salone</li>
              <li>Orari di lavoro e preferenze</li>
            </ul>

            <h3 className="text-white font-medium mt-3 mb-1">3.2 Dati dei Clienti dell'Utente</h3>
            <p className="mt-1">
              L'Utente può inserire nel sistema dati dei propri clienti (nome, telefono, email, 
              cronologia appuntamenti, preferenze). Questi dati sono trattati per conto dell'Utente, 
              che ne è il Titolare autonomo.
            </p>

            <h3 className="text-white font-medium mt-3 mb-1">3.3 Dati di Navigazione</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Indirizzo IP</li>
              <li>Browser e sistema operativo</li>
              <li>Pagine visitate e interazioni</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Finalità del Trattamento</h2>
            <p>I dati personali sono raccolti per le seguenti finalità:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Fornire e gestire il Servizio</li>
              <li>Assistenza clienti e supporto tecnico</li>
              <li>Comunicazioni relative al Servizio (aggiornamenti, fatture)</li>
              <li>Inviare promemoria WhatsApp (se il cliente ha dato consenso)</li>
              <li>Migliorare il Servizio attraverso analisi statistiche anonime</li>
              <li>Adempiere a obblighi di legge</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Base Giuridica</h2>
            <p>
              Il trattamento dei dati si basa su:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Esecuzione del contratto (art. 6.1.b GDPR)</li>
              <li>Consenso dell'interessato (art. 6.1.a GDPR) — per i promemoria WhatsApp</li>
              <li>Obblighi legali (art. 6.1.c GDPR)</li>
              <li>Legittimo interesse (art. 6.1.f GDPR) — per il miglioramento del Servizio</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Conservazione dei Dati</h2>
            <p>
              I dati personali sono conservati per tutta la durata dell'account e per i 12 mesi 
              successivi alla sua cancellazione, salvo diversi obblighi di legge (es. fatturazione: 10 anni).
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Condivisione dei Dati</h2>
            <p>
              I dati personali possono essere condivisi con:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Firebase (Google):</strong> hosting del database e autenticazione</li>
              <li><strong>Stripe:</strong> elaborazione pagamenti (solo per account Premium)</li>
              <li><strong>Twilio (se attivo):</strong> invio promemoria WhatsApp</li>
            </ul>
            <p className="mt-2">
              Tutti i fornitori sono conformi al GDPR e operano secondo standard di sicurezza adeguati.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Diritti dell'Interessato</h2>
            <p>L'Utente ha diritto di:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Accedere ai propri dati personali</li>
              <li>Richiedere la rettifica dei dati inesatti</li>
              <li>Richiedere la cancellazione dei dati (diritto all'oblio)</li>
              <li>Richiedere la limitazione del trattamento</li>
              <li>Richiedere la portabilità dei dati</li>
              <li>Opporsi al trattamento</li>
              <li>Revocare il consenso in qualsiasi momento</li>
              <li>Proporre reclamo al Garante per la Protezione dei Dati Personali</li>
            </ul>
            <p className="mt-2">
              Per esercitare i tuoi diritti, scrivi a: info@beautycrm.website
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Sicurezza dei Dati</h2>
            <p>
              Adottiamo misure di sicurezza tecniche e organizzative adeguate per proteggere i dati 
              personali da accessi non autorizzati, divulgazione, alterazione o distruzione. I dati sono 
              crittografati in transito (TLS) e a riposo. L'autenticazione è gestita tramite Firebase 
              Authentication con supporto Google Sign-In e autenticazione email/password.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Cookie</h2>
            <p>
              Il Servizio utilizza cookie tecnici essenziali per il funzionamento (token di autenticazione, 
              preferenze tema). Non utilizziamo cookie di profilazione o tracciamento pubblicitario.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Modifiche alla Privacy Policy</h2>
            <p>
              Il Titolare si riserva il diritto di aggiornare la presente Privacy Policy. Le modifiche 
              saranno comunicate via email o tramite avviso nel Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">12. Contatti</h2>
            <p>
              Per domande relative alla privacy:
            </p>
            <p className="mt-1">
              Email: info@beautycrm.website
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}