import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Scissors,
  BarChart3,
  Settings,
  LogOut,
  Sun,
  Moon,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

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
  const { theme, toggleMode } = useTheme();
  const logoUrl = getLogoUrl(user || undefined);

  return (
    <div className="min-h-screen bg-[var(--bg-soft)] text-[var(--text-dark)] pb-24 md:pb-6 md:pl-24 transition-colors">
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-24 bg-[var(--bg-card)] border-r border-[var(--border-light)] flex-col items-center py-6 gap-2 z-40 shadow-xl">
        {/* Salon Logo */}
        <div className="w-12 h-12 rounded-2xl overflow-hidden mb-1 shadow-md ring-2 ring-[var(--border-strong)] transition-transform hover:scale-105">
          <img
            src={logoUrl}
            alt="Logo"
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logos/icon-01.jpg'; }}
          />
        </div>
        {user?.salonName && (
          <p className="text-[9px] font-bold text-[var(--text-muted)] text-center leading-tight max-w-[76px] truncate px-1 mb-4">
            {user.salonName}
          </p>
        )}

        {/* Nav Items */}
        <div className="w-full px-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full h-14 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-dark)]'
                }`}
                style={
                  isActive
                    ? {
                        background: 'linear-gradient(135deg, #EC4899, #A855F7)',
                        boxShadow: '0 4px 16px rgba(236,72,153,0.35)',
                      }
                    : undefined
                }
                title={item.label}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Actions: Theme Toggle & Logout */}
        <div className="mt-auto flex flex-col items-center gap-2 w-full px-3">
          <button
            onClick={toggleMode}
            className="w-full h-11 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-dark)] transition-colors"
            title={theme.mode === 'dark' ? 'Tema Chiaro' : 'Tema Scuro'}
          >
            {theme.mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full h-11 rounded-xl flex items-center justify-center text-[var(--text-muted)] hover:bg-[var(--danger)]/15 hover:text-[var(--danger)] transition-colors"
            title="Esci"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden glass border-b border-[var(--border-light)] px-4 h-15 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm flex-shrink-0 ring-1 ring-[var(--border-strong)]">
            <img
              src={logoUrl}
              alt="Logo"
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = '/logos/icon-01.jpg'; }}
            />
          </div>
          <div>
            <p className="text-sm font-bold text-[var(--text-dark)] leading-tight truncate max-w-[170px]">
              {user?.salonName || 'Beauty CRM'}
            </p>
            <span className="text-[10px] text-[var(--primary-500)] font-semibold">Salone Digitale</span>
          </div>
        </div>

        <button
          onClick={toggleMode}
          className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-dark)]"
          title="Cambia tema"
        >
          {theme.mode === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass border-t border-[var(--border-light)] z-40 safe-area-bottom shadow-2xl">
        <div className="flex items-center justify-around px-2 py-1.5">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-1.5 px-3 rounded-2xl transition-all ${
                  isActive
                    ? 'text-[var(--primary-600)] font-bold scale-105'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-dark)]'
                }`}
              >
                <div className={`p-1 rounded-xl ${isActive ? 'bg-[var(--primary-100)]' : ''}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
