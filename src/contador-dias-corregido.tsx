import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'
import React from 'react'

export default function ContadorDias() {
  const [diasRestantes, setDiasRestantes] = useState(0);
  const [horasRestantes, setHorasRestantes] = useState(0);
  const [minutosRestantes, setMinutosRestantes] = useState(0);
  const [segundosRestantes, setSegundosRestantes] = useState(0);

  useEffect(() => {
    const calcularTiempoRestante = () => {
      const hoy = new Date()
      let proximoDiaCuatro

      if (hoy.getDate() <= 4) {
        proximoDiaCuatro = new Date(hoy.getFullYear(), hoy.getMonth(), 4)
      
      } else {
        proximoDiaCuatro = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 4)
      }

      if (proximoDiaCuatro <= hoy) {
        proximoDiaCuatro.setMonth(proximoDiaCuatro.getMonth() + 1)
      }

      const diferencia = proximoDiaCuatro.getTime() - hoy.getTime();
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
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl text-center">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">Contador de Días</h1>
        <div className="flex items-center justify-center mb-6">
          <CalendarDays className="text-blue-500 mr-2" size={32} />
          <p className="text-xl text-gray-700">
            {diasRestantes === 0 ? (
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
          {diasRestantes === 0 ? "Es 4 del mes" : "para el día 4 del próximo mes"}
        </p>
      </div>
    </div>
  )
}