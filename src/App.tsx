import { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { ThemeProvider } from './hooks/useTheme';
import { useSEO } from './hooks/useSEO';
import { AppLayout } from './components/layout/AppLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Terms } from './pages/Terms';
import { Privacy } from './pages/Privacy';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

// Lazy load pages that are only for logged-in users
const Onboarding = lazy(() => import('./pages/Onboarding').then(m => ({ default: m.Onboarding })));
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })));
const Calendar = lazy(() => import('./pages/Calendar').then(m => ({ default: m.Calendar })));
const Clients = lazy(() => import('./pages/Clients').then(m => ({ default: m.Clients })));
const Services = lazy(() => import('./pages/Services').then(m => ({ default: m.Services })));
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })));
const KPI = lazy(() => import('./pages/KPI').then(m => ({ default: m.KPI })));
const Checkout = lazy(() => import('./pages/Checkout').then(m => ({ default: m.Checkout })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-soft)' }}>
      <div className="text-center animate-pulse">
        <img src="/logo.jpg" alt="Beauty CRM" className="w-16 h-16 rounded-2xl object-cover mx-auto mb-4 shadow-lg" />
        <p style={{ color: 'var(--text-muted)' }}>Caricamento...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { firebaseUser, loading } = useAuth();

  if (loading) return <PageLoader />;

  if (!firebaseUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AppRoutes() {
  const { firebaseUser, user, loading } = useAuth();
  const [showCheckout, setShowCheckout] = useState(false);
  useSEO();

  if (loading) return <PageLoader />;

  if (showCheckout) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen px-4 py-6" style={{ backgroundColor: 'var(--bg-soft)' }}>
          <Suspense fallback={<PageLoader />}>
            <Checkout onBack={() => setShowCheckout(false)} salonName={user?.salonName} />
          </Suspense>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/termini" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/chi-siamo" element={<About />} />
      <Route path="/login" element={firebaseUser ? <Navigate to="/dashboard" replace /> : <Login />} />

      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Suspense fallback={<PageLoader />}><Onboarding /></Suspense>
        </ProtectedRoute>
      } />

      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><Dashboard /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/calendar" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><Calendar /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/clients" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><Clients /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/services" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><Services /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/statistiche" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><KPI /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout><Suspense fallback={<PageLoader />}><Settings onGoPremium={() => setShowCheckout(true)} /></Suspense></AppLayout>
        </ProtectedRoute>
      } />

      <Route path="*" element={firebaseUser ? <Navigate to="/dashboard" replace /> : <NotFound />} />
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
