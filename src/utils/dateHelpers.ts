/**
 * Convierte hora de formato 24h a formato 12h con AM/PM
 */
export const formatTo12Hour = (hour24: number): { hour12: number; ampm: 'AM' | 'PM' } => {
  const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
  const ampm = hour24 >= 12 ? 'PM' : 'AM';
  return { hour12, ampm };
};

/**
 * Formatea una hora completa con formato 24h y 12h AM/PM
 */
export const formatHourDisplay = (hour24: number): string => {
  const formatted24 = hour24.toString().padStart(2, '0');
  const { hour12, ampm } = formatTo12Hour(hour24);
  return `${formatted24}:00 (${hour12}:00 ${ampm})`;
};

/**
 * Valida que un día sea válido para un mes específico
 */
export const isValidDayForMonth = (day: number, month: number, year: number = new Date().getFullYear()): boolean => {
  const date = new Date(year, month, day);
  return date.getMonth() === month && date.getDate() === day;
};

/**
 * Obtiene el máximo número de días para un mes específico
 */
export const getMaxDaysInMonth = (month: number, year: number = new Date().getFullYear()): number => {
  return new Date(year, month + 1, 0).getDate();
};
