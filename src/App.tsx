import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { AppLayout } from './components/layout/AppLayout';
import { Login } from './pages/Login';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Calendar } from './pages/Calendar';
import { Clients } from './pages/Clients';
import { Services } from './pages/Services';
import { Settings } from './pages/Settings';
import { Checkout } from './pages/Checkout';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-soft)' }}>
        <div className="text-center animate-pulse">
          <img src="/logo.jpg" alt="Beauty CRM" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <p style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { firebaseUser, loading } = useAuth();
  const { user } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-soft)' }}>
        <div className="text-center animate-pulse">
          <img src="/logo.jpg" alt="Beauty CRM" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
          <p style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
        </div>
      </div>
    );
  }

  // Show checkout page outside of layout
  if (showCheckout) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen px-4 py-6" style={{ backgroundColor: 'var(--bg-soft)' }}>
          <Checkout
            onBack={() => setShowCheckout(false)}
            salonName={user?.salonName}
          />
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={
        firebaseUser ? <Navigate to="/dashboard" replace /> : <Login />
      } />

      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute>
          <AppLayout>
            <Calendar />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/clients" element={
        <ProtectedRoute>
          <AppLayout>
            <Clients />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/services" element={
        <ProtectedRoute>
          <AppLayout>
            <Services />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout>
            <Settings onGoPremium={() => setShowCheckout(true)} />
          </AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <AppRoutes />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}