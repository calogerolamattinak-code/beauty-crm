import { useState, useEffect, useMemo } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Card } from '../components/ui/Card';
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  Users,
  CheckCircle2,
  Hash,
  BarChart3,
} from 'lucide-react';
import { formatCurrency } from '../lib/format';
import type { Appointment, Client } from '../types';

/* ─── Types ─── */

interface MonthlyStats {
  month: number; // 0–11
  label: string;
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  newClients: number;
}

interface YearlyStats {
  year: number;
  total: number;
  completed: number;
  cancelled: number;
  noShow: number;
  revenue: number;
  newClients: number;
}

/* ─── Helpers ─── */

const MONTHS_IT = [
  'Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu',
  'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic',
];

const MONTHS_FULL = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre',
];

function groupByMonth(apps: Appointment[], year: number): MonthlyStats[] {
  const grouped: Record<number, MonthlyStats> = {};
  for (let m = 0; m < 12; m++) {
    grouped[m] = {
      month: m,
      label: MONTHS_IT[m],
      total: 0,
      completed: 0,
      cancelled: 0,
      noShow: 0,
      revenue: 0,
      newClients: 0,
    };
  }
  for (const app of apps) {
    const d = app.startTime instanceof Date ? app.startTime : new Date(app.startTime);
    if (d.getFullYear() !== year) continue;
    const m = d.getMonth();
    grouped[m].total++;
    if (app.status === 'completed') {
      grouped[m].completed++;
      grouped[m].revenue += app.price || 0;
    }
    if (app.status === 'cancelled') grouped[m].cancelled++;
    if (app.status === 'no-show') grouped[m].noShow++;
  }
  return Object.values(grouped);
}

function groupByYear(apps: Appointment[]): YearlyStats[] {
  const map = new Map<number, YearlyStats>();
  for (const app of apps) {
    const d = app.startTime instanceof Date ? app.startTime : new Date(app.startTime);
    const y = d.getFullYear();
    if (!map.has(y)) {
      map.set(y, { year: y, total: 0, completed: 0, cancelled: 0, noShow: 0, revenue: 0, newClients: 0 });
    }
    const s = map.get(y)!;
    s.total++;
    if (app.status === 'completed') { s.completed++; s.revenue += app.price || 0; }
    if (app.status === 'cancelled') s.cancelled++;
    if (app.status === 'no-show') s.noShow++;
  }
  return Array.from(map.values()).sort((a, b) => b.year - a.year);
}

function clientsByMonth(clients: Client[], year: number): number[] {
  const counts = new Array(12).fill(0);
  for (const c of clients) {
    const created = c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt);
    if (created.getFullYear() !== year) continue;
    counts[created.getMonth()]++;
  }
  return counts;
}

function clientsByYear(clients: Client[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const c of clients) {
    const created = c.createdAt instanceof Date ? c.createdAt : new Date(c.createdAt);
    const y = created.getFullYear();
    map.set(y, (map.get(y) || 0) + 1);
  }
  return map;
}

