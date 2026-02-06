import { useState, useEffect, useCallback, useRef } from 'react';
import { SavedEvent, EventFormData, EventType } from '../types/events';
import { STORAGE_KEY } from '../utils/constants';
import { debounce } from '../utils/debounce';

export const useEvents = () => {
  const [events, setEvents] = useState<SavedEvent[]>([]);
  const isInitialMount = useRef(true);

  // Cargar eventos del localStorage al iniciar
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setEvents(parsed);
      } catch (error) {
        console.error('Error loading events:', error);
        // Si hay error, limpiar localStorage corrupto
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  // Debounced save to localStorage
  const saveToLocalStorage = useCallback(
    debounce((eventsToSave: SavedEvent[]) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(eventsToSave));
      } catch (error) {
        console.error('Error saving events:', error);
      }
    }, 500),
    []
  );

  // Guardar eventos en localStorage cuando cambien (con debounce)
  useEffect(() => {
    // No guardar en el primer mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    saveToLocalStorage(events);
  }, [events, saveToLocalStorage]);

  const addEvent = useCallback((formData: EventFormData): SavedEvent => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const createdAt = new Date().toISOString();
    
    let newEvent: SavedEvent;

    if (formData.type === EventType.DATE) {
      newEvent = {
        id,
        name: formData.name,
        type: EventType.DATE,
        targetDate: {
          month: formData.month,
          day: formData.day,
        },
        createdAt,
      };
    } else if (formData.type === EventType.TIME) {
      newEvent = {
        id,
        name: formData.name,
        type: EventType.TIME,
        targetHour: formData.hour,
        createdAt,
      };
    } else {
      newEvent = {
        id,
        name: formData.name,
        type: EventType.DAY_OF_MONTH,
        targetDay: formData.dayOfMonth,
        createdAt,
      };
    }

    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  }, []);

  const updateEvent = useCallback((id: string, formData: EventFormData) => {
    setEvents(prev => prev.map(event => {
      if (event.id !== id) return event;

      let updated: SavedEvent;

      if (formData.type === EventType.DATE) {
        updated = {
          id: event.id,
          name: formData.name,
          type: EventType.DATE,
          targetDate: {
            month: formData.month,
            day: formData.day,
          },
          createdAt: event.createdAt,
        };
      } else if (formData.type === EventType.TIME) {
        updated = {
          id: event.id,
          name: formData.name,
          type: EventType.TIME,
          targetHour: formData.hour,
          createdAt: event.createdAt,
        };
      } else {
        updated = {
          id: event.id,
          name: formData.name,
          type: EventType.DAY_OF_MONTH,
          targetDay: formData.dayOfMonth,
          createdAt: event.createdAt,
        };
      }

      return updated;
    }));
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
  }, []);

  const getEvent = useCallback((id: string): SavedEvent | undefined => {
    return events.find(event => event.id === id);
  }, [events]);

  const exportEvents = useCallback(() => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `eventos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [events]);

  const importEvents = useCallback((file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string) as SavedEvent[];
          
          // Validar que sea un array
          if (!Array.isArray(imported)) {
            throw new Error('El archivo no contiene un array de eventos válido');
          }
          
          // Validar estructura de cada evento
          const isValidEvent = (event: unknown): event is SavedEvent => {
            if (!event || typeof event !== 'object') return false;
            const e = event as Record<string, unknown>;
            
            // Validar campos comunes
            if (typeof e.id !== 'string' || typeof e.name !== 'string' || typeof e.type !== 'string') {
              return false;
            }
            
            // Validar según tipo
            if (e.type === EventType.DATE) {
              return typeof e.targetDate === 'object' && e.targetDate !== null &&
                     typeof (e.targetDate as {month?: unknown}).month === 'number' &&
                     typeof (e.targetDate as {day?: unknown}).day === 'number';
            } else if (e.type === EventType.TIME) {
              return typeof e.targetHour === 'number';
            } else if (e.type === EventType.DAY_OF_MONTH) {
              return typeof e.targetDay === 'number';
            }
            
            return false;
          };
          
          // Validar todos los eventos
          const invalidEvents = imported.filter(e => !isValidEvent(e));
          if (invalidEvents.length > 0) {
            throw new Error(`Se encontraron ${invalidEvents.length} evento(s) con formato inválido`);
          }
          
          setEvents(imported);
          resolve();
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
      reader.readAsText(file);
    });
  }, []);

  const reorderEvents = useCallback((startIndex: number, endIndex: number) => {
    const result = Array.from(events);
    const [removed] = result.splice(startIndex, 1);
    if (removed) {
      result.splice(endIndex, 0, removed);
      setEvents(result);
    }
  }, [events]);

  const moveEventUp = useCallback((id: string) => {
    const index = events.findIndex(e => e.id === id);
    if (index > 0) {
      reorderEvents(index, index - 1);
    }
  }, [events, reorderEvents]);

  const moveEventDown = useCallback((id: string) => {
    const index = events.findIndex(e => e.id === id);
    if (index < events.length - 1) {
      reorderEvents(index, index + 1);
    }
  }, [events, reorderEvents]);

  return {
    events,
    addEvent,
    updateEvent,
    deleteEvent,
    getEvent,
    exportEvents,
    importEvents,
    moveEventUp,
    moveEventDown,
  };
};
