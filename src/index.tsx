import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import ContadorDias from './contador-dias-corregido';
import MillhouseCountdown from './contador-dias-Milhouse';

import './index.css';

const App = () => {
  // Estado para alternar entre los componentes
  const [showContador, setShowContador] = useState(true);

  // Función para alternar los componentes
  const toggleComponent = () => {
    setShowContador(prevState => !prevState);
  };

  return (
    <div className="relative">
      {showContador ? <ContadorDias /> : <MillhouseCountdown />}

      <div className="group absolute top-4 right-6">
        <button
          onClick={toggleComponent}
          className="w-12 h-12 rounded-full bg-white hover:bg-purple-100 transition-colors duration-200 flex items-center justify-center shadow-md focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
        <span className="absolute top-12 left-1/2 transform -translate-x-1/2 text-white bg-purple-600 text-sm rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Cambiar contador
          </span>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
