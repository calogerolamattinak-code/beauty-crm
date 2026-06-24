type DateLike = Date | { toDate: () => Date } | undefined | null;

function toDate(d: DateLike): Date | null {
  if (!d) return null;
  if (d instanceof Date) return d;
  if (typeof (d as any).toDate === 'function') return (d as any).toDate();
  return null;
}

export function formatDate(date: DateLike): string {
  const d = toDate(date);
  if (!d) return '';
  return d.toLocaleDateString('it-IT', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date): string {
  const d = date instanceof Date ? date : (date as any).toDate?.() || date;
  return d.toLocaleDateString('it-IT', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });
}

export function formatTime(date: Date): string {
  const d = date instanceof Date ? date : (date as any).toDate?.() || date;
  return d.toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' });
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getAvatarColor(name: string): string {
  const colors = [
    '#FF6B9D', '#C44A8C', '#D4A853', '#4CAF50',
    '#42A5F5', '#AB47BC', '#FF7043', '#26A69A',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

export function isItalianPhone(phone: string): boolean {
  return /^(\+39)?\s?3\d{2}\s?\d{6,7}$/.test(phone.replace(/\s/g, ''));
}

export function isPremium(user: any): boolean {
  return user?.isPremium === true;
}

export const FREE_CLIENT_LIMIT = 30;
