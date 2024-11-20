'use client'

import { useState, useEffect } from 'react'
import { CalendarDays } from 'lucide-react'

export default function ContadorDias() {
  const [diasRestantes, setDiasRestantes] = useState(0)

  useEffect(() => {
    const calcularDiasRestantes = () => {
      const hoy = new Date()
      let proximoDiaCuatro

      if (hoy.getDate() <= 4) {
        // Si estamos en el día 4 o antes, el próximo día 4 es este mes
        proximoDiaCuatro = new Date(hoy.getFullYear(), hoy.getMonth(), 4)
      } else {
        // Si ya pasó el día 4, el próximo día 4 es el mes siguiente
        proximoDiaCuatro = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 4)
      }

      // Si el día 4 ya pasó hoy, ajustamos al próximo mes
      if (proximoDiaCuatro <= hoy) {
        proximoDiaCuatro.setMonth(proximoDiaCuatro.getMonth() + 1)
      }

      const diferencia = proximoDiaCuatro.getTime() - hoy.getTime()
      const dias = Math.ceil(diferencia / (1000 * 3600 * 24))
      setDiasRestantes(dias)
    }

    calcularDiasRestantes()
    const intervalo = setInterval(calcularDiasRestantes, 86400000) // Actualizar cada 24 horas

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
                Faltan <span className="font-bold text-blue-600 text-4xl">{diasRestantes}</span> día{diasRestantes !== 1 && 's'}
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
