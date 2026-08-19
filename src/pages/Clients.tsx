import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import {
  Plus,
  Phone,
  ChevronRight,
  Users,
  Calendar,
  Pencil,
} from 'lucide-react';
import { AddClientModal } from '../components/AddClientModal';
import type { Client, Service, Appointment } from '../types';
import { useSubscription, FREE_CLIENT_LIMIT } from '../lib/subscription';
import { ClientLimitBar, PremiumBadge } from '../components/ui/PremiumGate';
import { formatCurrency, formatDate, formatTime } from '../lib/format';

/* ─── Status badge helper ─── */

function StatusBadge({ status }: { status: Appointment['status'] }) {
  const config: Record<Appointment['status'], { bg: string; text: string; label: string }> = {
    confirmed: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Confermato' },
    completed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Completato' },
    cancelled: { bg: 'bg-red-100', text: 'text-red-700', label: 'Cancellato' },
    'no-show': { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Non presentato' },
  };
  const c = config[status];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

/* ─── Main Page ─── */

export function Clients() {
  const { firebaseUser } = useAuth();
  const { isPremium, features } = useSubscription();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [detailClient, setDetailClient] = useState<Client | null>(null);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'clients'),
      where('userId', '==', uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastVisit: doc.data().lastVisit?.toDate(),
      })) as Client[];
      setClients(results);
      setLoading(false);
    });

    return unsub;
  }, [firebaseUser?.uid]);

  const filtered = clients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const handleOpenAdd = () => {
    if (clients.length >= features.clientLimit) {
      alert(`🔒 Hai raggiunto il limite di ${FREE_CLIENT_LIMIT} clienti del piano Free. Passa a Premium per clienti illimitati!`);
      return;
    }
    setEditingClient(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (client: Client) => {
    setEditingClient(client);
    setShowAddModal(true);
  };

  const handleOpenDetail = (client: Client) => {
    setDetailClient(client);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-text-dark">Clienti</h1>
            <PremiumBadge isPremium={isPremium} />
          </div>
          <p className="text-sm text-text-muted">{filtered.length} clienti</p>
        </div>
        <Button onClick={handleOpenAdd}>
          <Plus className="w-4 h-4 mr-1" />
          Nuovo
        </Button>
      </div>

      <ClientLimitBar current={clients.length} max={features.clientLimit} />

      <div className="mb-4">
        <Input
          placeholder="Cerca cliente per nome o telefono..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState onAdd={handleOpenAdd} />
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <ClientCard
              key={client.id}
              client={client}
              onClick={() => handleOpenDetail(client)}
            />
          ))}
        </div>
      )}

      <AddClientModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingClient(null);
        }}
        editingClient={editingClient}
      />

      <ClientDetailModal
        client={detailClient}
        onClose={() => setDetailClient(null)}
        onEdit={handleOpenEdit}
      />
    </div>
  );
}

/* ─── ClientCard ─── */

interface ClientCardProps {
  client: Client;
  onClick: () => void;
}

