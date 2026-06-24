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
            <h2 className="text-lg font-semibold text-white mb-2">1. Premesse</h2>
            <p>
              Beauty CRM (di seguito "il Servizio") è un software di gestione per saloni di bellezza, 
              estetisti e professionisti del settore, offerto da [Nome Azienda], con sede in [Indirizzo] 
              (di seguito "il Titolare").
            </p>
            <p className="mt-2">
              I presenti Termini e Condizioni Generali (di seguito "Condizioni") disciplinano l'accesso 
              e l'utilizzo del Servizio da parte dell'utente (di seguito "l'Utente").
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">2. Accettazione delle Condizioni</h2>
            <p>
              L'utilizzo del Servizio implica l'accettazione piena e incondizionata delle presenti 
              Condizioni. Se l'Utente non accetta le Condizioni, non è autorizzato a utilizzare il Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">3. Registrazione e Account</h2>
            <p>
              Per utilizzare il Servizio, l'Utente deve registrarsi creando un account. L'Utente garantisce 
              che le informazioni fornite durante la registrazione sono veritiere, accurate e complete.
            </p>
            <p className="mt-2">
              L'Utente è responsabile della riservatezza delle proprie credenziali di accesso e di tutte 
              le attività che avvengono sotto il proprio account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">4. Descrizione del Servizio</h2>
            <p>
              Beauty CRM offre funzionalità di:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Gestione appuntamenti e calendario</li>
              <li>Gestione clienti e anagrafica</li>
              <li>Gestione servizi e listino prezzi</li>
              <li>Gestione cassa e incassi</li>
              <li>Gestione magazzino e scorte</li>
              <li>Statistiche e reportistica</li>
              <li>Promemoria WhatsApp (solo piano Premium)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">5. Piani e Pagamenti</h2>
            <p>
              Il Servizio è offerto secondo due piani:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li><strong>Free:</strong> gratuito, con un limite massimo di 30 clienti e funzionalità base.</li>
              <li><strong>Premium:</strong> a pagamento, con clienti illimitati e funzionalità avanzate.</li>
            </ul>
            <p className="mt-2">
              I pagamenti per il piano Premium vengono elaborati tramite Stripe. L'abbonamento è 
              mensile e si rinnova automaticamente salvo disdetta. L'Utente può cancellare l'abbonamento 
              in qualsiasi momento dalle impostazioni del proprio account.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">6. Obblighi dell'Utente</h2>
            <p>
              L'Utente si impegna a:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Utilizzare il Servizio in conformità con la legge</li>
              <li>Non utilizzare il Servizio per scopi illeciti o fraudolenti</li>
              <li>Non tentare di accedere a parti non autorizzate del sistema</li>
              <li>Non diffondere malware o codice dannoso attraverso il Servizio</li>
              <li>Rispettare la privacy dei propri clienti</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">7. Trattamento dei Dati Personali</h2>
            <p>
              Il trattamento dei dati personali è disciplinato dalla Privacy Policy del Servizio, 
              consultabile al link dedicato. L'Utente è il Titolare del trattamento dei dati dei 
              propri clienti, mentre il Titolare del Servizio agisce come Responsabile del trattamento.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">8. Limitazione di Responsabilità</h2>
            <p>
              Il Servizio viene fornito "così com'è", senza garanzie esplicite o implicite. Il Titolare 
              non sarà responsabile per danni diretti, indiretti, incidentali o consequenziali derivanti 
              dall'uso o dall'impossibilità di usare il Servizio.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">9. Modifiche alle Condizioni</h2>
            <p>
              Il Titolare si riserva il diritto di modificare le presenti Condizioni in qualsiasi momento. 
              Le modifiche saranno comunicate all'Utente via email o tramite avviso nel Servizio. 
              L'uso continuato del Servizio dopo le modifiche costituisce accettazione delle nuove Condizioni.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">10. Contatti</h2>
            <p>
              Per qualsiasi domanda relativa ai presenti Termini, contattare:
            </p>
            <p className="mt-1">Email: info@beautycrm.website</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-white mb-2">11. Legge Applicabile</h2>
            <p>
              Le presenti Condizioni sono regolate dalla legge italiana. Per qualsiasi controversia 
              sarà competente il foro di residenza dell'Utente.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}