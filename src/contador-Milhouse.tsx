import { useState, useEffect } from 'react'
import React from 'react'

export default function MillhouseCountdown() {
  const [diasRestantes, setDiasRestantes] = useState(0);
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
      const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      const horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      const segundos = Math.floor((diferencia % (1000 * 60)) / 1000);

      setDiasRestantes(dias);
      setHorasRestantes(horas);
      setMinutosRestantes(minutos);
      setSegundosRestantes(segundos);
    }

    calcularTiempoRestante();
    const intervalo = setInterval(calcularTiempoRestante, 1000);

    return () => clearInterval(intervalo);
  },);

  const formatTime = (time: number) => {
    return String(time).padStart(2, '0');
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
      <div className="relative w-full max-w-4xl lg:max-w-6xl">
        <img
          src="https://kggwetnm0aecy2yh.public.blob.vercel-storage.com/milhouse-6hPKMn1xggNt04ba5UHaBGdtXj8nkM.webp"
          alt="Milhouse countdown"
          className="w-full shadow-xl"
        />
        <div className="absolute top-[18.8%] right-[14.5%] w-[14%]">
          {diasRestantes === -1 ? (
            <div className="text-green-400 font-mono text-[50%] md:text-[4%] lg:text-[150%] text-center">
              ¡ES HORA DE IRSE!
            </div>
          ) : (
            <div className="font-mono text-center">
              <div className="text-[#5e8f2a] text-[2.5%] md:text-[3%] lg:text-[300%]">
                <span style={{ fontFamily: 'Digital-7, sans-serif' }}>
                  {formatTime(horasRestantes)}:{formatTime(minutosRestantes)}:{formatTime(segundosRestantes)}
                </span>
              </div>
            </div>
          )}
        </div>
        <div className="absolute top-[27%] right-[13%] w-[17%]">
          <p className="font-mono text-[2.5%] md:text-[3%] lg:text-[200%] text-center break-words whitespace-normal overflow-hidden" style={{ fontWeight: 'bold' }}>
            Tiempo para la salida
          </p>
        </div>
      </div>
    </div>
  )
}