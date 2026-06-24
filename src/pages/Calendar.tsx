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

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  const dates: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    dates.push(d);
  }
  return dates;
}

function formatWeekRange(dates: Date[]): string {
  const start = dates[1]; // Monday
  const end = dates[5]; // Friday
  return `${start.toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })} - ${end.toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}`;
}

const HOURS = Array.from({ length: 12 }, (_, i) => i + 8); // 8:00 - 19:00

export function Calendar() {
  const { firebaseUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showModal, setShowModal] = useState(false);

  const weekDates = getWeekDates(currentDate);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    // Load services and clients for the modal
    const unsubServices = onSnapshot(
      query(collection(db, 'services'), where('userId', '==', uid)),
      (snap) => setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as Service)))
    );

    const unsubClients = onSnapshot(
      query(collection(db, 'clients'), where('userId', '==', uid)),
      (snap) => setClients(snap.docs.map(d => ({ id: d.id, ...d.data() } as Client)))
    );

    // Load appointments for this week
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

  const getAppointmentsForDayAndHour = (date: Date, hour: number): Appointment[] => {
    return appointments.filter((app) => {
      const appDate = app.startTime;
      const sameDay = appDate.toDateString() === date.toDateString();
      const appHour = appDate.getHours();
      const appEndHour = app.endTime.getHours();
      return sameDay && appHour <= hour && appEndHour > hour;
    });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-dark">Calendario</h1>
          <p className="text-sm text-text-muted capitalize">{formatWeekRange(weekDates)}</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4 mr-1" />
          Nuovo
        </Button>
      </div>

      {/* Week navigation */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevWeek} className="btn-ghost">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="text-sm font-medium text-primary-500 hover:underline"
        >
          Oggi
        </button>
        <button onClick={nextWeek} className="btn-ghost">
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
        <div className="min-w-[600px]">
          {/* Time grid */}
          {HOURS.map((hour) => (
            <div key={hour} className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-[var(--border-light)]">
              {/* Time label */}
              <div className="text-xs text-text-muted py-3 px-2 text-right border-r border-[#F0E8E8]">
                {hour.toString().padStart(2, '0')}:00
              </div>
              {/* Day columns */}
              {weekDates.map((date, dayIdx) => {
                const apps = getAppointmentsForDayAndHour(date, hour);
                return (
                  <div
                    key={dayIdx}
                    className={`min-h-[60px] border-r border-[#F0E8E8] p-1 relative cursor-pointer hover:bg-[var(--primary-50)] transition-all ${
                      isToday(date) ? 'bg-[var(--primary-50)]/50' : ''
                    }`}
                    onClick={() => {
                      setShowModal(true);
                    }}
                  >
                    {apps.map((app) => (
                      <div
                        key={app.id}
                        className="text-xs p-1.5 rounded-lg mb-0.5 cursor-pointer text-white"
                        style={{ backgroundColor: app.serviceName ? '#FF6B9D' : '#C44A8C' }}
                        title={`${app.clientName} - ${app.serviceName}`}
                      >
                        <p className="font-semibold truncate">{app.clientName}</p>
                        <p className="opacity-80 truncate">{app.serviceName}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <AddAppointmentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        services={services}
        clients={clients}
      />
    </div>
  );
}

function AddAppointmentModal({
  isOpen,
  onClose,
  services,
  clients,
}: {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  clients: Client[];
}) {
  const { firebaseUser } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

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
              {time} — {new Date(`${date}T${time}`).getHours()}:{String(new Date(`${date}T${time}`).getMinutes() + selectedService.duration).padStart(2, '0')} ({selectedService.duration}min)<br />
              <span className="font-bold text-primary-500">{formatCurrency(selectedService.price)}</span>
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