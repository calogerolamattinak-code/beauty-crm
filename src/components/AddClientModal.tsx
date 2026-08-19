import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Input } from './ui/Input';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { X } from 'lucide-react';
import type { Client, Service } from '../types';

export function AddClientModal({
  isOpen,
  onClose,
  editingClient,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  editingClient?: Client | null;
  onSuccess?: (newClient: Client) => void;
}) {
  const { firebaseUser } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [notes, setNotes] = useState('');
  const [personalNotes, setPersonalNotes] = useState('');
  const [reminderConsent, setReminderConsent] = useState(false);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [saving, setSaving] = useState(false);

  // Load services from Firestore
  useEffect(() => {
    if (!firebaseUser?.uid) return;
    const unsub = onSnapshot(
      query(collection(db, 'services'), where('userId', '==', firebaseUser.uid)),
      (snap) => {
        setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)));
      }
    );
    return unsub;
  }, [firebaseUser?.uid]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingClient) {
      setName(editingClient.name);
      setPhone(editingClient.phone);
      setEmail(editingClient.email || '');
      setBirthDate(editingClient.birthDate || '');
      setNotes(editingClient.notes || '');
      setPersonalNotes(editingClient.personalNotes || '');
      setReminderConsent(editingClient.reminderConsent);
      setSelectedServices(editingClient.preferredServices || []);
    } else {
      setName('');
      setPhone('');
      setEmail('');
      setBirthDate('');
      setNotes('');
      setPersonalNotes('');
      setReminderConsent(false);
      setSelectedServices([]);
    }
  }, [editingClient, isOpen]);

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleSave = async () => {
    if (!firebaseUser?.uid || !name.trim() || !phone.trim()) {
      alert('Nome e telefono sono obbligatori');
      return;
    }
    setSaving(true);
    try {
      const data = {
        userId: firebaseUser.uid,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || '',
        birthDate: birthDate || '',
        notes: notes.trim(),
        personalNotes: personalNotes.trim(),
        preferredServices: selectedServices,
        reminderConsent,
      };

      if (editingClient?.id) {
        // Update existing
        await updateDoc(doc(db, 'clients', editingClient.id), data);
        if (onSuccess) {
          onSuccess({ ...editingClient, ...data });
        }
      } else {
        // Create new
        const docRef = await addDoc(collection(db, 'clients'), {
          ...data,
          totalVisits: 0,
          createdAt: Timestamp.now(),
        });
        if (onSuccess) {
          onSuccess({
            id: docRef.id,
            ...data,
            totalVisits: 0,
            createdAt: new Date(),
          });
        }
      }
      onClose();
    } catch (err) {
      console.error('Error saving client:', err);
      alert('❌ Errore durante il salvataggio del cliente. Controlla la connessione e riprova.');
    } finally {
      setSaving(false);
    }
  };

  const isEditing = !!editingClient;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Modifica Cliente' : 'Nuovo Cliente'}
    >
      <div className="space-y-4">
        <Input
          label="Nome *"
          placeholder="Maria Rossi"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          label="Telefono *"
          placeholder="+39 333 123 4567"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          required
        />
        <Input
          label="Email"
          placeholder="maria@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
        />

        {/* Birth date */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Data di nascita
          </label>
          <input
            type="date"
            className="input-field"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
          />
        </div>

        {/* Preferred Services */}
        {services.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-text-dark mb-2">
              Servizi preferiti
            </label>
            <div className="flex flex-wrap gap-2">
              {services
                .filter((s) => s.isActive)
                .map((service) => {
                  const selected = selectedServices.includes(service.id);
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => toggleService(service.id)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${
                        selected
                          ? 'bg-primary-500 text-white border-primary-500 shadow-sm'
                          : 'bg-[var(--bg-soft)] text-text-muted border-[var(--border-light)] hover:border-primary-300'
                      }`}
                    >
                      {selected ? <X className="w-3 h-3" /> : null}
                      {service.name}
                    </button>
                  );
                })}
            </div>
          </div>
        )}

        {/* Notes (operative) */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Note operative
          </label>
          <textarea
            className="input-field min-h-[70px] resize-none"
            placeholder="Allergie, controindicazioni, preferenze..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        {/* Personal notes (stylist private) */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">
            Note personali dello stilista
          </label>
          <textarea
            className="input-field min-h-[70px] resize-none"
            placeholder="Appunti privati, osservazioni personali..."
            value={personalNotes}
            onChange={(e) => setPersonalNotes(e.target.value)}
          />
        </div>

        {/* Reminder consent */}
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

        {/* Stats when editing */}
        {isEditing && (
          <div className="bg-[var(--primary-50)] rounded-xl p-3 text-sm space-y-1">
            <p className="font-medium text-text-dark">Statistiche cliente</p>
            <p className="text-text-muted">
              Totale visite: <span className="font-semibold text-text-dark">{editingClient.totalVisits}</span>
            </p>
            {editingClient.lastVisit && (
              <p className="text-text-muted">
                Ultima visita:{' '}
                <span className="font-semibold text-text-dark">
                  {editingClient.lastVisit.toLocaleDateString('it-IT')}
                </span>
              </p>
            )}
          </div>
        )}

        <Button
          fullWidth
          onClick={handleSave}
          disabled={saving || !name.trim() || !phone.trim()}
        >
          {saving ? 'Salvataggio...' : isEditing ? 'Aggiorna' : 'Salva Cliente'}
        </Button>
      </div>
    </Modal>
  );
}
