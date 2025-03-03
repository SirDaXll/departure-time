import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import React from 'react'

export default function Contador() {
  const [horasRestantes, setHorasRestantes] = useState(0);
  const [minutosRestantes, setMinutosRestantes] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const hoy = new Date();
      let fechaObjetivo = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 16, 0, 0); // 4pm today

      if (hoy.getHours() >= 16) {
        // If it's already past 4pm, set the target to 4pm tomorrow
        fechaObjetivo.setDate(fechaObjetivo.getDate() + 1);
      }

      const diferencia = fechaObjetivo.getTime() - hoy.getTime();
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      setHorasRestantes(horas);
      setMinutosRestantes(minutos);
      setSegundosRestantes(segundos);
    }

    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Contador de tiempo</h1>
        <div className="flex items-center justify-center mb-6">
          <CalendarDays className="text-blue-500 mr-2" size={32} />
          <p className="text-xl text-gray-700">
            <span className="font-bold text-blue-600 text-3xl">{horasRestantes}</span> horas, <span className="font-bold text-blue-600 text-3xl">{minutosRestantes}</span> minutos y <span className="font-bold text-blue-600 text-3xl">{segundosRestantes}</span> segundos
          </p>
        </div>
        <p className="text-gray-600">para las 04:00 pm</p>
      </div>
    </div>
  )
}