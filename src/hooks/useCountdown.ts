import { useState, useEffect } from 'react';
import { SavedEvent, EventType } from '../types/events';

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

type CountdownMode = 'hour' | 'dayOfMonth' | 'date';

interface CountdownConfig {
  mode?: CountdownMode;
  targetHour?: number; // Para modo 'hour'
  targetDay?: number;  // Para modo 'dayOfMonth'
  event?: SavedEvent;  // Para usar un evento guardado
}

export const useCountdown = (config: CountdownConfig): TimeRemaining => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeRemaining = () => {
      const now = new Date();
      let targetDate: Date;

      // Si hay un evento, usar su configuración
      if (config.event) {
        const event = config.event;
        
        if (event.type === EventType.DATE) {
          // Modo: contar hasta una fecha específica (ej: Navidad)
          const targetMonth = event.targetDate.month;
          const targetDay = event.targetDate.day;
          
          targetDate = new Date(
            now.getFullYear(),
            targetMonth,
            targetDay,
            0,
            0,
            0
          );
          
          // Si ya pasó este año, ir al próximo año
          if (targetDate.getTime() < now.getTime()) {
            targetDate.setFullYear(targetDate.getFullYear() + 1);
          }
        } else if (event.type === EventType.TIME) {
          // Modo: contar hasta una hora específica del día
          targetDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            event.targetHour,
            0,
            0
          );

          if (now.getHours() >= event.targetHour) {
            targetDate.setDate(targetDate.getDate() + 1);
          }
        } else {
          // EventType.DAY_OF_MONTH
          const targetDay = event.targetDay;
          const currentDay = now.getDate();
          
          if (currentDay >= targetDay) {
            targetDate = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              targetDay,
              0,
              0,
              0
            );
          } else {
            targetDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              targetDay,
              0,
              0,
              0
            );
          }
        }
      } else if (config.mode === 'hour') {
        // Modo: contar hasta una hora específica del día
        const targetHour = config.targetHour ?? 16;
        targetDate = new Date(
          now.getFullYear(),
          now.getMonth(),
          now.getDate(),
          targetHour,
          0,
          0
        );

        if (now.getHours() >= targetHour) {
          targetDate.setDate(targetDate.getDate() + 1);
        }
      } else if (config.mode === 'dayOfMonth') {
        // Modo: contar hasta un día específico del próximo mes
        const targetDay = config.targetDay ?? 15;
        const currentDay = now.getDate();
        
        // Si ya pasó el día objetivo este mes, ir al próximo mes
        if (currentDay >= targetDay) {
          targetDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            targetDay,
            0,
            0,
            0
          );
        } else {
          targetDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            targetDay,
            0,
            0,
            0
          );
        }
      } else {
        // Fallback
        targetDate = new Date();
      }

      const difference = targetDate.getTime() - now.getTime();
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    calculateTimeRemaining();
    const interval = setInterval(calculateTimeRemaining, 1000);

    return () => clearInterval(interval);
  }, [config.mode, config.targetHour, config.targetDay, config.event]);

  return timeRemaining;
};
