# Payday 💰

### Proyecto pequeño con React para ver cuántos días faltan para el día de pago 💵

## Descripción

Este proyecto comenzó como un contador para ver cuántos días quedan hasta el día de pago en mi empresa. Sin embargo, le añadí nuevas funcionalidades como fechas predefinidas  🎄 (Navidad) y 🎆 (Año Nuevo), y la posibilidad de agregar nombres y fechas personalizadoss.

Es una aplicación simple pero práctica, que permite a los usuarios ver cuántos días faltan para un evento 📅 y la cuenta regresiva ⏳ para fechas específicas.

## Características ✨

* Cuenta regresiva para el próximo día de pago en mi empresa (día 4 de cada mes).
* Fechas predefinidas como Navidad 🎄 y Año Nuevo 🎆.
* Posibilidad de añadir una fecha y nombre personalizado 🖊️.
* Dos estilos diferentes para la cuenta regresiva 🎨.
* Desplegado en Vercel para fácil acceso 🌐.

## Instalación ⚙️

1. Clona el repositorio:
   ```bash
   git clone https://github.com/NikoMalek/payday.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd payday
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso 🚀

Para iniciar la aplicación localmente, ejecuta el siguiente comando:
```bash
npm run start
```

También puedes ver la aplicación desplegada en Vercel [aquí](https://payday-peach.vercel.app/).

## Estructura del Proyecto 🏗️

* `src/index.tsx`: Punto de entrada principal de la aplicación.
* `src/contador-dias.tsx`: Componente principal para la cuenta regresiva del día de pago.
* `src/contador-dias-Milhouse.tsx`: Componente alternativo con un estilo diferente para la cuenta regresiva.
* `src/selector-fecha.tsx`: Componente para seleccionar fechas predefinidas y personalizadas.
  
## Dependencias Principales 📦

* React ⚛️
* Vite ⚡
* TailwindCSS 🌊

## Despliegue 🌍

La aplicación está desplegada en Vercel y se puede acceder a través del siguiente enlace: [Payday - Vercel](https://payday-peach.vercel.app/).
