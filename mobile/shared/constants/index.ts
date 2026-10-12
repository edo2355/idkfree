export const LIMITS = {
  ALIAS_MIN: 3,
  ALIAS_MAX: 30,
  PASSWORD_MIN: 12,
  PASSWORD_MAX: 128,
  POST_BODY_MAX: 5000,
  MESSAGE_BODY_MAX: 5000,
  SIGNAL_MESSAGE_MAX: 100,
  SIGNAL_DAILY_MAX: 10,
  CIRCLE_MAX: 5,
  PIN_LENGTH: 4,
} as const;

export const COLORS = {
  light: {
    bg: '#FAF7F2', surface: '#FFFFFF', text: '#1A1A1A',
    textMuted: '#666666', accent: '#C75B39', accentHover: '#A84A2C',
    border: '#E5E0D8', danger: '#DC2626', success: '#16A34A',
  },
  dark: {
    bg: '#1A1614', surface: '#262220', text: '#F0EBE5',
    textMuted: '#A89E96', accent: '#E08B6B', accentHover: '#C47456',
    border: '#3A332F', danger: '#DC2626', success: '#16A34A',
  },
} as const;

export const API_DEFAULT_URL = 'http://localhost:3000/api';