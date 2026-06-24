import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CalendarDays, LayoutDashboard, Users, Scissors, Settings } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const navItems = [
  { path: '/dashboard', label: 'Oggi', icon: LayoutDashboard },
  { path: '/calendar', label: 'Calendario', icon: CalendarDays },
  { path: '/clients', label: 'Clienti', icon: Users },
  { path: '/services', label: 'Servizi', icon: Scissors },
  { path: '/settings', label: 'Impostazioni', icon: Settings },
];

export function AppLayout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-bg-soft pb-20 md:pb-0 md:pl-20">
      {/* Desktop sidebar */}
      <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 bg-white border-r border-[#F0E8E8] flex-col items-center py-6 gap-2 z-40">
        <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center mb-4">
          <Scissors className="w-5 h-5 text-white" />
        </div>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? 'gradient-primary text-white shadow-md'
                  : 'text-text-muted hover:bg-primary-50 hover:text-primary-600'
              }`}
              title={item.label}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        {children}
      </main>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#F0E8E8] z-40 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-primary-500'
                    : 'text-text-muted'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'drop-shadow-sm' : ''}`} />
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}