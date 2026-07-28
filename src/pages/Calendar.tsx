import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  useDraggable,
  useDroppable,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  Bell,
  BellRing,
  Share2,
  Check,
  Clock,
  CalendarDays,
} from 'lucide-react';
import { formatCurrency } from '../lib/format';
import type { Appointment, Service, Client, ServiceCategory, AppointmentOutcome } from '../types';

/* ─── Constants ─── */

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const DAYS_ABBREVIATED = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

/* ─── Notification Sound (Telegram-like) ─── */

function playNotificationSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioCtx();
    const tone = (freq: number, start: number, dur: number) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0.22, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };
    const t = ctx.currentTime;
    tone(988, t, 0.10);
    tone(1319, t + 0.10, 0.14);
  } catch {
    // Web Audio API not available — silent
  }
}

const ITALIAN_DAYS = [
  'Domenica', 'Lunedì', 'Martedì', 'Mercoledì',
  'Giovedì', 'Venerdì', 'Sabato',
];

const ITALIAN_MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

const SLOTS: { hour: number; min: number }[] = [];
for (let h = 6; h <= 21; h++) {
  SLOTS.push({ hour: h, min: 0 });
  if (h < 21) SLOTS.push({ hour: h, min: 30 });
}

function formatSlotLabel(h: number, m: number): string {
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function slotDroppableId(dateStr: string, hour: number, min: number): string {
  return `slot:${dateStr}:${hour}:${min}`;
}

/* ─── Service category color mapping ─── */

const CATEGORY_COLORS: Record<string, { bar: string; bg: string; text: string }> = {
  capelli:   { bar: '#EC4899', bg: 'rgba(236,72,153,0.08)',  text: '#F9A8D4' },
  unghie:    { bar: '#A855F7', bg: 'rgba(168,85,247,0.08)',   text: '#C4B5FD' },
  estetica:  { bar: '#F59E0B', bg: 'rgba(245,158,11,0.08)',   text: '#FCD34D' },
  viso:      { bar: '#3B82F6', bg: 'rgba(59,130,246,0.08)',   text: '#93C5FD' },
  corpo:     { bar: '#10B981', bg: 'rgba(16,185,129,0.08)',   text: '#6EE7B7' },
  makeup:    { bar: '#EC4899', bg: 'rgba(236,72,153,0.08)',   text: '#F9A8D4' },
  altro:     { bar: '#6B7280', bg: 'rgba(107,114,128,0.08)',  text: '#D1D5DB' },
};

function getCategoryColor(category?: ServiceCategory) {
  const key = category?.toLowerCase() || 'altro';
  return CATEGORY_COLORS[key] || CATEGORY_COLORS.altro;
}

/* ─── Helpers ─── */

function getWeekDates(date: Date): Date[] {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay());
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function formatWeekRange(dates: Date[]): string {
  const s = dates[0];
  const e = dates[6];
  return `${s.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} — ${e.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
}

function formatFullDate(d: Date): string {
  const dayName = ITALIAN_DAYS[d.getDay()];
  const day = d.getDate();
  const month = ITALIAN_MONTHS[d.getMonth()];
  return `${dayName} ${day} ${month}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

function isToday(d: Date): boolean {
  return isSameDay(d, new Date());
}

function getDateStr(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatTimeRange(start: Date, end: Date): string {
  const s = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')}`;
  const e = `${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;
  return `${s} — ${e}`;
}

/* ─── Draggable Appointment Card ─── */

function DraggableAppointmentCard({
  appointment,
  categoryColor,
  onClick,
}: {
  appointment: Appointment;
  categoryColor: { bar: string; bg: string; text: string };
  onClick: (app: Appointment) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: appointment.id,
    data: { appointment },
  });

  const style: React.CSSProperties = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: isDragging ? 1000 : 1,
        opacity: isDragging ? 0.7 : 1,
        touchAction: 'none',
      }
    : { touchAction: 'none' };

  const initials = appointment.clientName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const statusLabel: Record<string, string> = {
    confirmed: 'Confermato',
    completed: 'Completato',
    cancelled: 'Cancellato',
    'no-show': 'Assente',
  };

  const statusColor: Record<string, string> = {
    confirmed: 'bg-[var(--success)]/20 text-[var(--success)]',
    completed: 'bg-blue-500/20 text-blue-400',
    cancelled: 'bg-[var(--danger)]/20 text-[var(--danger)]',
    'no-show': 'bg-orange-500/20 text-orange-400',
  };

  const outcomeLabel: Record<string, string> = {
    done: 'Svolto ✅',
    reschedule: 'Da spostare 🔄',
    recontact: 'Da ricontattare 📞',
  };

  const outcomeColor: Record<string, string> = {
    done: 'text-green-400',
    reschedule: 'text-amber-400',
    recontact: 'text-blue-400',
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="relative rounded-xl px-3 py-2.5 cursor-grab active:cursor-grabbing transition-shadow hover:shadow-lg"
      style={{
        ...style,
        backgroundColor: categoryColor.bg,
        minHeight: '44px',
      }}
      title={`${appointment.clientName} — ${appointment.serviceName || 'nessun servizio'}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick(appointment);
      }}
    >
      {/* Left color bar */}
      <div
        className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full"
        style={{ backgroundColor: categoryColor.bar }}
      />

      <div className="flex items-center gap-2.5">
        {/* Avatar circle */}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
          style={{
            backgroundColor: categoryColor.bar,
            color: '#fff',
          }}
        >
          {initials}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-[var(--text-dark)] truncate">
              {appointment.clientName}
            </span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0 ${statusColor[appointment.status] || ''}`}
            >
              {statusLabel[appointment.status] || appointment.status}
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-xs text-[var(--text-muted)] truncate">
              {appointment.serviceName}
            </span>
            <span className="text-[10px] text-[var(--text-dim)] shrink-0">
              {formatTimeRange(appointment.startTime, appointment.endTime)}
            </span>
          </div>
          {/* Outcome badge */}
          {appointment.outcome && (
            <div className={`text-[10px] font-medium mt-0.5 ${outcomeColor[appointment.outcome] || ''}`}>
              {outcomeLabel[appointment.outcome] || appointment.outcome}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Droppable Hour Group ─── */

function DroppableSlot({
  dateStr,
  hour,
  min,
  apps,
  serviceColors,
  onAppointmentClick,
  onSlotClick,
}: {
  dateStr: string;
  hour: number;
  min: number;
  apps: Appointment[];
  serviceColors: Record<string, { bar: string; bg: string; text: string }>;
  onAppointmentClick: (app: Appointment) => void;
  onSlotClick: (hour: number, min: number) => void;
}) {
  const droppableId = slotDroppableId(dateStr, hour, min);
  const { setNodeRef, isOver } = useDroppable({ id: droppableId });

  const slotLabel = formatSlotLabel(hour, min);
  const isOnTheHour = min === 0;
  const rowHeight = 36; // px per 30-min slot

  return (
    <div
      ref={setNodeRef}
      className={`relative border-b border-[var(--border-light)] transition-colors ${
        isOver ? 'bg-[var(--primary-50)] ring-1 ring-[var(--primary-400)] ring-inset' : ''
      } ${apps.length === 0 ? 'cursor-pointer hover:bg-[var(--primary-50)]' : ''}`}
      style={{ minHeight: `${rowHeight}px` }}
      data-slot={droppableId}
      onClick={apps.length === 0 ? () => onSlotClick(hour, min) : undefined}
    >
      <div className="flex items-start gap-3 px-3" style={{ minHeight: `${rowHeight}px` }}>
        {/* Time label */}
        <span
          className={`text-xs font-mono w-10 shrink-0 pt-1 ${
            isOnTheHour ? 'text-[var(--text-muted)] font-semibold' : 'text-[var(--text-dim)]'
          }`}
        >
          {isOnTheHour ? slotLabel : ''}
        </span>

        {/* Content area */}
        <div className="flex-1 relative" style={{ minHeight: `${rowHeight}px` }}>
          {apps.length === 0 ? (
            /* Empty slot — entire area is clickable via parent div */
            <div className="w-full border border-dashed border-[var(--border-strong)] rounded-lg py-1 px-3 text-[10px] text-[var(--text-dim)] transition-colors flex items-center justify-center gap-1 min-h-[28px] pointer-events-none">
              <Plus className="w-3 h-3" />
            </div>
          ) : (
            /* Appointment cards — proportional height */
            apps.map((app) => {
              const durationMs = app.endTime.getTime() - app.startTime.getTime();
              const durationSlots = Math.max(1, Math.ceil(durationMs / (30 * 60 * 1000)));
              return (
                <div key={app.id} style={{ height: `${rowHeight * durationSlots - 4}px`, maxHeight: `${rowHeight * durationSlots - 4}px` }}>
                  <DraggableAppointmentCard
                    appointment={app}
                    categoryColor={serviceColors[app.serviceId] || CATEGORY_COLORS.altro}
                    onClick={onAppointmentClick}
                  />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Main Calendar Component ─── */

export function Calendar() {
  const { firebaseUser } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ hour: number; min: number } | null>(null);
  const [showSharedToast, setShowSharedToast] = useState(false);
  const [optimisticApps, setOptimisticApps] = useState<Appointment[]>([]);

  const weekDates = getWeekDates(currentDate);
  const agendaScrollRef = useRef<HTMLDivElement>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  });
  const sensors = useSensors(pointerSensor);

  /* ─── Auto-remove optimistic appointments when Firestore syncs ─── */
  useEffect(() => {
    if (optimisticApps.length === 0) return;
    setOptimisticApps((prev) =>
      prev.filter((opt) => {
        // Keep optimistic if no real appointment matches client + time + service
        const hasMatch = appointments.some(
          (real) =>
            real.clientId === opt.clientId &&
            real.serviceId === opt.serviceId &&
            real.startTime.getTime() === opt.startTime.getTime()
        );
        return !hasMatch;
      })
    );
  }, [appointments, optimisticApps.length]);

  /* ─── Firestore subscriptions ─── */

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const unsubServices = onSnapshot(
      query(collection(db, 'services'), where('userId', '==', uid)),
      (snap) => setServices(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Service)))
    );
    const unsubClients = onSnapshot(
      query(collection(db, 'clients'), where('userId', '==', uid)),
      (snap) => setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Client)))
    );

    return () => {
      unsubServices();
      unsubClients();
    };
  }, [firebaseUser?.uid]);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const startOfWeek = weekDates[0];
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    const unsubApps = onSnapshot(
      query(
        collection(db, 'appointments'),
        where('userId', '==', uid),
        where('startTime', '>=', Timestamp.fromDate(startOfWeek)),
        where('startTime', '<', Timestamp.fromDate(endOfWeek)),
        orderBy('startTime', 'asc')
      ),
      (snap) => {
        const apps = snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          startTime: d.data().startTime.toDate(),
          endTime: d.data().endTime.toDate(),
        })) as Appointment[];
        setAppointments(apps);
      },
      (error) => {
        console.error('Firestore appointments sync error:', error);
      }
    );

    return () => { unsubApps(); };
  }, [firebaseUser?.uid, currentDate]);

  /* ─── Navigation ─── */

  const prevWeek = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() - 7);
      return next;
    });
  };

  const nextWeek = () => {
    setCurrentDate((d) => {
      const next = new Date(d);
      next.setDate(next.getDate() + 7);
      return next;
    });
  };

  const goToToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now);
  };

  const selectDay = (date: Date) => {
    setSelectedDay(date);
  };

  /* ─── Derived data ─── */

  const dayAppointments = useMemo(
    () => {
      const real = appointments
        .filter((app) => isSameDay(app.startTime, selectedDay))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      const optimistic = optimisticApps
        .filter((app) => isSameDay(app.startTime, selectedDay))
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      return [...real, ...optimistic];
    },
    [appointments, optimisticApps, selectedDay]
  );

  const dayRevenue = useMemo(
    () => dayAppointments.reduce((sum, app) => sum + (app.price || 0), 0),
    [dayAppointments]
  );

  /* Build a map: serviceId → color (uses per-service color, falls back to category) */
  const serviceColors = useMemo(() => {
    const map: Record<string, { bar: string; bg: string; text: string }> = {};
    services.forEach((s) => {
      const bar = s.color || getCategoryColor(s.category).bar;
      const bg = hexToRgba(bar, 0.08);
      const text = bar;
      map[s.id] = { bar, bg, text };
    });
    return map;
  }, [services]);

  /* Group appointments by hour */
  const groupedBySlot = useMemo(() => {
    const slotKey = (h: number, m: number) => `${h}:${m}`;
    const groups: Record<string, Appointment[]> = {};
    SLOTS.forEach(({ hour, min }) => {
      groups[slotKey(hour, min)] = [];
    });
    dayAppointments.forEach((app) => {
      const h = app.startTime.getHours();
      const m = app.startTime.getMinutes();
      // Snap to nearest slot
      const snappedMin = m < 30 ? 0 : 30;
      const key = slotKey(h, snappedMin);
      if (groups[key]) {
        groups[key].push(app);
      } else {
        if (!groups[key]) groups[key] = [];
        groups[key].push(app);
      }
    });
    return groups;
  }, [dayAppointments]);

  /* Days with appointments (for dot indicators) */
  const daysWithApps = useMemo(() => {
    const set = new Set<string>();
    appointments.forEach((app) => set.add(getDateStr(app.startTime)));
    return set;
  }, [appointments]);

  /* ─── Handlers ─── */

  const handleSlotClick = (hour: number, min: number) => {
    setSelectedSlot({ hour, min });
    setShowAddModal(true);
  };

  const handleAppointmentClick = (app: Appointment) => {
    setEditingAppointment(app);
    setShowEditModal(true);
  };

  const handleDeleteAppointment = async (appId: string) => {
    try {
      await deleteDoc(doc(db, 'appointments', appId));
      setShowEditModal(false);
      setEditingAppointment(null);
    } catch (err) {
      console.error('Error deleting appointment:', err);
      alert("❌ Errore durante l'eliminazione. Riprova.");
    }
  };

  const handleOptimisticAdd = useCallback((app: Appointment) => {
    setOptimisticApps((prev) => [...prev, app]);
    playNotificationSound();
  }, []);

  /* ─── Drag & Drop ─── */

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || !active) return;

      const overId = String(over.id);
      const match = overId.match(/^slot:([^:]+):(\d+):(\d+)$/);
      if (!match) return;

      const targetHour = parseInt(match[2]);
      const targetMin = parseInt(match[3]);

      const appointment = appointments.find((a) => a.id === active.id);
      if (!appointment) return;

      // Keep same date, change hour/min
      const newDate = new Date(appointment.startTime);
      newDate.setHours(targetHour, targetMin, 0, 0);
      const duration = appointment.duration || 30;
      const newEnd = new Date(newDate.getTime() + duration * 60000);

      if (newDate.getTime() === appointment.startTime.getTime()) return;

      try {
        await updateDoc(doc(db, 'appointments', appointment.id), {
          startTime: Timestamp.fromDate(newDate),
          endTime: Timestamp.fromDate(newEnd),
        });
      } catch (err) {
        console.error('Error moving appointment:', err);
        alert("❌ Errore durante lo spostamento dell'appuntamento. Riprova.");
      }
    },
    [appointments]
  );

  /* ─── Share ─── */

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowSharedToast(true);
      setTimeout(() => setShowSharedToast(false), 2500);
    } catch {
      alert(`Condividi questo link:\n${url}`);
    }
  };

  /* ─── Scroll to current hour ─── */

  const scrollToNow = () => {
    const now = new Date();
    const nowMinutes = Math.floor(now.getMinutes() / 30) * 30;
    const slotSelector = `[data-slot=\"slot:${getDateStr(selectedDay)}:${now.getHours()}:${nowMinutes}\"]`;

    if (!isToday(selectedDay)) {
      goToToday();
      setTimeout(() => {
        const el = agendaScrollRef.current?.querySelector(slotSelector);
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      return;
    }

    const el = agendaScrollRef.current?.querySelector(slotSelector);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  /* Show "Now" button during working hours */
  const now = new Date();
  const isWorkingHours = now.getHours() >= 6 && now.getHours() <= 21;

  /* ─── Preselected slot for Add Modal ─── */

  const preselectedSlot = useMemo(() => {
    if (selectedSlot === null) return null;
    return { hour: selectedSlot.hour, min: selectedSlot.min, dateStr: getDateStr(selectedDay) };
  }, [selectedSlot, selectedDay]);

  return (
    <div className="flex flex-col h-full">
      {/* ─── Header ─── */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-dark)]">Agenda</h1>
          <p className="text-sm text-[var(--text-muted)]">{formatWeekRange(weekDates)}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="btn-ghost p-2"
            title="Condividi calendario"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <Button onClick={() => { setSelectedSlot(null); setShowAddModal(true); }}>
            <Plus className="w-4 h-4 mr-1" />
            Nuovo
          </Button>
        </div>
      </div>

      {/* ─── Horizontal Week Strip ─── */}
      <div className="flex items-center gap-1 mb-4">
        <button onClick={prevWeek} className="btn-ghost p-1.5 shrink-0">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex-1 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5 min-w-0 px-1">
            {weekDates.map((date) => {
              const dayIsToday = isToday(date);
              const dayIsSelected = isSameDay(date, selectedDay);
              const hasApps = daysWithApps.has(getDateStr(date));

              return (
                <button
                  key={getDateStr(date)}
                  onClick={() => selectDay(date)}
                  className={`relative flex flex-col items-center justify-center shrink-0 w-11 h-14 rounded-2xl transition-all duration-200 ${
                    dayIsSelected
                      ? 'text-white'
                      : dayIsToday
                        ? 'bg-[var(--primary-100)] text-[var(--primary-500)]'
                        : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)]'
                  }`}
                  style={
                    dayIsSelected
                      ? {
                          background: 'linear-gradient(135deg, #EC4899, #A855F7)',
                          boxShadow: '0 2px 12px rgba(236,72,153,0.3)',
                        }
                      : undefined
                  }
                >
                  <span className="text-[10px] font-medium opacity-80">
                    {DAYS_ABBREVIATED[date.getDay()]}
                  </span>
                  <span className="text-sm font-bold">{date.getDate()}</span>
                  {/* Dot indicator */}
                  {hasApps && !dayIsSelected && (
                    <span
                      className="absolute bottom-1.5 w-1 h-1 rounded-full"
                      style={{ backgroundColor: dayIsToday ? '#EC4899' : 'var(--text-dim)' }}
                    />
                  )}
                  {hasApps && dayIsSelected && (
                    <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-white" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={nextWeek} className="btn-ghost p-1.5 shrink-0">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2 mb-1">
        <button
          onClick={goToToday}
          className="text-xs font-medium text-[var(--primary-500)] hover:underline"
        >
          Oggi
        </button>
      </div>

      {/* ─── Selected Day Header (Revenue + Count) ─── */}
      <div className="flex items-center justify-between mb-4 px-1">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-dark)]">
            {formatFullDate(selectedDay)}
          </h2>
          <p className="text-sm text-[var(--text-muted)]">
            {dayAppointments.length} appuntament{dayAppointments.length !== 1 ? 'i' : 'o'}
            {dayRevenue > 0 && (
              <span className="font-semibold text-[var(--primary-500)]">
                {' · '}{formatCurrency(dayRevenue)}
              </span>
            )}
          </p>
        </div>
        <CalendarDays className="w-5 h-5 text-[var(--text-dim)]" />
      </div>

      {/* ─── Agenda List ─── */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div
          ref={agendaScrollRef}
          className="flex-1 overflow-y-auto rounded-2xl bg-[var(--bg-card)] border border-[var(--border-light)] scroll-smooth"
          style={{ maxHeight: 'calc(100vh - 380px)', minHeight: '200px' }}
        >
          {SLOTS.map(({ hour, min }) => {
            const slotKey = `${hour}:${min}`;
            const apps = groupedBySlot[slotKey] || [];
            return (
              <DroppableSlot
                key={slotKey}
                dateStr={getDateStr(selectedDay)}
                hour={hour}
                min={min}
                apps={apps}
                serviceColors={serviceColors}
                onAppointmentClick={handleAppointmentClick}
                onSlotClick={handleSlotClick}
              />
            );
          })}
        </div>
      </DndContext>

      {/* ─── Floating "Ora" Button ─── */}
      {isWorkingHours && (
        <button
          onClick={scrollToNow}
          className="fixed bottom-24 right-4 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
          style={{
            background: 'linear-gradient(135deg, #EC4899, #A855F7)',
            boxShadow: '0 4px 16px rgba(236,72,153,0.4)',
          }}
          title="Vai all'ora corrente"
        >
          <Clock className="w-5 h-5 text-white" />
        </button>
      )}

      {/* ─── Shared Toast ─── */}
      {showSharedToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[var(--text-dark)] text-[var(--bg-soft)] px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in text-sm">
          <Check className="w-4 h-4 text-[var(--success)]" />
          Link copiato! Condividilo con il tuo staff
        </div>
      )}

      {/* ─── Modals ─── */}
      <AddAppointmentModal
        isOpen={showAddModal}
        onClose={() => { setShowAddModal(false); setSelectedSlot(null); }}
        services={services}
        clients={clients}
        preselectedSlot={preselectedSlot}
        onOptimisticAdd={handleOptimisticAdd}
      />

      <EditAppointmentModal
        isOpen={showEditModal}
        appointment={editingAppointment}
        onClose={() => { setShowEditModal(false); setEditingAppointment(null); }}
        onDelete={handleDeleteAppointment}
        services={services}
        clients={clients}
      />
    </div>
  );
}

/* ─── Add Appointment Modal ─── */

function AddAppointmentModal({
  isOpen,
  onClose,
  services,
  clients,
  preselectedSlot,
  onOptimisticAdd,
}: {
  isOpen: boolean;
  onClose: () => void;
  services: Service[];
  clients: Client[];
  preselectedSlot: { hour: number; min: number; dateStr?: string } | null;
  onOptimisticAdd: (app: Appointment) => void;
}) {
  const { firebaseUser } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (preselectedSlot && isOpen) {
      setTime(`${preselectedSlot.hour.toString().padStart(2, '0')}:${preselectedSlot.min.toString().padStart(2, '0')}`);
      if (preselectedSlot.dateStr) setDate(preselectedSlot.dateStr);
    }
  }, [preselectedSlot, isOpen]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const client = clients.find((c) => c.id === selectedClientId);

  const handleSave = async () => {
    if (!firebaseUser?.uid || !selectedClientId || !selectedServiceId || !date || !time) return;
    setSaving(true);

    const startTime = new Date(`${date}T${time}`);
    const endTime = new Date(startTime.getTime() + (selectedService?.duration || 30) * 60000);

    // Optimistic add: show instantly with temp ID + play sound
    const tempId = `optimistic-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    onOptimisticAdd({
      id: tempId,
      userId: firebaseUser.uid,
      clientId: client?.id || '',
      clientName: client?.name || '',
      clientPhone: client?.phone || '',
      serviceId: selectedService?.id || '',
      serviceName: selectedService?.name || '',
      duration: selectedService?.duration || 30,
      price: selectedService?.price || 0,
      startTime,
      endTime,
      status: 'confirmed' as const,
      notes,
      reminderSent: false,
      createdAt: new Date(),
    });

    try {
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
      resetForm();
    } catch (err) {
      console.error('Error creating appointment:', err);
      alert("Errore durante la creazione dell'appuntamento. Riprova.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setSelectedClientId('');
    setSelectedServiceId('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('10:00');
    setNotes('');
  };

  const activeServices = services.filter((s) => s.isActive);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Nuovo Appuntamento">
      <div className="space-y-4">
        <AppointmentFormFields
          selectedClientId={selectedClientId}
          onClientChange={setSelectedClientId}
          selectedServiceId={selectedServiceId}
          onServiceChange={setSelectedServiceId}
          date={date}
          onDateChange={setDate}
          time={time}
          onTimeChange={setTime}
          notes={notes}
          onNotesChange={setNotes}
          clients={clients}
          services={activeServices}
        />

        {/* Summary */}
        {selectedService && client && (
          <div className="bg-[var(--primary-50)] rounded-xl p-3 text-sm">
            <p className="font-medium text-[var(--text-dark)]">Riepilogo</p>
            <p className="text-[var(--text-muted)] mt-1">
              {client.name} — {selectedService.name}<br />
              {time} — {formatCurrency(selectedService.price)}
              <span className="text-[var(--text-dim)]"> · {selectedService.duration}min</span>
            </p>
          </div>
        )}

        <Button fullWidth onClick={handleSave} disabled={saving || !selectedClientId || !selectedServiceId}>
          {saving ? 'Salvataggio...' : 'Conferma Appuntamento'}
        </Button>
      </div>
    </Modal>
  );
}

/* ─── Edit Appointment Modal ─── */

function EditAppointmentModal({
  isOpen,
  appointment,
  onClose,
  onDelete,
  services,
  clients,
}: {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  services: Service[];
  clients: Client[];
}) {
  const { firebaseUser } = useAuth();
  const [selectedClientId, setSelectedClientId] = useState('');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<Appointment['status']>('confirmed');
  const [outcome, setOutcome] = useState<AppointmentOutcome>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (appointment && isOpen) {
      setSelectedClientId(appointment.clientId || '');
      setSelectedServiceId(appointment.serviceId || '');
      const d = new Date(appointment.startTime);
      setDate(d.toISOString().split('T')[0]);
      setTime(`${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`);
      setNotes(appointment.notes || '');
      setStatus(appointment.status);
      setOutcome(appointment.outcome || null);
      setConfirmDelete(false);
    }
  }, [appointment, isOpen]);

  const selectedService = services.find((s) => s.id === selectedServiceId);
  const client = clients.find((c) => c.id === selectedClientId);
  const activeServices = services.filter((s) => s.isActive);

  const handleUpdate = async () => {
    if (!firebaseUser?.uid || !appointment?.id || !selectedClientId || !selectedServiceId || !date || !time) return;
    setSaving(true);
    try {
      const startTime = new Date(`${date}T${time}`);
      const endTime = new Date(startTime.getTime() + (selectedService?.duration || 30) * 60000);

      await updateDoc(doc(db, 'appointments', appointment.id), {
        clientId: client?.id || '',
        clientName: client?.name || '',
        clientPhone: client?.phone || '',
        serviceId: selectedService?.id || '',
        serviceName: selectedService?.name || '',
        duration: selectedService?.duration || 30,
        price: selectedService?.price || 0,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        status,
        notes,
        outcome: outcome || null,
      });
      onClose();
    } catch (err) {
      console.error('Error updating appointment:', err);
      alert("❌ Errore durante l'aggiornamento dell'appuntamento. Controlla la connessione e riprova.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!appointment?.id) return;
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    await onDelete(appointment.id);
    setDeleting(false);
  };

  if (!appointment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Modifica Appuntamento">
      <div className="space-y-4">
        <AppointmentFormFields
          selectedClientId={selectedClientId}
          onClientChange={setSelectedClientId}
          selectedServiceId={selectedServiceId}
          onServiceChange={setSelectedServiceId}
          date={date}
          onDateChange={setDate}
          time={time}
          onTimeChange={setTime}
          notes={notes}
          onNotesChange={setNotes}
          clients={clients}
          services={activeServices}
        />

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Stato</label>
          <select
            className="input-field"
            value={status}
            onChange={(e) => setStatus(e.target.value as Appointment['status'])}
          >
            <option value="confirmed">Confermato</option>
            <option value="completed">Completato</option>
            <option value="cancelled">Cancellato</option>
            <option value="no-show">Non presentato</option>
          </select>
        </div>

        {/* Outcome / Esito */}
        <div>
          <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Esito</label>
          <select
            className="input-field"
            value={outcome || ''}
            onChange={(e) => setOutcome((e.target.value || null) as AppointmentOutcome)}
          >
            <option value="">Nessuno</option>
            <option value="done">✅ Svolto</option>
            <option value="reschedule">🔄 Da spostare</option>
            <option value="recontact">📞 Da ricontattare</option>
          </select>
        </div>

        {/* Reminder indicator */}
        <div className="flex items-center gap-2 text-sm text-[var(--text-muted)] bg-[var(--bg-soft)] rounded-xl p-3">
          {appointment.reminderSent ? (
            <>
              <BellRing className="w-4 h-4 text-[var(--success)]" />
              <span>Promemoria WhatsApp inviato ✅</span>
            </>
          ) : (
            <>
              <Bell className="w-4 h-4" />
              <span>Promemoria WhatsApp non ancora inviato</span>
            </>
          )}
        </div>

        {/* Summary */}
        {selectedService && client && (
          <div className="bg-[var(--primary-50)] rounded-xl p-3 text-sm">
            <p className="font-medium text-[var(--text-dark)]">Riepilogo</p>
            <p className="text-[var(--text-muted)] mt-1">
              {client.name} — {selectedService.name}<br />
              {time} — {formatCurrency(selectedService.price)}
              <span className="text-[var(--text-dim)]"> · {selectedService.duration}min</span>
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant={confirmDelete ? 'danger' : 'secondary'}
            className="flex-1"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Eliminazione...' : confirmDelete ? (
              <>Conferma eliminazione</>
            ) : (
              <><Trash2 className="w-4 h-4 mr-1" /> Elimina</>
            )}
          </Button>
          <Button
            className="flex-1"
            onClick={handleUpdate}
            disabled={saving || !selectedClientId || !selectedServiceId}
          >
            {saving ? 'Salvataggio...' : <><Pencil className="w-4 h-4 mr-1" /> Salva</>}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

/* ─── Shared Form Fields ─── */

function AppointmentFormFields({
  selectedClientId,
  onClientChange,
  selectedServiceId,
  onServiceChange,
  date,
  onDateChange,
  time,
  onTimeChange,
  notes,
  onNotesChange,
  clients,
  services,
}: {
  selectedClientId: string;
  onClientChange: (v: string) => void;
  selectedServiceId: string;
  onServiceChange: (v: string) => void;
  date: string;
  onDateChange: (v: string) => void;
  time: string;
  onTimeChange: (v: string) => void;
  notes: string;
  onNotesChange: (v: string) => void;
  clients: Client[];
  services: Service[];
}) {
  return (
    <>
      <div>
        <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Cliente</label>
        <select
          className="input-field"
          value={selectedClientId}
          onChange={(e) => onClientChange(e.target.value)}
        >
          <option value="">Seleziona cliente...</option>
          {clients.map((c) => (
            <option key={c.id} value={c.id}>{c.name} — {c.phone}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Servizio</label>
        <select
          className="input-field"
          value={selectedServiceId}
          onChange={(e) => onServiceChange(e.target.value)}
        >
          <option value="">Seleziona servizio...</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.duration}min — {formatCurrency(s.price)}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Data</label>
          <input
            type="date"
            className="input-field"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Ora</label>
          <input
            type="time"
            step="900"
            className="input-field"
            value={time}
            onChange={(e) => onTimeChange(e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--text-dark)] mb-1.5">Note (opzionale)</label>
        <textarea
          className="input-field min-h-[60px] resize-none"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          placeholder="Indicazioni, richieste speciali..."
        />
      </div>
    </>
  );
}