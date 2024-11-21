import React, { useState } from 'react';
import { Calendar, X, Menu } from 'lucide-react';

interface DateSelectorProps {
  onDateSelect: (date: Date, displayText: string, name: string) => void;
  defaultDates?: { name: string, getDate: () => Date }[];
}

export function DateSelector({ 
  onDateSelect, 
  defaultDates = [
    { 
      name: 'Próximo día 4', 
      displayText: 'Tiempo para el pago',
      getDate: () => {
        const hoy = new Date();
        let proximoDiaCuatro = hoy.getDate() <= 4 
          ? new Date(hoy.getFullYear(), hoy.getMonth(), 4)
          : new Date(hoy.getFullYear(), hoy.getMonth() + 1, 4);
        
        if (proximoDiaCuatro <= hoy) {
          proximoDiaCuatro.setMonth(proximoDiaCuatro.getMonth() + 1);
        }
        return proximoDiaCuatro;
      }
    },
    { 
      name: 'Navidad', 
      displayText: 'Tiempo para Navidad',
      getDate: () => new Date(`${new Date().getFullYear()}-12-25`) 
    },
    { 
      name: 'Año Nuevo', 
      displayText: 'Tiempo para Año Nuevo',
      getDate: () => new Date(`${new Date().getFullYear() + 1}-01-01`) 
    }
  ]
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState('');

  const handleCustomDateSubmit = () => {
    if (!customDate || !customName) {
      setError('Por favor, completa ambos campos');
      return;
    }

    if (customDate < today) {
      setError('La fecha no puede ser anterior a hoy');
      // setCustomDate('');
      return;
    }

    onDateSelect(new Date(customDate), customName, customName);
    setShowMenu(false);
    setCustomDate('');
    setCustomName('');
    setError('');
  };

  const today = new Date().toISOString().split('T')[0];

  const handleDateBlur = () => {
    if (customDate && customDate < today) {
      setError('La fecha no puede ser anterior a hoy');
      // setCustomDate('');
    } else {
      setError('');
    }
  };

  return (
    <>
      {/* Botón de menú */}
      <button 
        onClick={() => setShowMenu(!showMenu)}
        className="absolute top-4 left-4 z-50 bg-white hover:bg-purple-100 p-2 rounded-full"
      >
        {showMenu ? <X className="text-purple-600" /> : <Menu className="text-purple-600" />}
      </button>

      {/* Menú de selección de fechas */}
      {showMenu && (
        <div className="absolute top-16 left-4 z-50 bg-white/80 rounded-lg p-4 w-64">
          <h3 className="text-xl font-bold mb-4">Seleccionar Fecha</h3>
          
          {/* Fechas predefinidas */}
          {defaultDates.map((date, index) => (
            <button 
              key={index}
              onClick={() => {
                const hoy = new Date();
                if (date.name === 'Próximo día 4' && hoy.getDate() === 4) {
                  date.name = 'el 4 del mes';
                } else if (date.name === 'Próximo día 4') {
                  date.name = 'el día 4 del próximo mes';
                }
                onDateSelect(date.getDate(), date.displayText, date.name);
                setShowMenu(false);
              }}
              className="w-full text-left p-2 hover:bg-gray-200 rounded"
            >
              {date.name}
            </button>
          ))}

          {/* Fecha personalizada */}
          <div className="mt-4 space-y-2">
            <input 
              type="text"
              placeholder="Nombre del evento"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              maxLength={20}
              className="w-full p-2 border rounded"
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p> // Mensaje pequeño
            )}

            <input 
              type="date"
              value={customDate}
              onChange={(e) => setCustomDate(e.target.value)}
              min={today}
              onBlur={handleDateBlur}
              className="w-full p-2 border rounded"
            />
            <button 
              onClick={handleCustomDateSubmit}
              className="w-full bg-blue-500 text-white p-2 rounded"
            >
              Guardar Fecha
            </button>
          </div>
        </div>
      )}
    </>
  );
}