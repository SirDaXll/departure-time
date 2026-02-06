export const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
] as const;

export const STORAGE_KEY = 'countdown-events';

export const THEME_STORAGE_KEY = 'theme';

export const MAX_EVENT_NAME_LENGTH = 50;

export const NOTIFICATION_TIMES = {
  WARNING: 300, // 5 minutos en segundos
  URGENT: 60,   // 1 minuto en segundos
} as const;
