import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ArrowRight, Scissors, Clock, Phone } from 'lucide-react';
import type { DaySchedule } from '../types';

const DAYS_ITALIAN: (keyof DaySchedule)[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'
];

const DAY_LABELS: Record<string, string> = {
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

const defaultWorkingHours = {
  monday: { start: '09:00', end: '19:00', isActive: true },
  tuesday: { start: '09:00', end: '19:00', isActive: true },
  wednesday: { start: '09:00', end: '19:00', isActive: true },
  thursday: { start: '09:00', end: '19:00', isActive: true },
  friday: { start: '09:00', end: '19:00', isActive: true },
  saturday: { start: '09:00', end: '17:00', isActive: true },
  sunday: { start: '00:00', end: '00:00', isActive: false },
};

export function Onboarding() {
  const { user, firebaseUser } = useAuth();
  const [step, setStep] = useState(0);
  const [salonName, setSalonName] = useState('');
  const [phone, setPhone] = useState('');
  const [workingHours, setWorkingHours] = useState(defaultWorkingHours);
  const [loading, setLoading] = useState(false);

  const uid = firebaseUser?.uid;

  const handleFinish = async () => {
    if (!uid) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', uid), {
        salonName: salonName || user?.salonName,
        phone: phone || user?.phone || '',
        settings: { workingHours, breakDuration: 15, reminderEnabled: false, reminderHoursBefore: 24, whatsappNumber: '' },
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (day: keyof DaySchedule) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], isActive: !prev[day].isActive },
    }));
  };

  const updateTime = (day: keyof DaySchedule, field: 'start' | 'end', value: string) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  if (user?.salonName && user?.settings?.workingHours && !step) {
    // Already has data, skip onboarding
    return null;
  }

  return (
    <div className="min-h-screen bg-bg-soft flex flex-col">
      {/* Progress bar */}
      <div className="px-6 pt-8">
        <div className="flex gap-1.5 mb-8">
          {[0, 1].map((s) => (
            <div
              key={s}
              className={`flex-1 h-1.5 rounded-full transition-all ${
                s <= step ? 'gradient-primary' : 'bg-[var(--border-light)]'
              }`}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 px-6">
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <Scissors className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-2">Benvenuto! 🎉</h2>
            <p className="text-text-muted mb-8">Pochi passi e sarai pronto a gestire il tuo salone.</p>

            <div className="space-y-4">
              <Input
                label="Nome del tuo salone"
                placeholder="Es. Beauty Studio di Maria"
                value={salonName}
                onChange={(e) => setSalonName(e.target.value)}
                icon={<Scissors className="w-4 h-4" />}
              />
              <Input
                label="Il tuo numero di telefono"
                placeholder="+39 333 123 4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                icon={<Phone className="w-4 h-4" />}
                type="tel"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-in">
            <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mb-6">
              <Clock className="w-8 h-8 text-primary-500" />
            </div>
            <h2 className="text-2xl font-bold text-text-dark mb-2">Orari di lavoro</h2>
            <p className="text-text-muted mb-6">Imposta quando sei aperto.</p>

            <div className="space-y-3">
              {DAYS_ITALIAN.map((day) => (
                <div key={day} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleDay(day)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-medium text-sm transition-all ${
                      workingHours[day].isActive
                        ? 'gradient-primary text-white'
                        : 'bg-[var(--border-light)] text-text-dim'
                    }`}
                  >
                    {DAY_LABELS[day].slice(0, 3)}
                  </button>
                  {workingHours[day].isActive ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="time"
                        value={workingHours[day].start}
                        onChange={(e) => updateTime(day, 'start', e.target.value)}
                        className="input-field w-28 text-center text-sm"
                      />
                      <span className="text-text-muted">—</span>
                      <input
                        type="time"
                        value={workingHours[day].end}
                        onChange={(e) => updateTime(day, 'end', e.target.value)}
                        className="input-field w-28 text-center text-sm"
                      />
                    </div>
                  ) : (
                    <span className="text-text-muted text-sm">Chiuso</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom buttons */}
      <div className="px-6 pb-8 space-y-3">
        {step < 1 && (
          <Button fullWidth onClick={() => setStep(step + 1)}>
            Continua <ArrowRight className="w-4 h-4 ml-1 inline" />
          </Button>
        )}
        {step === 1 && (
          <Button fullWidth onClick={handleFinish} disabled={loading}>
            {loading ? 'Salvataggio...' : 'Inizia a usare Beauty CRM 🚀'}
          </Button>
        )}
        {step > 0 && (
          <Button variant="ghost" fullWidth onClick={() => setStep(step - 1)}>
            Indietro
          </Button>
        )}
      </div>
    </div>
  );
}