import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import React from 'react'
import { DateSelector } from './selector-fecha'

export default function ContadorDias() {
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [horasRestantes, setHorasRestantes] = useState(0);
  const [minutosRestantes, setMinutosRestantes] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);
  const [targetDate, setTargetDate] = useState<Date | null>(null);
  const [eventName, setEventName] = useState('día 4 del próximo mes');
  const hoy = new Date();
  
  useEffect(() => {
    const storedDate = localStorage.getItem('customDate');
    const storedName = localStorage.getItem('customName');
    
    if (hoy.getDate() === 4) {
      setEventName('el 4 del mes');
    } else {
      setEventName('el día 4 del próximo mes');
    }

    if (storedDate) {
      console.log('Stored date:', storedName);
      setTargetDate(new Date(storedDate));
      if (storedName) {
        setEventName(storedName);
      }
    }
  }, []);

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const hoy = new Date()
      let fechaObjetivo: Date;

      if (targetDate) {
        fechaObjetivo = targetDate;
      } else {
        // Lógica para encontrar el próximo día 4
        const hoy = new Date();
        fechaObjetivo = hoy.getDate() <= 4 
          ? new Date(hoy.getFullYear(), hoy.getMonth(), 4)
          : new Date(hoy.getFullYear(), hoy.getMonth() + 1, 4);
        
      }
      if (fechaObjetivo <  new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() - 1)) {
        fechaObjetivo.setFullYear(hoy.getFullYear() + 1);
    }

      const diferencia = fechaObjetivo.getTime() - hoy.getTime();
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
      


      setDiasRestantes(dias);
      setHorasRestantes(horas);
      setMinutosRestantes(minutos);
      setSegundosRestantes(segundos);
    }

    calcularTiempoRestante()
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo)
  }, [targetDate])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <DateSelector 
        onDateSelect={(date,displayText, name) => {
          setTargetDate(date);
          setEventName(name);
        }}
      />
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Contador de Días</h1>
        <div className="flex items-center justify-center mb-6">
          <CalendarDays className="text-blue-500 mr-2" size={32} />
          <p className="text-xl text-gray-700">
            {diasRestantes === -1 ? (
              <span className="font-bold text-green-600 text-4xl">¡Hoy es el día!</span>
            ) : (
              <>
              <p className="text-xl text-gray-700 mr-6">
                Faltan <span className="font-bold text-blue-600 text-4xl">{diasRestantes}</span> día
                {diasRestantes !== 1 && 's'}
              </p>
              <p className="text-xl text-gray-700">
              <span className="font-bold text-blue-600 text-3xl">{horasRestantes}</span> horas, <span className="font-bold text-blue-600 text-3xl">{minutosRestantes}</span> minutos y <span className="font-bold text-blue-600 text-3xl">{segundosRestantes}</span> segundos
              </p>
            </>
            )}
          </p>
        </div>
        <p className="text-gray-600">
          {diasRestantes === -1 ? `Hoy es ${eventName}` : `para ${eventName}`}
        </p>
      </div>
    </div>
  )
}