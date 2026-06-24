import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { formatCurrency } from '../lib/format';
import type { Appointment, Service, Client } from '../types';

const DAYS_SHORT = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

/** 30-min slots from 05:00 to 19:30 (last start time) */
const SLOTS: { hour: number; min: number }[] = [];
for (let h = 5; h <= 19; h++) {
  SLOTS.push({ hour: h, min: 0 });
  if (h < 20) SLOTS.push({ hour: h, min: 30 });
}

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatWeekRange(dates: Date[]): string {
  const start = dates[0];
  const end = dates[6];
  return `${start.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function formatSlotLabel(hour: number, min: number): string {
  return `${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
}

function getSlotStart(date: Date, hour: number, min: number): Date {
  const d = new Date(date);
  d.setHours(hour, min, 0, 0);
  return d;
}

function getSlotEnd(date: Date, hour: number, min: number): Date {
  const d = getSlotStart(date, hour, min);
  d.setMinutes(d.getMinutes() + 30);
  return d;
}

/** Check if two time ranges overlap */
function rangesOverlap(aStart: Date, aEnd: Date, bStart: Date, bEnd: Date): boolean {
  return aStart < bEnd && aEnd > bStart;
}

export function Calendar() {
  const { firebaseUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ hour: number; min: number; dateStr?: string } | null>(null);

  const weekDates = getWeekDates(currentDate);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const unsubServices = onSnapshot(
      query(collection(db, 'services'), where('userId', '==', uid)),
      (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)))
    );

    const unsubClients = onSnapshot(
      query(collection(db, 'clients'), where('userId', '==', uid)),
      (snap) => setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)))
    );

    const startOfWeek = weekDates[0];
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const unsubApps = onSnapshot(
      query(
        collection(db, 'appointments'),
        where('userId', '==', uid),
        where('startTime', '>=', Timestamp.fromDate(startOfWeek)),
        where('startTime', '<', Timestamp.fromDate(endOfWeek))
      ),
      (snap) => {
        const apps = snap.docs.map(d => ({
          id: d.id,
          ...d.data(),
          startTime: d.data().startTime.toDate(),
          endTime: d.data().endTime.toDate(),
        })) as Appointment[];
        setAppointments(apps);
      }
    );

    return () => { unsubServices(); unsubClients(); unsubApps(); };
  }, [firebaseUser?.uid, currentDate]);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const getAppointmentsForSlot = (date: Date, hour: number, min: number): Appointment[] => {
    const slotStart = getSlotStart(date, hour, min);
    const slotEnd = getSlotEnd(date, hour, min);
    return appointments.filter((app) => {
      return app.startTime.toDateString() === date.toDateString() &&
        rangesOverlap(app.startTime, app.endTime, slotStart, slotEnd);
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const handleSlotClick = (clickDate: Date, hour: number, min: number) => {
    setSelectedSlot({ hour, min, dateStr: clickDate.toISOString().split('T')[0] });
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Calendario</h1>
          <p className="text-sm text-text-muted capitalize">{formatWeekRange(weekDates)}</p>
        </div>
        <Button onClick={() => { setSelectedSlot(null); setShowModal(true); }}>
          <Plus className="w-4 h-4 mr-1" />
          Nuovo
        </Button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevWeek} className="btn-ghost p-2">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="text-sm font-medium text-primary-500 hover:underline"
        >
          Oggi
        </button>
        <button onClick={nextWeek} className="btn-ghost p-2">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDates.map((date, i) => (
          <div key={i} className="text-center">
            <p className="text-xs text-text-muted font-medium">{DAYS_SHORT[date.getDay()]}</p>
            <p className={`text-sm font-bold mt-0.5 w-8 h-8 rounded-full flex items-center justify-center mx-auto ${
              isToday(date) ? 'gradient-primary text-white' : 'text-text-dark'
            }`}>
              {date.getDate()}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar grid - scrollable */}
      <div className="overflow-auto max-h-[65vh] rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)]">
        <div className="min-w-[700px]">
          {/* Header row */}
          <div className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-[var(--border-light)]">
            <div className="text-[10px] text-text-muted py-2 px-2 text-right border-r border-[var(--border-light)]" />
            {weekDates.map((date, i) => (
              <div
                key={i}
                className={`text-center py-2 border-r border-[var(--border-light)] ${
                  isToday(date) ? 'bg-[var(--primary-50)]/30' : ''
                }`}
              >
                <span className="text-[10px] font-medium text-text-muted">{DAYS_SHORT[date.getDay()]}</span>
                <span className={`ml-1 text-xs font-bold ${isToday(date) ? 'text-primary-500' : 'text-text-dark'}`}>
                  {date.getDate()}
                </span>
              </div>
            ))}
          </div>

          {/* Time slots */}
          {SLOTS.map((slot, slotIdx) => {
            const slotLabel = formatSlotLabel(slot.hour, slot.min);
            return (
              <div
                key={slotIdx}
                className="grid grid-cols-[70px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-[var(--border-light)]"
              >
                {/* Time label */}
                <div className="text-[11px] text-text-muted py-2 px-2 text-right border-r border-[var(--border-light)] font-mono">
                  {slotLabel}
                </div>
                {/* Day columns */}
                {weekDates.map((date, dayIdx) => {
                  const apps = getAppointmentsForSlot(date, slot.hour, slot.min);
                  return (
                    <div
                      key={dayIdx}
                      className={`min-h-[36px] border-r border-[var(--border-light)] p-0.5 relative cursor-pointer transition-all hover:bg-[var(--primary-50)] ${
                        isToday(date) ? 'bg-[var(--primary-50)]/20' : ''
                      }`}
                      onClick={() => handleSlotClick(date, slot.hour, slot.min)}
                    >
                      {apps.map((app) => (
                        <div
                          key={app.id}
                          className="text-[11px] p-1 rounded-md mb-0.5 cursor-pointer text-white font-medium truncate shadow-sm"
                          style={{ backgroundColor: app.serviceName ? '#EC4899' : '#A855F7' }}
                          title={`${app.clientName} — ${app.serviceName || 'nessun servizio'}`}
                        >
                          <span className="font-semibold">{app.clientName}</span>
                          {app.serviceName && (
                            <span className="opacity-80 ml-1">· {app.serviceName}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <AddAppointmentModal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedSlot(null); }}
        services={services}
        clients={clients}
        preselectedSlot={selectedSlot}
      />
    </div>
  );
}

function AddAppointmentModal({
  isOpen,
  onClose,
  services,
  clients,
  preselectedSlot,
}: {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  clients: Client[];
  preselectedSlot: { hour: number; min: number; dateStr?: string } | null;
}) {
  const { firebaseUser } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  // Pre-select time slot if coming from calendar click
  useEffect(() => {
    if (preselectedSlot && isOpen) {
      setTime(`${preselectedSlot.hour.toString().padStart(2, '0')}:${preselectedSlot.min.toString().padStart(2, '0')}`);
      if (preselectedSlot.dateStr) {
        setDate(preselectedSlot.dateStr);
      }
    }
  }, [preselectedSlot, isOpen]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const client = clients.find((c) => c.id === selectedClientId);

  const handleSave = async () => {
    if (!firebaseUser?.uid || !selectedClientId || !selectedServiceId || !date || !time) return;
    setSaving(true);
    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + (selectedService?.duration || 30) * 60000);

      await addDoc(collection(db, 'appointments'), {
        userId: firebaseUser.uid,
        clientId: client?.id || '',
        clientName: client?.name || '',
        clientPhone: client?.phone || '',
        serviceId: selectedService?.id || '',
        serviceName: selectedService?.name || '',
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 0,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        status: 'confirmed',
        notes,
        reminderSent: false,
        createdAt: Timestamp.now(),
      });
      onClose();
      setSelectedClientId('');
      setSelectedServiceId('');
      setDate(new Date().toISOString().split('T')[0]);
      setTime('10:00');
      setNotes('');
    } catch (err) {
      console.error('Error creating appointment:', err);
    } finally {
      setSaving(false);
    }
  };

  const activeServices = services.filter((s) => s.isActive);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Appuntamento">
      <div className="space-y-4">
        {/* Select client */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Cliente</label>
          <select
            className="input-field"
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
          >
            <option value="">Seleziona cliente...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
            ))}
          </select>
        </div>

        {/* Select service */}
        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Servizio</label>
          <select
            className="input-field"
            value={selectedServiceId}
            onChange={(e) => setSelectedServiceId(e.target.value)}
          >
            <option value="">Seleziona servizio...</option>
            {activeServices.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.duration}min — {formatCurrency(s.price)}
              </option>
            ))}
          </select>
        </div>

        {/* Date and time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Data</label>
            <input
              type="date"
              className="input-field"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-dark mb-1.5">Ora</label>
            <input
              type="time"
              step="900"
              className="input-field"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>

        {selectedService && (
          <div className="bg-[var(--primary-50)] rounded-xl p-3 text-sm">
            <p className="font-medium text-text-dark">Riepilogo</p>
            <p className="text-text-muted mt-1">
              {client?.name} — {selectedService.name}<br />
              {time} — {formatCurrency(selectedService.price)}
              <span className="text-text-dim"> · {selectedService.duration}min</span>
            </p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-text-dark mb-1.5">Note (opzionale)</label>
          <textarea
            className="input-field min-h-[60px] resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Indicazioni, richieste speciali..."
          />
        </div>

        <Button fullWidth onClick={handleSave} disabled={saving || !selectedClientId || !selectedServiceId}>
          {saving ? 'Salvataggio...' : 'Conferma Appuntamento'}
        </Button>
      </div>
    </Modal>
  );
}