import { useEffect, useRef } from 'react';
import { SavedEvent } from '../types/events';
import { NOTIFICATION_TIMES } from '../utils/constants';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export const useNotifications = (event: SavedEvent, timeRemaining: TimeRemaining) => {
  const notifiedAt5Min = useRef(false);
  const notifiedAt1Min = useRef(false);

  useEffect(() => {
    // Pedir permiso para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (Notification.permission !== 'granted') return;

    const totalMinutes = timeRemaining.days * 24 * 60 + timeRemaining.hours * 60 + timeRemaining.minutes;
    const totalSeconds = totalMinutes * 60 + timeRemaining.seconds;

    // Notificación a 5 minutos
    if (totalSeconds <= NOTIFICATION_TIMES.WARNING && totalSeconds > NOTIFICATION_TIMES.URGENT && !notifiedAt5Min.current) {
      notifiedAt5Min.current = true;
      new Notification('¡Faltan 5 minutos!', {
        body: `El evento "${event.name}" está por llegar`,
        icon: '/favicon.ico',
      });
    }

    // Notificación a 1 minuto
    if (totalSeconds <= NOTIFICATION_TIMES.URGENT && totalSeconds > 0 && !notifiedAt1Min.current) {
      notifiedAt1Min.current = true;
      new Notification('¡Falta 1 minuto!', {
        body: `El evento "${event.name}" está a punto de comenzar`,
        icon: '/favicon.ico',
      });
    }

    // Resetear cuando el tiempo se recalcule (cambio de día)
    if (totalSeconds > NOTIFICATION_TIMES.WARNING) {
      notifiedAt5Min.current = false;
      notifiedAt1Min.current = false;
    }
  }, [event.name, timeRemaining]);
};
