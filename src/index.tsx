import React, { useState, useCallback, lazy, Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { Sparkles, RefreshCw, X, Moon, Sun, Volume2, VolumeX } from 'lucide-react';
import Contador from './contador';
import MillhouseCountdown from './contador-Milhouse';
import WelcomeScreen from './components/WelcomeScreen';
import ControlButton from './components/ControlButton';
import ErrorBoundary from './components/ErrorBoundary';
import ToastContainer from './components/ToastContainer';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { SoundProvider, useSound } from './contexts/SoundContext';
import { useEvents } from './hooks/useEvents';
import { useToast } from './hooks/useToast';
import { SavedEvent } from './types/events';

import './index.css';

// Lazy load EventManager para mejorar el tiempo de carga inicial
const EventManager = lazy(() => import('./components/EventManager'));

const App = () => {
  const { theme, toggleTheme } = useTheme();
  const { soundEnabled, toggleSound } = useSound();
  const { toasts, showToast, closeToast } = useToast();
  // Estado para alternar entre los estilos de componentes
  const [showContador, setShowContador] = useState(true);
  // Gestión de eventos
  const { events, addEvent, updateEvent, deleteEvent, exportEvents, importEvents, moveEventUp, moveEventDown } = useEvents();
  const [showEventManager, setShowEventManager] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<SavedEvent | null>(null);

  // Función para alternar los componentes (estilo)
  const toggleComponent = useCallback(() => {
    setShowContador(prevState => !prevState);
  }, []);

  // Función para seleccionar un evento
  const handleSelectEvent = useCallback((event: SavedEvent) => {
    setSelectedEvent(event);
    setShowEventManager(false);
  }, []);

  // Función para limpiar el evento seleccionado
  const clearSelectedEvent = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  // Función para abrir el gestor de eventos
  const openEventManager = useCallback(() => {
    setShowEventManager(true);
  }, []);

  // Función para cerrar el gestor de eventos
  const closeEventManager = useCallback(() => {
    setShowEventManager(false);
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-gray-900 transition-colors duration-200">
      {!selectedEvent ? (
        <WelcomeScreen onOpenEventManager={openEventManager} />
      ) : showContador ? (
        <Contador event={selectedEvent} />
      ) : (
        <MillhouseCountdown event={selectedEvent} />
      )}
      
      {/* Contenedor de notificaciones Toast */}
      <ToastContainer toasts={toasts} onClose={closeToast} />
      
      {/* Gestor de eventos */}
      {showEventManager && (
        <Suspense fallback={
          <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
                <p className="text-gray-700 dark:text-gray-200">Cargando...</p>
              </div>
            </div>
          </div>
        }>
          <EventManager
            events={events}
            onAddEvent={addEvent}
            onUpdateEvent={updateEvent}
            onDeleteEvent={deleteEvent}
            onSelectEvent={handleSelectEvent}
            onClose={closeEventManager}
            onExport={exportEvents}
            onImport={importEvents}
            onMoveUp={moveEventUp}
            onMoveDown={moveEventDown}
            showToast={showToast}
          />
        </Suspense>
      )}
      
      {/* Botón para cambiar tema */}
      <div className="absolute top-4 right-4 sm:right-10">
        <ControlButton
          icon={theme === 'light' ? Moon : Sun}
          onClick={toggleTheme}
          ariaLabel="Cambiar tema"
          title={theme === 'light' ? 'Modo oscuro' : 'Modo claro'}
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-gray-700 dark:text-yellow-400"
          hoverBgColor="hover:bg-gray-100 dark:hover:bg-gray-700"
        />
      </div>
      
      {/* Botón para silenciar/activar sonidos */}
      <div className="absolute top-16 sm:top-4 right-4 sm:right-24">
        <ControlButton
          icon={soundEnabled ? Volume2 : VolumeX}
          onClick={toggleSound}
          ariaLabel={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          bgColor="bg-white dark:bg-gray-800"
          textColor={soundEnabled ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
          hoverBgColor="hover:bg-blue-100 dark:hover:bg-gray-700"
        />
      </div>
      
      {/* Botón para gestionar eventos - siempre visible */}
      <div className="absolute top-4 left-4 sm:left-10">
        <ControlButton
          icon={Sparkles}
          onClick={openEventManager}
          ariaLabel="Gestionar eventos"
          title="Eventos guardados"
          bgColor="bg-white dark:bg-gray-800"
          textColor="text-purple-600 dark:text-purple-400"
          hoverBgColor="hover:bg-purple-100 dark:hover:bg-gray-700"
        />
      </div>
      
      {/* Botones solo visibles cuando hay un evento seleccionado */}
      {selectedEvent && (
        <>
          {/* Botón para cambiar estilo de contador */}
          <div className="absolute top-28 sm:top-4 right-4 sm:right-40">
            <ControlButton
              icon={RefreshCw}
              onClick={toggleComponent}
              ariaLabel="Cambiar entre estilos de contador"
              title="Cambiar estilo"
              bgColor="bg-white dark:bg-gray-800"
              textColor="text-purple-600 dark:text-purple-400"
              hoverBgColor="hover:bg-purple-100 dark:hover:bg-gray-700"
            />
          </div>

          {/* Botón para limpiar evento */}
          <div className="absolute top-4 left-16 sm:left-24">
            <ControlButton
              icon={X}
              onClick={clearSelectedEvent}
              ariaLabel="Limpiar evento"
              title="Limpiar evento"
              bgColor="bg-white dark:bg-gray-800"
              textColor="text-red-600 dark:text-red-400"
              hoverBgColor="hover:bg-red-100 dark:hover:bg-gray-700"
            />
          </div>
        </>
      )}
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <ThemeProvider>
        <SoundProvider>
          <App />
        </SoundProvider>
      </ThemeProvider>
    </ErrorBoundary>
  </React.StrictMode>
);