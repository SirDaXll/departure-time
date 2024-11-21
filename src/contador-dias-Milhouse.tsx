import { useState, useEffect } from 'react'
import React from 'react'

export default function MillhouseCountdown() {
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
    <div className="relative min-h-screen bg-black flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl lg:max-w-6xl">
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/giphy-HTOR9kAnJBtsC4ba84a5tpoe9oApjC.webp"
          alt="Milhouse countdown"
          className="w-full rounded-lg shadow-xl"
        />
        <div className="absolute top-[17%] right-[13%] w-[17%] bg-black/80 p-1 rounded-lg backdrop-blur-sm">
          {diasRestantes === 0 ? (
            <div className="text-green-400 font-mono text-[50%] md:text-[4%] lg:text-[150%] text-center">
              ¡HOY ES EL DÍA!
            </div>
          ) : (
            <div className="font-mono text-center space-y-1">
              <div className="text-white text-[3%] md:text-[4%] lg:text-[150%]">
                {diasRestantes}d {horasRestantes}h
              </div>
              <div className="text-white text-[2.5%] md:text-[3%] lg:text-[150%]">
                {minutosRestantes}m {segundosRestantes}s
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-[28%] right-[13%] w-[17%] bg-[#8BB38F] p-1 rounded-lg backdrop-blur-sm">
          <p className="font-mono text-[2.5%] md:text-[3%] lg:text-[150%] text-center">Tiempo para<br/> el pago</p>
        </div>
      </div>
    </div>
  )
}