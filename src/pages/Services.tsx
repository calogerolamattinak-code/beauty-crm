import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Plus, Trash2, Clock, Euro } from 'lucide-react';
import { formatDuration } from '../lib/format';
import type { Service } from '../types';

const SERVICE_COLORS = [
  '#FF6B9D', '#C44A8C', '#D4A853', '#4CAF50',
  '#42A5F5', '#AB47BC', '#FF7043', '#26A69A',
  '#F44336', '#9C27B0',
];

export function Services() {
  const { firebaseUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'services'),
      where('userId', '==', uid),
      orderBy('order', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Service[];
      setServices(results);
      setLoading(false);
    });

    return unsub;
  }, [firebaseUser?.uid]);

  const handleDelete = async (serviceId: string) => {
    if (confirm('Eliminare questo servizio?')) {
      await deleteDoc(doc(db, 'services', serviceId));
    }
  };

  const handleToggleActive = async (service: Service) => {
    await updateDoc(doc(db, 'services', service.id), {
      isActive: !service.isActive,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Servizi</h1>
          <p className="text-sm text-text-muted">{services.length} servizi</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Nuovo
        </Button>
      </div>

      {loading ? (
        <LoadingSkeleton />
      ) : services.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {services.map((service) => (
            <Card key={service.id}>
              <div className="flex items-center gap-3">
                <div
                  className="w-1 h-12 rounded-full"
                  style={{ backgroundColor: service.color }}
                />
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${service.isActive ? 'text-text-dark' : 'text-text-muted line-through'}`}>
                    {service.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-text-muted mt-0.5">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(service.duration)}
                    </span>
                    <span className="flex items-center gap-1 font-bold text-primary-500">
                      <Euro className="w-3 h-3" />
                      {service.price.toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      service.isActive
                        ? 'bg-success/10 text-success'
                        : 'bg-[#F0E8E8] text-text-muted'
                    }`}
                  >
                    {service.isActive ? 'Attivo' : 'Disattivo'}
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="btn-ghost text-danger"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddServiceModal isOpen={showModal} onClose={() => setShowModal(false)} servicesCount={services.length} />
    </div>
  );
}

function AddServiceModal({
  isOpen,
  onClose,
  servicesCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  servicesCount: number;
}) {
  const { firebaseUser } = useAuth();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('25');
  const [color, setColor] = useState(SERVICE_COLORS[0]);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!firebaseUser?.uid || !name || !duration || !price) return;
    setSaving(true);
    try {
      await addDoc(collection(db, 'services'), {
        userId: firebaseUser.uid,
        name,
        duration: parseInt(duration),
        price: parseFloat(price),
        color,
        isActive: true,
        order: servicesCount,
      });
      onClose();
      setName('');
      setDuration('30');
      setPrice('25');
      setColor(SERVICE_COLORS[0]);
    } catch (err) {
      console.error('Error saving service:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Servizio">
      <div className="space-y-4">
        <Input label="Nome servizio *" placeholder="Taglio donna" value={name} onChange={(e) => setName(e.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Durata (min) *"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            icon={<Clock className="w-4 h-4" />}
          />
          <Input
            label="Prezzo (€) *"
            type="number"
            step="0.50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            icon={<Euro className="w-4 h-4" />}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">Colore (per calendario)</label>
          <div className="flex gap-2 flex-wrap">
            {SERVICE_COLORS.map((c) => (
              <button
                key={c}
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-xl transition-all ${
                  color === c ? 'ring-2 ring-offset-2 ring-text-dark scale-110' : ''
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        <Button fullWidth onClick={handleSave} disabled={saving || !name}>
          {saving ? 'Salvataggio...' : 'Aggiungi Servizio'}
        </Button>
      </div>
    </Modal>
  );
}

function EmptyState() {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Scissors className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-text-dark mb-1">Nessun servizio ancora</h3>
      <p className="text-sm text-text-muted mb-4">Aggiungi i tuoi servizi per iniziare a prenotare</p>
      <Button>
        <Plus className="w-4 h-4 mr-1" />
        Aggiungi Servizio
      </Button>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-[#E0D0D0] rounded-2xl" />
      ))}
    </div>
  );
}

import { Scissors } from 'lucide-react';
