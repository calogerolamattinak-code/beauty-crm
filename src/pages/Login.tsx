import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Mail, Lock, User, Scissors } from 'lucide-react';

export function Login() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [searchParams] = useSearchParams();
  const [isRegister, setIsRegister] = useState(searchParams.get('register') === 'true');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [salonName, setSalonName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isRegister) {
        await signUp(email, password, name, salonName);
      } else {
        await signIn(email, password);
      }
    } catch (err: any) {
      setError(
        err.code === 'auth/invalid-credential'
          ? 'Email o password non corrette'
          : err.code === 'auth/email-already-in-use'
          ? 'Questa email è già registrata'
          : err.code === 'auth/weak-password'
          ? 'La password deve essere almeno 6 caratteri'
          : 'Si è verificato un errore. Riprova.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero gradient section */}
      <div className="gradient-primary px-6 pt-16 pb-20 rounded-b-[2rem]">
        <div className="flex items-center gap-3 mb-4">
          <img src="/logo.jpg" alt="Beauty CRM" className="w-12 h-12 rounded-2xl object-cover shadow-lg" />
          <span className="text-white font-bold text-xl">Beauty CRM</span>
        </div>
        <h1 className="text-white text-3xl font-bold mb-2">
          {isRegister ? 'Crea il tuo account' : 'Bentornato!'}
        </h1>
        <p className="text-white/80 text-base">
          {isRegister
            ? 'Inizia a gestire il tuo salone in modo semplice'
            : 'Accedi al tuo salone digitale'}
        </p>
      </div>

      {/* Form section */}
      <div className="flex-1 px-6 -mt-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
          {error && (
            <div className="bg-danger/10 text-danger text-sm p-3 rounded-xl">
              {error}
            </div>
          )}

          {isRegister && (
            <>
              <Input
                label="Il tuo nome"
                placeholder="Mario Rossi"
                value={name}
                onChange={(e) => setName(e.target.value)}
                icon={<User className="w-4 h-4" />}
                required
              />
              <Input
                label="Nome del salone"
                placeholder="Salone Beauty"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                icon={<Scissors className="w-4 h-4" />}
                required
              />
            </>
          )}

          <Input
            label="Email"
            type="email"
            placeholder="tua@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
            required
          />

          <Input
            label="Password"
            type="password"
            placeholder="Almeno 6 caratteri"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock className="w-4 h-4" />}
            required
            minLength={6}
          />

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Attendi...' : isRegister ? 'Registrati' : 'Accedi'}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E0D0D0]" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-3 text-text-muted">oppure</span>
            </div>
          </div>

          <Button
            type="button"
            variant="secondary"
            fullWidth
            onClick={signInWithGoogle}
          >
            <svg className="w-5 h-5 mr-2 inline" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continua con Google
          </Button>

          <p className="text-center text-sm text-text-muted">
            {isRegister ? 'Hai già un account?' : 'Non hai un account?'}{' '}
            <button
              type="button"
              className="text-primary-500 font-semibold hover:underline"
              onClick={() => {
                setIsRegister(!isRegister);
                setError('');
              }}
            >
              {isRegister ? 'Accedi' : 'Registrati'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}