function trend(current: number, previous: number): { delta: number; direction: 'up' | 'down' | 'flat' } {
  if (previous === 0) return { delta: current > 0 ? 100 : 0, direction: current > 0 ? 'up' : 'flat' };
  const delta = Math.round(((current - previous) / previous) * 100);
  return { delta: Math.abs(delta), direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat' };
}

/* ─── Component ─── */

export function KPI() {
  const { firebaseUser } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'monthly' | 'annual'>('monthly');

  const currentYear = new Date().getFullYear();

  // Fetch all appointments
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'appointments'),
      where('userId', '==', uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const apps = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        startTime: doc.data().startTime.toDate(),
        endTime: doc.data().endTime.toDate(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
      })) as Appointment[];
      setAppointments(apps);
    });
    return unsub;
  }, [firebaseUser?.uid]);

  // Fetch all clients
  useEffect(() => {
    const uid = firebaseUser?.uid;
    if (!uid) return;

    const q = query(
      collection(db, 'clients'),
      where('userId', '==', uid),
    );

    const unsub = onSnapshot(q, (snap) => {
      const cls = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date(),
        lastVisit: doc.data().lastVisit?.toDate(),
      })) as Client[];
      setClients(cls);
      setLoading(false);
    });
    return unsub;
  }, [firebaseUser?.uid]);

  // Compute stats
  const monthlyStats = useMemo(() => groupByMonth(appointments, currentYear), [appointments, currentYear]);
  const yearlyStats = useMemo(() => groupByYear(appointments), [appointments]);
  const clientsMonthly = useMemo(() => clientsByMonth(clients, currentYear), [clients, currentYear]);
  const clientsYearly = useMemo(() => clientsByYear(clients), [clients]);

  // Merge new clients into monthly/yearly stats
  const monthlyWithClients = useMemo(() => {
    return monthlyStats.map((m) => ({ ...m, newClients: clientsMonthly[m.month] }));
  }, [monthlyStats, clientsMonthly]);

  const yearlyWithClients = useMemo(() => {
    return yearlyStats.map((y) => ({ ...y, newClients: clientsYearly.get(y.year) || 0 }));
  }, [yearlyStats, clientsYearly]);

  // Annual totals for current year
  const yearTotals = useMemo(() => {
    const appsThisYear = appointments.filter(
      (a) => new Date(a.startTime).getFullYear() === currentYear
    );
    const total = appsThisYear.length;
    const completed = appsThisYear.filter((a) => a.status === 'completed').length;
    const cancelled = appsThisYear.filter((a) => a.status === 'cancelled').length;
    const noShow = appsThisYear.filter((a) => a.status === 'no-show').length;
    const revenue = appsThisYear
      .filter((a) => a.status === 'completed')
      .reduce((s, a) => s + (a.price || 0), 0);
    const newClientsYear = clients.filter(
      (c) => new Date(c.createdAt).getFullYear() === currentYear
    ).length;
    return { total, completed, cancelled, noShow, revenue, newClients: newClientsYear };
  }, [appointments, clients, currentYear]);

  // Previous month stats for trend
  const prevMonthStats = useMemo(() => {
    const prevDate = new Date();
    prevDate.setMonth(prevDate.getMonth() - 1);
    const prevYear = prevDate.getFullYear();
    const prevMonth = prevDate.getMonth();
    const apps = appointments.filter((a) => {
      const d = new Date(a.startTime);
      return d.getFullYear() === prevYear && d.getMonth() === prevMonth;
    });
    const total = apps.length;
    const completed = apps.filter((a) => a.status === 'completed').length;
    const revenue = apps.filter((a) => a.status === 'completed').reduce((s, a) => s + (a.price || 0), 0);
    return { total, completed, revenue };
  }, [appointments]);

  const currentMonth = new Date().getMonth();
  const currentMonthStats = monthlyWithClients[currentMonth] || { total: 0, completed: 0, revenue: 0 };
  const monthTrend = trend(currentMonthStats.total, prevMonthStats.total);
  const revenueTrend = trend(currentMonthStats.revenue, prevMonthStats.revenue);

  // Previous year for annual trend
  const prevYearStats = useMemo(() => {
    const prevY = currentYear - 1;
    const apps = appointments.filter((a) => new Date(a.startTime).getFullYear() === prevY);
    const total = apps.length;
    const completed = apps.filter((a) => a.status === 'completed').length;
    const revenue = apps.filter((a) => a.status === 'completed').reduce((s, a) => s + (a.price || 0), 0);
    return { total, completed, revenue };
  }, [appointments, currentYear]);

  const yearTrend = trend(yearTotals.total, prevYearStats.total);
  const yearRevenueTrend = trend(yearTotals.revenue, prevYearStats.revenue);

  if (loading) return <KPILoadingSkeleton />;

  // Bar chart config
  const maxBarValue = Math.max(...monthlyWithClients.map((m) => m.total), 1);
  const barMaxRevenue = Math.max(...monthlyWithClients.map((m) => m.revenue), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-primary-500 mb-1">
            <BarChart3 className="w-4 h-4" />
            <span className="text-sm font-medium">Statistiche</span>
          </div>
          <h1 className="text-2xl font-bold text-text-dark">Andamento attività</h1>
        </div>
        {/* View toggle */}
        <div className="flex bg-[var(--bg-elevated)] rounded-xl p-0.5 border border-[var(--border-light)]">
          <button
            onClick={() => setView('monthly')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'monthly'
                ? 'gradient-primary text-white shadow-md'
                : 'text-text-muted hover:text-text-dark'
            }`}
          >
            Mensile
          </button>
          <button
            onClick={() => setView('annual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              view === 'annual'
                ? 'gradient-primary text-white shadow-md'
                : 'text-text-muted hover:text-text-dark'
            }`}
          >
            Annuale
          </button>
        </div>
      </div>

      {view === 'monthly' ? (
        <MonthlyView
          monthlyStats={monthlyWithClients}
          currentMonth={currentMonth}
          currentYear={currentYear}
          monthTrend={monthTrend}
          revenueTrend={revenueTrend}
          maxBarValue={maxBarValue}
          barMaxRevenue={barMaxRevenue}
        />
      ) : (
        <AnnualView
          yearlyStats={yearlyWithClients}
          yearTotals={yearTotals}
          currentYear={currentYear}
          yearTrend={yearTrend}
          yearRevenueTrend={yearRevenueTrend}
        />
      )}
    </div>
  );
}

