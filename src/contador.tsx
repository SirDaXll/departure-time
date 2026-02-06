import { CalendarDays, Clock } from 'lucide-react'
import React, { useMemo } from 'react'
import { useCountdown } from './hooks/useCountdown'
import { useNotifications } from './hooks/useNotifications'
import { useCelebrationSound } from './hooks/useSound'
import { SavedEvent, EventType } from './types/events'

interface ContadorProps {
  event: SavedEvent;
}

const Contador = React.memo(({ event }: ContadorProps) => {
  const { days, hours, minutes, seconds } = useCountdown({ event });
  
  const isTimeUp = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  
  // Hooks para notificaciones y sonido
  useNotifications(event, { days, hours, minutes, seconds });
  useCelebrationSound(isTimeUp);

  const title = useMemo(() => `Cuenta regresiva para ${event.name}`, [event.name]);

  const description = useMemo(() => {
    if (event.type === EventType.DATE) {
      return `para ${event.name}`;
    } else if (event.type === EventType.TIME) {
      const hour24 = event.targetHour.toString().padStart(2, '0');
      const hour12 = event.targetHour === 0 ? 12 : event.targetHour > 12 ? event.targetHour - 12 : event.targetHour;
      const ampm = event.targetHour >= 12 ? 'PM' : 'AM';
      return `para las ${hour24}:00 (${hour12}:00 ${ampm})`;
    } else {
      return `para el próximo día ${event.targetDay}`;
    }
  }, [event]);

  const showDays = useMemo(
    () => event.type === EventType.DATE || event.type === EventType.DAY_OF_MONTH,
    [event.type]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-8 rounded-lg shadow-xl text-center max-w-2xl w-full transition-colors duration-200">
        {isTimeUp ? (
          <>
            <h1 className="text-3xl sm:text-5xl font-bold text-green-600 dark:text-green-400 mb-6 animate-pulse">
              ¡Llegó el momento!
            </h1>
            <div className="flex items-center justify-center mb-6">
              <div className="text-5xl sm:text-6xl">🎉</div>
            </div>
            <p className="text-xl sm:text-2xl text-gray-700 dark:text-gray-200 font-semibold">
              {event.name}
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 mt-4">
              {description}
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">
              {title}
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center mb-6 gap-2 sm:gap-0">
              {showDays ? (
                <CalendarDays className="text-blue-500 dark:text-blue-400 sm:mr-2" size={28} />
              ) : (
                <Clock className="text-blue-500 dark:text-blue-400 sm:mr-2" size={28} />
              )}
              <div className="text-base sm:text-xl text-gray-700 dark:text-gray-200 break-words">
                {showDays && days > 0 && (
                  <>
                    <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl">{days}</span> {days === 1 ? 'día' : 'días'},{' '}
                  </>
                )}
                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl">{hours}</span> {hours === 1 ? 'hora' : 'horas'},{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl">{minutes}</span> {minutes === 1 ? 'minuto' : 'minutos'} y{' '}
                <span className="font-bold text-blue-600 dark:text-blue-400 text-2xl sm:text-3xl">{seconds}</span> {seconds === 1 ? 'segundo' : 'segundos'}
              </div>
            </div>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              {description}
            </p>
          </>
        )}
      </div>
    </div>
  )
});

Contador.displayName = 'Contador';

export default Contador;