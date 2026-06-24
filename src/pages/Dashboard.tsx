import { useState, useEffect } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Plus, Phone, Clock, CalendarDays } from 'lucide-react';
import { formatTime, formatCurrency } from '../lib/format';
import type { Appointment } from '../types';

export function Dashboard() {
  const { user, firebaseUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    // Get today's start and end
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', uid),
      where('startTime', '>=', Timestamp.fromDate(startOfDay)),
      where('startTime', '<', Timestamp.fromDate(endOfDay)),
      orderBy('startTime', 'asc')
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const apps = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Appointment[];
      setAppointments(apps);
      setLoading(false);
    });

    return unsub;
  }, [firebaseUser?.uid]);

  const today = new Date();
  const dateStr = today.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const confirmed = appointments.filter((a) => a.status === 'confirmed');
  const completed = appointments.filter((a) => a.status === 'completed');
  const totalConfirmed = confirmed.reduce((sum, a) => sum + a.price, 0);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-primary-500 mb-1">
          <CalendarDays className="w-4 h-4" />
          <span className="text-sm font-medium capitalize">{dateStr}</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-text-dark">Ciao, {user?.name?.split(' ')[0] || 'Benvenuta'} 👋</h1>
          <Button size="sm" variant="ghost" className="gradient-primary text-white">
            <Plus className="w-4 h-4 mr-1" />
            Nuovo
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-primary-500">{confirmed.length}</p>
          <p className="text-xs text-text-muted mt-1">Oggi</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-success">{completed.length}</p>
          <p className="text-xs text-text-muted mt-1">Completati</p>
        </Card>
        <Card className="text-center py-4">
          <p className="text-2xl font-bold text-gold-500">{formatCurrency(totalConfirmed)}</p>
          <p className="text-xs text-text-muted mt-1">Previsto</p>
        </Card>
      </div>

      {/* Timeline */}
      <h2 className="font-bold text-text-dark mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-primary-500" />
        Appuntamenti di oggi
      </h2>

      {appointments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-3">
          {appointments.map((app) => (
            <AppointmentCard key={app.id} appointment={app} />
          ))}
        </div>
      )}
    </div>
  );
}

function AppointmentCard({ appointment }: { appointment: Appointment }) {
  const statusColors = {
    confirmed: 'bg-primary-500',
    completed: 'bg-success',
    cancelled: 'bg-text-muted',
    'no-show': 'bg-danger',
  };

  const statusLabels: Record<string, string> = {
    confirmed: 'Confermato',
    completed: 'Completato',
    cancelled: 'Cancellato',
    'no-show': 'Non venuto',
  };

  return (
    <div className="flex gap-3">
      {/* Time column */}
      <div className="w-16 flex flex-col items-center pt-2">
        <span className="text-sm font-bold text-text-dark">{formatTime(appointment.startTime)}</span>
        <div className="flex-1 w-px bg-[#E0D0D0] my-1" />
        <span className="text-xs text-text-muted">{appointment.duration}min</span>
      </div>

      {/* Card */}
      <div className={`flex-1 appointment-card ${appointment.status === 'completed' ? 'opacity-60' : ''}`}>
        <div className="flex items-center gap-3">
          <Avatar name={appointment.clientName} size="md" />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-text-dark truncate">{appointment.clientName}</h3>
            <p className="text-sm text-text-muted truncate">{appointment.serviceName}</p>
            <p className="text-sm font-bold text-primary-500">{formatCurrency(appointment.price)}</p>
          </div>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${appointment.clientPhone}`}
              className="btn-ghost w-9 h-9 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center"
            >
              <Phone className="w-4 h-4" />
            </a>
            <div className={`w-2 h-2 rounded-full ${statusColors[appointment.status]}`} title={statusLabels[appointment.status]} />
          </div>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="text-center py-12">
      <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <CalendarDays className="w-8 h-8 text-primary-500" />
      </div>
      <h3 className="font-bold text-text-dark mb-1">Nessun appuntamento oggi</h3>
      <p className="text-sm text-text-muted mb-4">Goditi la giornata o aggiungi un nuovo appuntamento!</p>
      <Button>
        <Plus className="w-4 h-4 mr-1" />
        Nuovo appuntamento
      </Button>
    </Card>
  );
}

function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-[#E0D0D0] rounded-lg" />
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[#E0D0D0] rounded-2xl" />
        ))}
      </div>
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[#E0D0D0] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}