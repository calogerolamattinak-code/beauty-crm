export type ThemeName = 'rose' | 'purple' | 'green';

export interface Theme {
  name: ThemeName;
  label: string;
  emoji: string;
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
    textDark: string;
    textMuted: string;
    success: string;
    warning: string;
    danger: string;
    border: string;
  };
}

export const THEME_ROSE: Theme = {
  name: 'rose',
  label: 'Rosa',
  emoji: '💕',
  colors: {
    primary50: '#3D1A2B',
    primary100: '#5A2038',
    primary200: '#8A2D52',
    primary300: '#B84070',
    primary400: '#D45080',
    primary500: '#E8537E',
    primary600: '#FF6B9D',
    primary700: '#FF8BB5',
    primary800: '#FFB8D0',
    primary900: '#FFE0EA',
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44A8C 100%)',
    gold: '#D4A853',
    goldDark: '#C49A3C',
    bgWarm: '#0a0510',
    bgSoft: '#0a0a1a',
    textDark: '#F1F1F6',
    textMuted: '#8A8A9E',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: 'rgba(255,255,255,0.06)',
  },
};

export const THEME_PURPLE: Theme = {
  name: 'purple',
  label: 'Viola',
  emoji: '💜',
  colors: {
    primary50: '#1E0A2E',
    primary100: '#2D1050',
    primary200: '#4D1A80',
    primary300: '#6B28A0',
    primary400: '#8B3FC0',
    primary500: '#9C27B0',
    primary600: '#AB47BC',
    primary700: '#BA68C8',
    primary800: '#CE93D8',
    primary900: '#E1BEE7',
    gradient: 'linear-gradient(135deg, #AB47BC 0%, #6A1B9A 100%)',
    gold: '#CE93D8',
    goldDark: '#BA68C8',
    bgWarm: '#050010',
    bgSoft: '#0a0a1a',
    textDark: '#F1F1F6',
    textMuted: '#8A8A9E',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: 'rgba(255,255,255,0.06)',
  },
};

export const THEME_GREEN: Theme = {
  name: 'green',
  label: 'Scuro',
  emoji: '🌙',
  colors: {
    primary50: '#2D1B3D',
    primary100: '#3D2055',
    primary200: '#6B2F8A',
    primary300: '#9C4DB8',
    primary400: '#B86CE0',
    primary500: '#D48AF0',
    primary600: '#EC4899',
    primary700: '#A855F7',
    primary800: '#7C3AED',
    primary900: '#5B21B6',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)',
    gold: '#F59E0B',
    goldDark: '#D97706',
    bgWarm: '#050510',
    bgSoft: '#0a0a1a',
    textDark: '#F1F1F6',
    textMuted: '#8A8A9E',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: 'rgba(255,255,255,0.06)',
  },
};

export const ALL_THEMES: Theme[] = [THEME_ROSE, THEME_PURPLE, THEME_GREEN];

export function getTheme(name: ThemeName): Theme {
  switch (name) {
    case 'rose': return THEME_ROSE;
    case 'purple': return THEME_PURPLE;
    case 'green': return THEME_GREEN;
  }
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
    '--text-dark': c.textDark,
    '--text-muted': c.textMuted,
    '--success': c.success,
    '--warning': c.warning,
    '--danger': c.danger,
    '--border': c.border,
  };
}