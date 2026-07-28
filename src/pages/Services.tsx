import { useState, useEffect, useMemo } from 'react';
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
import {
  Plus,
  Trash2,
  Clock,
  Euro,
  Scissors,
  Pencil,
  Search,
} from 'lucide-react';
import { formatDuration } from '../lib/format';
import type { Service, ServiceCategory } from '../types';

const SERVICE_COLORS = [
  '#FF6B9D', '#C44A8C', '#D4A853', '#4CAF50',
  '#42A5F5', '#AB47BC', '#FF7043', '#26A69A',
  '#F44336', '#9C27B0',
];

const CATEGORIES: { value: ServiceCategory; label: string; emoji: string }[] = [
  { value: 'Capelli', label: 'Capelli', emoji: '💇' },
  { value: 'Unghie', label: 'Unghie', emoji: '💅' },
  { value: 'Estetica', label: 'Estetica', emoji: '🧖' },
  { value: 'Makeup', label: 'Makeup', emoji: '💄' },
  { value: 'Altro', label: 'Altro', emoji: '📋' },
];

const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.value, c])
) as Record<ServiceCategory, (typeof CATEGORIES)[number]>;

export function Services() {
  const { firebaseUser } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
      try {
        await deleteDoc(doc(db, 'services', serviceId));
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('❌ Errore durante l\'eliminazione. Riprova.');
      }
    }
  };

  const handleToggleActive = async (service: Service) => {
    try {
      await updateDoc(doc(db, 'services', service.id), {
        isActive: !service.isActive,
      });
    } catch (err) {
      console.error('Error toggling service:', err);
      alert('❌ Errore durante l\'aggiornamento. Riprova.');
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingService(null);
    setShowModal(true);
  };

  // Filter by search query
  const filteredServices = useMemo(() => {
    if (!searchQuery.trim()) return services;
    const q = searchQuery.toLowerCase();
    return services.filter((s) => s.name.toLowerCase().includes(q));
  }, [services, searchQuery]);

  // Group by category
  const groupedServices = useMemo(() => {
    const groups: Record<string, Service[]> = {};
    CATEGORIES.forEach((cat) => {
      groups[cat.value] = [];
    });
    filteredServices.forEach((s) => {
      const cat = s.category || 'Altro';
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(s);
    });
    return Object.entries(groups).filter(([, items]) => items.length > 0);
  }, [filteredServices]);

  const closeModal = () => {
    setShowModal(false);
    setEditingService(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Servizi</h1>
          <p className="text-sm text-text-muted">{services.length} servizi</p>
        </div>
        <Button onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-1" />
          Nuovo
        </Button>
      </div>

      {/* Search */}
      {services.length > 0 && (
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            placeholder="Cerca servizio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10 w-full"
          />
        </div>
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : services.length === 0 ? (
        <EmptyState onAdd={handleAddNew} />
      ) : (
        <div className="space-y-6">
          {groupedServices.map(([category, items]) => {
            const catInfo = CATEGORY_MAP[category as ServiceCategory] ?? {
              emoji: '📋',
              label: category,
            };
            return (
              <div key={category}>
                <h2 className="text-sm font-bold text-text-muted uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span>{catInfo.emoji}</span>
                  <span>{catInfo.label}</span>
                  <span className="text-xs font-normal text-text-dim ml-1">
                    ({items.length})
                  </span>
                </h2>
                <div className="space-y-2">
                  {items.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onToggle={handleToggleActive}
                      onEdit={handleEdit}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ServiceModal
        isOpen={showModal}
        onClose={closeModal}
        editService={editingService}
        servicesCount={services.length}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Card                                                       */
/* ------------------------------------------------------------------ */

function ServiceCard({
  service,
  onToggle,
  onEdit,
  onDelete,
}: {
  service: Service;
  onToggle: (s: Service) => void;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
}) {
  const catInfo = CATEGORY_MAP[service.category] ?? { emoji: '📋', label: 'Altro' };

  return (
    <Card>
      <div className="flex items-start gap-3">
        {/* Color bar */}
        <div
          className="w-1 h-full min-h-[4.5rem] rounded-full shrink-0 mt-1"
          style={{ backgroundColor: service.color }}
        />

        <div className="flex-1 min-w-0">
          {/* Top row: name + actions */}
          <div className="flex items-start justify-between gap-2">
            <h3
              className={`text-lg font-bold leading-tight ${
                service.isActive ? 'text-text-dark' : 'text-text-muted line-through'
              }`}
            >
              {service.name}
            </h3>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => onEdit(service)}
                className="btn-ghost p-1.5 rounded-lg text-text-muted hover:text-primary-500"
                title="Modifica"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(service.id)}
                className="btn-ghost p-1.5 rounded-lg text-text-muted hover:text-danger"
                title="Elimina"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Description */}
          {service.description && (
            <p className="text-sm text-text-muted mt-1 line-clamp-2">
              {service.description}
            </p>
          )}

          {/* Meta row: duration + price + category badge */}
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5" />
              {formatDuration(service.duration)}
            </span>
            <span className="flex items-center gap-1 text-xs font-bold text-primary-600">
              <Euro className="w-3.5 h-3.5" />
              {service.price.toFixed(2)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--primary-50)] text-primary-600 font-medium inline-flex items-center gap-1">
              <span>{catInfo.emoji}</span>
              <span>{catInfo.label}</span>
            </span>
          </div>
        </div>

        {/* Active toggle badge */}
        <button
          onClick={() => onToggle(service)}
          className={`shrink-0 px-3 py-1 rounded-full text-xs font-medium transition-all mt-1 ${
            service.isActive
              ? 'bg-success/10 text-success'
              : 'bg-[var(--border-light)] text-text-dim'
          }`}
        >
          {service.isActive ? 'Attivo' : 'Disattivo'}
        </button>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Service Modal (Add / Edit)                                         */
/* ------------------------------------------------------------------ */

function ServiceModal({
  isOpen,
  onClose,
  editService,
  servicesCount,
}: {
  isOpen: boolean;
  onClose: () => void;
  editService: Service | null;
  servicesCount: number;
}) {
  const { firebaseUser } = useAuth();
  const isEditing = editService !== null;

  const [name, setName] = useState('');
  const [category, setCategory] = useState<ServiceCategory>('Altro');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('30');
  const [price, setPrice] = useState('25');
  const [color, setColor] = useState(SERVICE_COLORS[0]);
  const [saving, setSaving] = useState(false);

  // Reset / pre-fill form when modal opens
  useEffect(() => {
    if (!isOpen) return;
    if (editService) {
      setName(editService.name);
      setCategory(editService.category || 'Altro');
      setDescription(editService.description || '');
      setDuration(String(editService.duration));
      setPrice(editService.price.toFixed(2));
      setColor(editService.color);
    } else {
      setName('');
      setCategory('Altro');
      setDescription('');
      setDuration('30');
      setPrice('25');
      setColor(SERVICE_COLORS[0]);
    }
  }, [isOpen, editService]);

  const handleSave = async () => {
    if (!firebaseUser?.uid || !name.trim() || !duration || !price) {
      alert('Compila tutti i campi obbligatori');
      return;
    }
    const parsedDuration = parseInt(duration);
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedDuration) || parsedDuration <= 0) {
      alert('Durata non valida');
      return;
    }
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      alert('Prezzo non valido');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name,
        category,
        description: description || '',
        duration: parsedDuration,
        price: parsedPrice,
        color,
        isActive: editService?.isActive ?? true,
        ...(editService ? {} : { userId: firebaseUser.uid, order: servicesCount }),
      };

      if (isEditing && editService) {
        await updateDoc(doc(db, 'services', editService.id), payload);
      } else {
        await addDoc(collection(db, 'services'), payload);
      }
      onClose();
    } catch (err) {
      console.error('Error saving service:', err);
      alert('❌ Errore durante il salvataggio del servizio. Controlla la connessione e riprova.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Modifica Servizio' : 'Nuovo Servizio'}>
      <div className="space-y-4">
        <Input
          label="Nome servizio *"
          placeholder="Taglio donna"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Category dropdown */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Categoria
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as ServiceCategory)}
            className="input-field w-full"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.emoji} {cat.label}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Descrizione
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Breve descrizione del servizio..."
            rows={3}
            className="input-field w-full resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Durata (min) *"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
          <Input
            label="Prezzo (€) *"
            type="number"
            step="0.50"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Colore (per calendario)
          </label>
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

        <Button
          fullWidth
          onClick={handleSave}
          disabled={saving || !name}
        >
          {saving
            ? 'Salvataggio...'
            : isEditing
              ? 'Salva Modifiche'
              : 'Aggiungi Servizio'}
        </Button>
      </div>
    </Modal>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-[var(--primary-50)] rounded-2xl flex items-center justify-center mx-auto mb-4">
        <Scissors className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-text-dark mb-1">Nessun servizio ancora</h3>
      <p className="text-sm text-text-muted mb-4">
        Aggiungi i tuoi servizi per iniziare a prenotare
      </p>
      <Button onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Aggiungi Servizio
      </Button>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Loading skeleton                                                   */
/* ------------------------------------------------------------------ */

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-16 bg-[var(--border-light)] rounded-2xl" />
      ))}
    </div>
  );
}