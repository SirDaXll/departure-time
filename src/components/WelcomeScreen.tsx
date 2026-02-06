import React from 'react';
import { Calendar, Clock, Plus } from 'lucide-react';

interface WelcomeScreenProps {
  onOpenEventManager: () => void;
}

const WelcomeScreen = React.memo<WelcomeScreenProps>(({ onOpenEventManager }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-4 transition-colors duration-200">
      <div className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-2xl shadow-2xl text-center max-w-2xl transition-colors duration-200">
        <div className="flex justify-center mb-6">
          <div className="relative">
            <Clock className="text-blue-500 dark:text-blue-400" size={80} />
            <Calendar className="text-purple-500 dark:text-purple-400 absolute -bottom-2 -right-2" size={40} />
          </div>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-4">
          Bienvenido
        </h1>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          No hay eventos seleccionados
        </p>
        
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-700 p-6 rounded-lg mb-8">
          <p className="text-gray-700 dark:text-gray-200 mb-4">
            Crea tu primer evento para comenzar a contar el tiempo
          </p>
          <div className="flex flex-col md:flex-row gap-4 text-sm text-gray-600 dark:text-gray-300 justify-center">
            <div className="flex items-center gap-2">
              <Calendar className="text-purple-500 dark:text-purple-400" size={20} />
              <span>Fechas especiales</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-blue-500 dark:text-blue-400" size={20} />
              <span>Horas del día</span>
            </div>
          </div>
        </div>
        
        <button
          onClick={onOpenEventManager}
          className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white py-4 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 dark:hover:from-blue-600 dark:hover:to-purple-600 transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 mx-auto text-lg font-semibold"
        >
          <Plus size={24} />
          Crear mi primer evento
        </button>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = 'WelcomeScreen';

export default WelcomeScreen;
