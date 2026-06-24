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
    primary50: '#FFF0F5',
    primary100: '#FFE0EA',
    primary200: '#FFB8D0',
    primary300: '#FF8BB5',
    primary400: '#FF6B9D',
    primary500: '#E8537E',
    primary600: '#C44A8C',
    primary700: '#9E3A6F',
    primary800: '#7A2D57',
    primary900: '#5A2040',
    gradient: 'linear-gradient(135deg, #FF6B9D 0%, #C44A8C 100%)',
    gold: '#D4A853',
    goldDark: '#C49A3C',
    bgWarm: '#FFFAF7',
    bgSoft: '#FFF5F0',
    textDark: '#2D1B1B',
    textMuted: '#8A7B7B',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: '#F0E8E8',
  },
};

export const THEME_PURPLE: Theme = {
  name: 'purple',
  label: 'Viola',
  emoji: '💜',
  colors: {
    primary50: '#F3E5F5',
    primary100: '#E1BEE7',
    primary200: '#CE93D8',
    primary300: '#BA68C8',
    primary400: '#AB47BC',
    primary500: '#9C27B0',
    primary600: '#7B1FA2',
    primary700: '#6A1B9A',
    primary800: '#4A148C',
    primary900: '#38006B',
    gradient: 'linear-gradient(135deg, #AB47BC 0%, #6A1B9A 100%)',
    gold: '#CE93D8',
    goldDark: '#BA68C8',
    bgWarm: '#FCFAFF',
    bgSoft: '#F8F4FF',
    textDark: '#1A0D2E',
    textMuted: '#7A6B8A',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: '#E8E0F0',
  },
};

export const THEME_GREEN: Theme = {
  name: 'green',
  label: 'Verde',
  emoji: '🌿',
  colors: {
    primary50: '#E8F5E9',
    primary100: '#C8E6C9',
    primary200: '#A5D6A7',
    primary300: '#81C784',
    primary400: '#66BB6A',
    primary500: '#4CAF50',
    primary600: '#388E3C',
    primary700: '#2E7D32',
    primary800: '#1B5E20',
    primary900: '#0D3B0F',
    gradient: 'linear-gradient(135deg, #66BB6A 0%, #2E7D32 100%)',
    gold: '#A5D6A7',
    goldDark: '#81C784',
    bgWarm: '#F5FFF5',
    bgSoft: '#F0FFF0',
    textDark: '#0D2E0F',
    textMuted: '#6B8A6B',
    success: '#4CAF50',
    warning: '#FF9800',
    danger: '#EF5350',
    border: '#E0F0E0',
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