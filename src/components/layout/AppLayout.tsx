import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Users, Scissors, BarChart3, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/calendar', label: 'Agenda', icon: CalendarDays },
  { path: '/clients', label: 'Clienti', icon: Users },
  { path: '/dashboard', label: 'Oggi', icon: LayoutDashboard },
  { path: '/services', label: 'Servizi', icon: Scissors },
  { path: '/statistiche', label: 'Stat.', icon: BarChart3 },
  { path: '/settings', label: 'Gestione', icon: Settings },
];

function getLogoUrl(user: { logo?: string | null; logoPreset?: string | null } | null | undefined): string {
  if (user?.logo) return user.logo;
  const preset = user?.logoPreset || 'icon-01';
  return `/logos/${preset}.jpg?v=3`;
}

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const logoUrl = getLogoUrl(user || undefined);

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] pb-20 md:pb-0 md:pl-20">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-[var(--bg-card)] border-r border-[var(--border-light)] flex-col items-center py-4 gap-1 z-40">
        <div className="w-10 h-10 rounded-xl overflow-hidden mb-2 shadow-md ring-1 ring-white/5">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logos/icon-01.jpg'; }}
          />
        </div>
        {user?.salonName && (
          <p className="text-[8px] text-[var(--text-muted)] text-center leading-tight max-w-[64px] truncate px-1 mb-2">
            {user.salonName}
          </p>
        )}

        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? 'text-white'
                  : 'text-[var(--text-muted)] hover:bg-[var(--primary-50)] hover:text-[var(--text-dark)]'
              }`}
              style={isActive ? { background: 'linear-gradient(135deg, #EC4899, #A855F7)' } : undefined}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}

        <div className="mt-auto">
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all text-[var(--text-muted)] hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
            title="Esci"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-[10px] font-medium">Esci</span>
          </button>
        </div>
      </nav>

      {/* Mobile top header — integrated in page flow, NOT fixed */}
      <header className="md:hidden glass border-b border-[var(--border-light)] px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden shadow-sm flex-shrink-0 ring-1 ring-white/5">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logos/icon-01.jpg'; }}
            />
          </div>
          <p className="text-sm font-bold text-[var(--text-dark)] leading-tight truncate max-w-[180px]">
            {user?.salonName || 'Beauty CRM'}
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile bottom tab bar — all items uniform */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[var(--border-light)] z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                  isActive ? 'text-[var(--primary-500)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}