function ClientCard({ client, onClick }: ClientCardProps) {
  return (
    <Card
      onClick={onClick}
      className="flex items-center gap-3 cursor-pointer"
    >
      <Avatar name={client.name} size="md" />
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-text-dark truncate">{client.name}</h3>
        <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
          <span className="flex items-center gap-1">
            <Phone className="w-3 h-3" />
            {client.phone}
          </span>
          {client.lastVisit && (
            <span>Ultima visita: {client.lastVisit.toLocaleDateString('it-IT')}</span>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <a
          href={`tel:${client.phone}`}
          onClick={(e) => e.stopPropagation()}
          className="btn-ghost w-8 h-8 rounded-full bg-[var(--primary-50)] text-primary-500 flex items-center justify-center"
        >
          <Phone className="w-3.5 h-3.5" />
        </a>
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </div>
    </Card>
  );
}

/* ─── Client Detail Modal ─── */

function ClientDetailModal({
  client,
  onClose,
  onEdit,
}: {
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
}) {
  const navigate = useNavigate();
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);

  const { firebaseUser } = useAuth();

  // Load services to resolve preferred service IDs to names
  useEffect(() => {
    if (!firebaseUser?.uid || !client) return;
    const unsub = onSnapshot(
      query(collection(db, 'services'), where('userId', '==', firebaseUser.uid)),
      (snap) => {
        setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)));
      }
    );
    return unsub;
  }, [firebaseUser?.uid, client]);

  // Load appointment history for this client
  useEffect(() => {
    if (!client?.id) return;
    setLoadingApps(true);

    const q = query(
      collection(db, 'appointments'),
      where('clientId', '==', client.id),
      orderBy('startTime', 'desc')
    );

    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        startTime: d.data().startTime?.toDate(),
        endTime: d.data().endTime?.toDate(),
      })) as Appointment[];
      setAppointments(apps);
      setLoadingApps(false);
    });

    return unsub;
  }, [client?.id]);

  if (!client) return null;

  const preferredServiceNames = client.preferredServices
    .map((id) => services.find((s) => s.id === id))
    .filter(Boolean) as Service[];

  return (
    <Modal isOpen={!!client} onClose={onClose} title="Scheda Cliente">
      <div className="space-y-6">
        {/* --- Client Info --- */}
        <div className="flex items-center gap-4">
          <Avatar name={client.name} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-text-dark truncate">{client.name}</h3>
            <div className="text-sm text-text-muted space-y-0.5 mt-1">
              <p className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 shrink-0" />
                {client.phone}
              </p>
              {client.email && (
                <p className="truncate">{client.email}</p>
              )}
              {client.birthDate && (
                <p>
                  🎂 {new Date(client.birthDate + 'T00:00:00').toLocaleDateString('it-IT', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Reminder consent */}
        <div className="flex items-center gap-2 text-sm">
          <span
            className={`w-2 h-2 rounded-full ${
              client.reminderConsent ? 'bg-green-500' : 'bg-text-dim'
            }`}
          />
          <span className={client.reminderConsent ? 'text-text-dark' : 'text-text-muted'}>
            {client.reminderConsent
              ? 'Consenso promemoria WhatsApp ✅'
              : 'Nessun consenso promemoria'}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--primary-50)] rounded-xl p-3 text-center">
            <p className="text-2xl font-bold text-primary-500">{client.totalVisits}</p>
            <p className="text-xs text-text-muted mt-0.5">Visite totali</p>
          </div>
          <div className="bg-[var(--bg-soft)] rounded-xl p-3 text-center">
            <p className="text-sm font-semibold text-text-dark">
              {client.lastVisit
                ? client.lastVisit.toLocaleDateString('it-IT')
                : '—'}
            </p>
            <p className="text-xs text-text-muted mt-0.5">Ultima visita</p>
          </div>
        </div>

        {/* Preferred Services */}
        {preferredServiceNames.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-text-dark mb-2">Servizi preferiti</h4>
            <div className="flex flex-wrap gap-2">
              {preferredServiceNames.map((s) => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-primary-500 text-white"
                >
                  {s.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Notes */}
        {(client.notes || client.personalNotes) && (
          <div className="space-y-3">
            {client.notes && (
              <div>
                <h4 className="text-sm font-semibold text-text-dark mb-1">Note operative</h4>
                <p className="text-sm text-text-muted bg-[var(--bg-soft)] rounded-xl p-3 whitespace-pre-wrap">
                  {client.notes}
                </p>
              </div>
            )}
            {client.personalNotes && (
              <div>
                <h4 className="text-sm font-semibold text-text-dark mb-1">Note personali dello stilista</h4>
                <p className="text-sm text-text-muted bg-amber-50 dark:bg-amber-900/20 border border-amber-200/30 rounded-xl p-3 whitespace-pre-wrap">
                  {client.personalNotes}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Appointment History */}
        <div>
          <h4 className="text-sm font-semibold text-text-dark mb-3">Cronologia appuntamenti</h4>
          {loadingApps ? (
            <div className="text-center py-6">
              <div className="animate-spin w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : appointments.length === 0 ? (
            <p className="text-sm text-text-muted text-center py-4">Nessun appuntamento in cronologia</p>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {appointments.map((app) => (
                <div
                  key={app.id}
                  className="flex items-center gap-3 bg-[var(--bg-soft)] rounded-xl p-3 text-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-50)] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-primary-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-dark truncate">
                      {app.serviceName || 'Servizio generico'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {formatDate(app.startTime)} alle {formatTime(app.startTime)}
                      {app.price > 0 && ` — ${formatCurrency(app.price)}`}
                    </p>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => {
              onEdit(client);
              onClose();
            }}
          >
            <Pencil className="w-4 h-4 mr-1" />
            Modifica
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onClose();
              navigate('/calendar');
            }}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Nuovo appuntamento
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Empty State ─── */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-text-dark mb-1">Nessun cliente ancora</h3>
      <p className="text-sm text-text-muted mb-4">Aggiungi il primo cliente per iniziare</p>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Aggiungi Cliente
      </Button>
    </Card>
  );
}

/* ─── Loading Skeleton ─── */

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-[var(--border-light)] rounded-2xl" />
      ))}
    </div>
  );
}