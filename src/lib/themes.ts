export type ThemeName = 'dark' | 'light' | 'rose' | 'purple';

export interface Theme {
  name: ThemeName;
  label: string;
  emoji: string;
  mode: 'dark' | 'light';
  colors: {
    primary50: string;
    primary100: string;
    primary200: string;
    primary300: string;
    primary400: string;
    primary500: string;
    primary600: string;
    primary700: string;
    primary800: string;
    primary900: string;
    gradient: string;
    gold: string;
    goldDark: string;
    bgWarm: string;
    bgSoft: string;
    bgCard: string;
    bgElevated: string;
    bgHover: string;
    textDark: string;
    textMuted: string;
    textDim: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
    borderLight: string;
    borderStrong: string;
  };
}

export const THEME_DARK: Theme = {
  name: 'dark',
  label: 'Dark Luxury',
  emoji: '🌙',
  mode: 'dark',
  colors: {
    primary50: '#1A121F',
    primary100: '#2A1833',
    primary200: '#431E51',
    primary300: '#6D2B82',
    primary400: '#A23EB8',
    primary500: '#D946EF',
    primary600: '#EC4899',
    primary700: '#DB2777',
    primary800: '#BE185D',
    primary900: '#9D174D',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
    gold: '#F59E0B',
    goldDark: '#D97706',
    bgWarm: '#09090E',
    bgSoft: '#0D0D14',
    bgCard: '#14141E',
    bgElevated: '#1B1B28',
    bgHover: '#232334',
    textDark: '#F8FAFC',
    textMuted: '#94A3B8',
    textDim: '#64748B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: 'rgba(255, 255, 255, 0.06)',
    borderLight: 'rgba(255, 255, 255, 0.09)',
    borderStrong: 'rgba(255, 255, 255, 0.16)',
  },
};

export const THEME_LIGHT: Theme = {
  name: 'light',
  label: 'Luxe Light',
  emoji: '☀️',
  mode: 'light',
  colors: {
    primary50: '#FDF2F8',
    primary100: '#FCE7F3',
    primary200: '#FBCFE8',
    primary300: '#F9A8D4',
    primary400: '#F472B6',
    primary500: '#DB2777',
    primary600: '#E11D48',
    primary700: '#BE123C',
    primary800: '#9F1239',
    primary900: '#881337',
    gradient: 'linear-gradient(135deg, #DB2777 0%, #9333EA 100%)',
    gold: '#D97706',
    goldDark: '#B45309',
    bgWarm: '#F8FAFC',
    bgSoft: '#F1F5F9',
    bgCard: '#FFFFFF',
    bgElevated: '#FFFFFF',
    bgHover: '#F8FAFC',
    textDark: '#0F172A',
    textMuted: '#475569',
    textDim: '#94A3B8',
    success: '#059669',
    warning: '#D97706',
    danger: '#DC2626',
    border: 'rgba(15, 23, 42, 0.06)',
    borderLight: 'rgba(15, 23, 42, 0.09)',
    borderStrong: 'rgba(15, 23, 42, 0.16)',
  },
};

export const THEME_ROSE: Theme = {
  name: 'rose',
  label: 'Velvet Rose',
  emoji: '🌸',
  mode: 'dark',
  colors: {
    primary50: '#2A0E1A',
    primary100: '#431227',
    primary200: '#681B3C',
    primary300: '#972455',
    primary400: '#C73270',
    primary500: '#F43F5E',
    primary600: '#FB7185',
    primary700: '#FDA4AF',
    primary800: '#FECDD3',
    primary900: '#FFF1F2',
    gradient: 'linear-gradient(135deg, #F43F5E 0%, #BE123C 100%)',
    gold: '#F59E0B',
    goldDark: '#D97706',
    bgWarm: '#0A0609',
    bgSoft: '#100A0E',
    bgCard: '#181015',
    bgElevated: '#22161E',
    bgHover: '#2E1E29',
    textDark: '#FFF1F2',
    textMuted: '#FDA4AF',
    textDim: '#9F1239',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    border: 'rgba(244, 63, 94, 0.12)',
    borderLight: 'rgba(244, 63, 94, 0.18)',
    borderStrong: 'rgba(244, 63, 94, 0.28)',
  },
};

export const ALL_THEMES: Theme[] = [THEME_DARK, THEME_LIGHT, THEME_ROSE];

export function getTheme(name?: ThemeName): Theme {
  const found = ALL_THEMES.find((t) => t.name === name);
  return found || THEME_DARK;
}

export function themeToCSSVars(theme: Theme): Record<string, string> {
  const c = theme.colors;
  return {
    '--primary-50': c.primary50,
    '--primary-100': c.primary100,
    '--primary-200': c.primary200,
    '--primary-300': c.primary300,
    '--primary-400': c.primary400,
    '--primary-500': c.primary500,
    '--primary-600': c.primary600,
    '--primary-700': c.primary700,
    '--primary-800': c.primary800,
    '--primary-900': c.primary900,
    '--gradient-primary': c.gradient,
    '--gold': c.gold,
    '--gold-dark': c.goldDark,
    '--bg-warm': c.bgWarm,
    '--bg-soft': c.bgSoft,
    '--bg-card': c.bgCard,
    '--bg-elevated': c.bgElevated,
    '--bg-hover': c.bgHover,
    '--text-dark': c.textDark,
    '--text-muted': c.textMuted,
    '--text-dim': c.textDim,
    '--success': c.success,
    '--warning': c.warning,
    '--danger': c.danger,
    '--border': c.border,
    '--border-light': c.borderLight,
    '--border-strong': c.borderStrong,
  };
}
