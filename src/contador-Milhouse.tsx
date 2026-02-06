import React, { useMemo, useEffect } from 'react'
import { useCountdown } from './hooks/useCountdown'
import { useNotifications } from './hooks/useNotifications'
import { useCelebrationSound } from './hooks/useSound'
import { formatTime } from './utils/timeFormat'
import { SavedEvent, EventType } from './types/events'

interface MillhouseCountdownProps {
  event: SavedEvent;
}

const MillhouseCountdown = React.memo(({ event }: MillhouseCountdownProps) => {
  const { days, hours, minutes, seconds } = useCountdown({ event });
  
  const isTimeUp = days === 0 && hours === 0 && minutes === 0 && seconds === 0;
  
  // Hooks para notificaciones y sonido
  useNotifications(event, { days, hours, minutes, seconds });
  useCelebrationSound(isTimeUp);

  // Precargar la imagen de celebración
  useEffect(() => {
    const img = new Image();
    img.src = "https://kggwetnm0aecy2yh.public.blob.vercel-storage.com/milhouse-out-3go5aO4Mlrcb2fGcXTSYRylGk0Dwax.webp";
  }, []);

  const description = useMemo(() => {
    if (event.type === EventType.DATE) {
      return `Falta para ${event.name}`;
    } else if (event.type === EventType.TIME) {
      return `Tiempo para ${event.name}`;
    } else {
      return `Falta para el día ${event.targetDay}`;
    }
  }, [event]);

  const showDays = useMemo(
    () => event.type === EventType.DATE || event.type === EventType.DAY_OF_MONTH,
    [event.type]
  );

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-4xl lg:max-w-6xl">
        <img
          key={isTimeUp ? 'out' : 'normal'}
          src={isTimeUp 
            ? "https://kggwetnm0aecy2yh.public.blob.vercel-storage.com/milhouse-out-3go5aO4Mlrcb2fGcXTSYRylGk0Dwax.webp"
            : "https://kggwetnm0aecy2yh.public.blob.vercel-storage.com/milhouse-6hPKMn1xggNt04ba5UHaBGdtXj8nkM.webp"
          }
          alt={isTimeUp ? "Milhouse celebration" : "Milhouse countdown"}
          className="w-full shadow-xl"
        />
        {!isTimeUp && (
          <>
            <div className="absolute top-[18.8%] right-[14.5%] w-[14%]">
              <div className="font-mono text-center">
                <div className="text-[#5e8f2a] text-[2.5%] md:text-[3%] lg:text-[300%]">
                  <span style={{ fontFamily: 'Digital-7, sans-serif' }}>
                    {showDays
                      ? `${formatTime(days)}:${formatTime(hours)}:${formatTime(minutes)}`
                      : `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`
                    }
                  </span>
                </div>
              </div>
            </div>
            <div className="absolute top-[27%] right-[13%] w-[17%]">
              <p className="font-mono text-[2.5%] md:text-[3%] lg:text-[200%] text-center break-words whitespace-normal overflow-hidden" style={{ fontWeight: 'bold' }}>
                {description}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
});

MillhouseCountdown.displayName = 'MillhouseCountdown';

export default MillhouseCountdown;