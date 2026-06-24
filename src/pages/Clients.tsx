import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Plus, Search, Phone, ChevronRight, Users } from 'lucide-react';
import type { Client } from '../types';
import { useSubscription, FREE_CLIENT_LIMIT } from '../lib/subscription';
import { ClientLimitBar, PremiumBadge } from '../components/ui/PremiumGate';

export function Clients() {
  const { firebaseUser } = useAuth();
  const { isPremium, features } = useSubscription();
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

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
        <Button onClick={() => {
          if (clients.length >= features.clientLimit) {
            alert(`🔒 Hai raggiunto il limite di ${FREE_CLIENT_LIMIT} clienti del piano Free. Passa a Premium per clienti illimitati!`);
            return;
          }
          setShowModal(true);
        }}>
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
          icon={<Search className="w-4 h-4" />}
        />
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {filtered.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>
      )}

      <AddClientModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}

function ClientCard({ client }: { client: Client }) {
  return (
    <Card className="flex items-center gap-3">
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
        <a href={`tel:${client.phone}`} className="btn-ghost w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
          <Phone className="w-3.5 h-3.5" />
        </a>
        <ChevronRight className="w-4 h-4 text-text-muted" />
      </div>
    </Card>
  );
}

function AddClientModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { firebaseUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [reminderConsent, setReminderConsent] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firebaseUser?.uid || !name || !phone) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'clients'), {
        userId: firebaseUser.uid,
        name,
        phone,
        email: email || '',
        notes,
        preferredServices: [],
        totalVisits: 0,
        createdAt: Timestamp.now(),
        reminderConsent,
      });
      onClose();
      setName('');
      setPhone('');
      setEmail('');
      setNotes('');
      setReminderConsent(false);
    } catch (err) {
      console.error('Error saving client:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Cliente">
      <div className="space-y-4">
        <Input label="Nome *" placeholder="Maria Rossi" value={name} onChange={(e) => setName(e.target.value)} />
        <Input label="Telefono *" placeholder="+39 333 123 4567" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" />
        <Input label="Email" placeholder="maria@email.com" value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Note</label>
          <textarea
            className="input-field min-h-[80px] resize-none"
            placeholder="Allergie, preferenze, note..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={reminderConsent}
            onChange={(e) => setReminderConsent(e.target.checked)}
            className="w-5 h-5 rounded-lg accent-primary-500"
          />
          <div>
            <p className="text-sm font-medium text-text-dark">Consenso promemoria</p>
            <p className="text-xs text-text-muted">Posso inviare promemoria WhatsApp</p>
          </div>
        </label>
        <Button fullWidth onClick={handleSave} disabled={saving || !name || !phone}>
          {saving ? 'Salvataggio...' : 'Salva Cliente'}
        </Button>
      </div>
    </Modal>
  );
}

function EmptyState() {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Users className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-text-dark mb-1">Nessun cliente ancora</h3>
      <p className="text-sm text-text-muted mb-4">Aggiungi il primo cliente per iniziare</p>
      <Button>
        <Plus className="w-4 h-4 mr-1" />
        Aggiungi Cliente
      </Button>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-[#E0D0D0] rounded-2xl" />
      ))}
    </div>
  );
}
