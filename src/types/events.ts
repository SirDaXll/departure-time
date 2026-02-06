export enum EventType {
  DATE = 'date',
  TIME = 'time',
  DAY_OF_MONTH = 'dayOfMonth'
}

// Tipos más estrictos usando discriminated unions
interface BaseEvent {
  id: string;
  name: string;
  createdAt: string;
}

interface DateEvent extends BaseEvent {
  type: EventType.DATE;
  targetDate: {
    month: number; // 0-11
    day: number;   // 1-31
  };
}

interface TimeEvent extends BaseEvent {
  type: EventType.TIME;
  targetHour: number; // 0-23
}

interface DayOfMonthEvent extends BaseEvent {
  type: EventType.DAY_OF_MONTH;
  targetDay: number; // 1-31
}

export type SavedEvent = DateEvent | TimeEvent | DayOfMonthEvent;

// Form data con tipos más estrictos
interface BaseFormData {
  name: string;
}

interface DateFormData extends BaseFormData {
  type: EventType.DATE;
  month: number;
  day: number;
}

interface TimeFormData extends BaseFormData {
  type: EventType.TIME;
  hour: number;
}

interface DayOfMonthFormData extends BaseFormData {
  type: EventType.DAY_OF_MONTH;
  dayOfMonth: number;
}

export type EventFormData = DateFormData | TimeFormData | DayOfMonthFormData;

// Tipo helper para el estado del formulario (permite campos opcionales durante la edición)
export interface EventFormState {
  name: string;
  type: EventType;
  month?: number;
  day?: number;
  hour?: number;
  dayOfMonth?: number;
}