/* ─── Monthly View ─── */

function MonthlyView({
  monthlyStats,
  currentMonth,
  currentYear,
  monthTrend,
  revenueTrend,
  maxBarValue,
  barMaxRevenue,
}: {
  monthlyStats: MonthlyStats[];
  currentMonth: number;
  currentYear: number;
  monthTrend: { delta: number; direction: string };
  revenueTrend: { delta: number; direction: string };
  maxBarValue: number;
  barMaxRevenue: number;
}) {
  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          icon={<Calendar className="w-4 h-4" />}
          label={monthlyStats[currentMonth]?.total.toString() || '0'}
          sublabel="Questo mese"
          trend={monthTrend}
          color="primary"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label={monthlyStats[currentMonth]?.completed.toString() || '0'}
          sublabel="Completati"
          color="success"
        />
        <SummaryCard
          icon={<DollarSign className="w-4 h-4" />}
          label={formatCurrency(monthlyStats[currentMonth]?.revenue || 0)}
          sublabel="Ricavi"
          trend={revenueTrend}
          color="gold"
        />
        <SummaryCard
          icon={<Users className="w-4 h-4" />}
          label={monthlyStats[currentMonth]?.newClients.toString() || '0'}
          sublabel="Nuovi clienti"
          color="secondary"
        />
      </div>

      {/* Bar chart — Appointments per month */}
      <Card className="p-5">
        <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-primary-500" />
          Appuntamenti mensili — {currentYear}
        </h3>
        <div className="flex items-end gap-1.5 h-32">
          {monthlyStats.map((m) => {
            const pct = maxBarValue > 0 ? (m.total / maxBarValue) * 100 : 0;
            const isCurrent = m.month === currentMonth;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[10px] font-bold text-text-dark">{m.total}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isCurrent ? 'gradient-primary' : 'bg-[var(--primary-300)]/40'
                  }`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
                <span className={`text-[9px] font-medium ${isCurrent ? 'text-primary-500' : 'text-text-dim'}`}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Revenue bar chart */}
      <Card className="p-5">
        <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gold" />
          Ricavi mensili — {currentYear}
        </h3>
        <div className="flex items-end gap-1.5 h-32">
          {monthlyStats.map((m) => {
            const pct = barMaxRevenue > 0 ? (m.revenue / barMaxRevenue) * 100 : 0;
            const isCurrent = m.month === currentMonth;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-[9px] font-bold text-gold">{m.revenue > 0 ? formatCurrency(m.revenue) : ''}</span>
                <div
                  className={`w-full rounded-t-md transition-all ${
                    isCurrent ? 'bg-[var(--gold)]' : 'bg-[var(--gold)]/30'
                  }`}
                  style={{ height: `${Math.max(pct, 4)}%` }}
                />
                <span className={`text-[9px] font-medium ${isCurrent ? 'text-gold' : 'text-text-dim'}`}>
                  {m.label}
                </span>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Detail table */}
      <Card className="p-5">
        <h3 className="font-bold text-text-dark mb-4">Dettaglio mensile — {currentYear}</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-[var(--border-light)]">
                <th className="text-left pb-3 font-semibold">Mese</th>
                <th className="text-center pb-3 font-semibold">Totale</th>
                <th className="text-center pb-3 font-semibold">Completati</th>
                <th className="text-center pb-3 font-semibold">Cancell.</th>
                <th className="text-center pb-3 font-semibold">No-show</th>
                <th className="text-right pb-3 font-semibold">Ricavo</th>
                <th className="text-right pb-3 font-semibold">Nuovi clienti</th>
              </tr>
            </thead>
            <tbody>
              {monthlyStats.map((m) => {
                const isCurrent = m.month === currentMonth;
                const rowClass = isCurrent ? 'bg-[var(--primary-50)]' : '';
                return (
                  <tr key={m.month} className={`border-b border-[var(--border-light)] ${rowClass}`}>
                    <td className={`py-2.5 pr-2 font-semibold ${isCurrent ? 'text-primary-500' : 'text-text-dark'}`}>
                      {MONTHS_FULL[m.month]}
                    </td>
                    <td className="py-2.5 text-center text-text-dark">{m.total}</td>
                    <td className="py-2.5 text-center text-success">{m.completed}</td>
                    <td className="py-2.5 text-center text-warning">{m.cancelled}</td>
                    <td className="py-2.5 text-center text-danger">{m.noShow}</td>
                    <td className="py-2.5 text-right font-bold text-gold">{formatCurrency(m.revenue)}</td>
                    <td className="py-2.5 text-right text-text-dark">{m.newClients}</td>
                  </tr>
                );
              })}
              {/* Total row */}
              <tr className="bg-[var(--bg-elevated)]">
                <td className="py-3 pr-2 font-bold text-text-dark">Totale</td>
                <td className="py-3 text-center font-bold text-text-dark">
                  {monthlyStats.reduce((s, m) => s + m.total, 0)}
                </td>
                <td className="py-3 text-center font-bold text-success">
                  {monthlyStats.reduce((s, m) => s + m.completed, 0)}
                </td>
                <td className="py-3 text-center font-bold text-warning">
                  {monthlyStats.reduce((s, m) => s + m.cancelled, 0)}
                </td>
                <td className="py-3 text-center font-bold text-danger">
                  {monthlyStats.reduce((s, m) => s + m.noShow, 0)}
                </td>
                <td className="py-3 text-right font-bold text-gold">
                  {formatCurrency(monthlyStats.reduce((s, m) => s + m.revenue, 0))}
                </td>
                <td className="py-3 text-right font-bold text-text-dark">
                  {monthlyStats.reduce((s, m) => s + m.newClients, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

/* ─── Annual View ─── */

function AnnualView({
  yearlyStats,
  yearTotals,
  currentYear,
  yearTrend,
  yearRevenueTrend,
}: {
  yearlyStats: YearlyStats[];
  yearTotals: { total: number; completed: number; cancelled: number; noShow: number; revenue: number; newClients: number };
  currentYear: number;
  yearTrend: { delta: number; direction: string };
  yearRevenueTrend: { delta: number; direction: string };
}) {
  const monthsInYear = new Date().getMonth() + 1; // months elapsed so far
  const avgPerMonth = monthsInYear > 0 ? Math.round(yearTotals.total / monthsInYear) : 0;
  const avgRevenuePerMonth = monthsInYear > 0 ? yearTotals.revenue / monthsInYear : 0;

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <SummaryCard
          icon={<Calendar className="w-4 h-4" />}
          label={yearTotals.total.toString()}
          sublabel="Appuntamenti"
          trend={yearTrend}
          color="primary"
        />
        <SummaryCard
          icon={<CheckCircle2 className="w-4 h-4" />}
          label={yearTotals.completed.toString()}
          sublabel="Completati"
          color="success"
        />
        <SummaryCard
          icon={<DollarSign className="w-4 h-4" />}
          label={formatCurrency(yearTotals.revenue)}
          sublabel="Ricavi"
          trend={yearRevenueTrend}
          color="gold"
        />
        <SummaryCard
          icon={<Users className="w-4 h-4" />}
          label={yearTotals.newClients.toString()}
          sublabel="Nuovi clienti"
          color="secondary"
        />
      </div>

      {/* Averages card */}
      <Card className="p-5">
        <h3 className="font-bold text-text-dark mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4 text-primary-500" />
          Medie {currentYear}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-[var(--bg-elevated)] rounded-xl">
            <p className="text-2xl font-bold text-primary-500">{avgPerMonth}</p>
            <p className="text-xs text-text-muted mt-1">Media app./mese</p>
          </div>
          <div className="text-center p-4 bg-[var(--bg-elevated)] rounded-xl">
            <p className="text-2xl font-bold text-gold">{formatCurrency(avgRevenuePerMonth)}</p>
            <p className="text-xs text-text-muted mt-1">Media ricavi/mese</p>
          </div>
        </div>
      </Card>

      {/* Year-over-year table */}
      <Card className="p-5">
        <h3 className="font-bold text-text-dark mb-4">Confronto annuale</h3>
        {yearlyStats.length === 0 ? (
          <p className="text-text-muted text-sm">Nessun dato disponibile</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-text-muted text-xs uppercase tracking-wider border-b border-[var(--border-light)]">
                  <th className="text-left pb-3 font-semibold">Anno</th>
                  <th className="text-center pb-3 font-semibold">Totale</th>
                  <th className="text-center pb-3 font-semibold">Completati</th>
                  <th className="text-center pb-3 font-semibold">Cancell.</th>
                  <th className="text-center pb-3 font-semibold">No-show</th>
                  <th className="text-right pb-3 font-semibold">Ricavo</th>
                  <th className="text-right pb-3 font-semibold">Nuovi clienti</th>
                </tr>
              </thead>
              <tbody>
                {yearlyStats.map((y) => {
                  const isCurrent = y.year === currentYear;
                  const rowClass = isCurrent ? 'bg-[var(--primary-50)]' : '';
                  return (
                    <tr key={y.year} className={`border-b border-[var(--border-light)] ${rowClass}`}>
                      <td className={`py-2.5 pr-2 font-bold ${isCurrent ? 'text-primary-500' : 'text-text-dark'}`}>
                        {y.year}
                      </td>
                      <td className="py-2.5 text-center text-text-dark">{y.total}</td>
                      <td className="py-2.5 text-center text-success">{y.completed}</td>
                      <td className="py-2.5 text-center text-warning">{y.cancelled}</td>
                      <td className="py-2.5 text-center text-danger">{y.noShow}</td>
                      <td className="py-2.5 text-right font-bold text-gold">{formatCurrency(y.revenue)}</td>
                      <td className="py-2.5 text-right text-text-dark">{y.newClients}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

/* ─── Shared Components ─── */

function SummaryCard({
  icon,
  label,
  sublabel,
  trend,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  trend?: { delta: number; direction: string };
  color: 'primary' | 'success' | 'gold' | 'secondary';
}) {
  const accentMap: Record<string, string> = {
    primary: 'text-primary-500',
    success: 'text-success',
    gold: 'text-gold',
    secondary: 'text-primary-400',
  };
  const bgMap: Record<string, string> = {
    primary: 'bg-[var(--primary-50)]',
    success: 'bg-[rgba(52,211,153,0.1)]',
    gold: 'bg-[rgba(245,158,11,0.1)]',
    secondary: 'bg-[var(--primary-50)]',
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className={`w-8 h-8 rounded-lg ${bgMap[color]} flex items-center justify-center ${accentMap[color]}`}>
          {icon}
        </div>
        {trend && trend.delta > 0 && (
          <div className={`flex items-center gap-0.5 text-xs font-bold ${
            trend.direction === 'up' ? 'text-success' : 'text-danger'
          }`}>
            {trend.direction === 'up' ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            {trend.delta}%
          </div>
        )}
      </div>
      <p className="text-xl font-bold text-text-dark">{label}</p>
      <p className="text-xs text-text-muted mt-0.5">{sublabel}</p>
    </Card>
  );
}

function KPILoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-[var(--bg-elevated)] rounded-2xl" />
        ))}
      </div>
      <div className="h-48 bg-[var(--bg-elevated)] rounded-2xl" />
      <div className="h-48 bg-[var(--bg-elevated)] rounded-2xl" />
    </div>
  );
}