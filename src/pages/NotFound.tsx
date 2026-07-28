import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="min-h-screen bg-[#0E0E18] text-white flex flex-col items-center justify-center px-4 text-center">
      <img src="/logo.jpg" alt="Beauty CRM" className="w-16 h-16 rounded-2xl object-cover mb-6 shadow-lg" />
      <p
        className="text-6xl sm:text-7xl font-bold mb-3"
        style={{
          background: 'linear-gradient(135deg, #EC4899, #A855F7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        404
      </p>
      <h1 className="text-2xl sm:text-3xl font-bold mb-3 tracking-tight">Pagina non trovata</h1>
      <p className="text-sm sm:text-base text-[#A0A0B8] mb-8 max-w-md leading-relaxed">
        La pagina che stai cercando non esiste o è stata spostata.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          to="/"
          className="px-7 py-3.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] min-h-[48px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #EC4899, #A855F7)', boxShadow: '0 4px 20px rgba(236,72,153,0.3)' }}
        >
          Torna alla home
        </Link>
        <Link
          to="/login"
          className="px-7 py-3.5 rounded-xl text-sm font-medium text-[#D0D0DC] border border-white/15 hover:border-white/30 hover:text-white transition-all min-h-[48px] flex items-center justify-center"
        >
          Accedi
        </Link>
      </div>
    </div>
  );
}
