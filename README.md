# Departure Time 🏃‍♂️💨

**Aplicación de cuenta regresiva personalizable con React y TypeScript**

Departure Time es una aplicación moderna que te permite crear y gestionar múltiples contadores regresivos para tus eventos importantes. Con dos estilos visuales únicos, tema oscuro/claro, notificaciones inteligentes, y persistencia automática de datos.

🌐 **Demo en vivo**: [departuretime.vercel.app](https://departuretime.vercel.app/)

## ✨ Características Principales

### 📅 Gestión de Eventos
- **3 tipos de eventos**:
  - 🎄 **Fecha específica** - Eventos anuales (cumpleaños, Navidad, etc.)
  - ⏰ **Hora del día** - Eventos diarios (almuerzo, salida del trabajo, etc.)
  - 📆 **Día del mes** - Eventos mensuales (día de pago, reuniones, etc.)
- Crear, editar y eliminar eventos con confirmaciones
- Reordenar eventos manualmente (botones ↑↓)
- Exportar/importar eventos en JSON
- Validación inteligente de fechas (evita 31 de febrero, etc.)
- Detección de nombres duplicados
- Persistencia automática con debouncing (500ms)

### 🎨 Interfaz y Visualización
- **Dos estilos de contador**:
  - Moderno y minimalista
  - Milhouse (temático de Los Simpson)
- Tema oscuro/claro con persistencia
- Control de audio global (silenciar/activar)
- Notificaciones toast elegantes
- Pantalla de bienvenida para nuevos usuarios
- Mensajes de celebración al llegar a cero
- Diseño responsive (móvil, tablet, desktop)

### 🔔 Notificaciones y Audio
- Notificaciones del navegador (5min y 1min antes)
- Sonido de celebración al completarse (Web Audio API)
- Control de audio con persistencia
- Sistema de permisos para notificaciones

### ⚡ Optimizaciones y Calidad
- TypeScript strict mode
- Error Boundary para estabilidad
- Lazy loading de componentes pesados
- Optimización con useMemo/useCallback
- Focus trap en modales (accesibilidad)
- Loading states con spinners
- Validación robusta de datos importados
- Constantes centralizadas
- Meta tags para SEO y seguridad

## 🛠️ Tecnologías

| Categoría | Tecnologías |
|-----------|-------------|
| **Frontend** | React 18, TypeScript |
| **Build** | Vite 5.4.21 |
| **Styling** | TailwindCSS, PostCSS |
| **Iconos** | lucide-react |
| **APIs** | Web Audio API, Notification API |
| **Persistencia** | localStorage |
| **Package Manager** | pnpm |

## 🚀 Instalación y Uso

```bash
# Clonar el repositorio
git clone https://github.com/SirDaXll/departure-time.git

# Navegar al directorio
cd departure-time

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev
```

La aplicación estará disponible en `http://localhost:5173/`

## 📖 Guía de Uso

1. **Primera vez**: Verás una pantalla de bienvenida
2. **Crear evento**: Clic en ✨ (botón morado) o "Crear mi primer evento"
3. **Configurar**:
   - Nombre del evento
   - Tipo (fecha/hora/día del mes)
   - Campos específicos según el tipo
4. **Seleccionar**: Clic en un evento para activar el contador
5. **Controles**:
   - 🔄 Cambiar estilo visual
   - 🌙/☀️ Alternar tema oscuro/claro
   - 🔊/🔇 Silenciar/activar sonidos
   - ❌ Deseleccionar evento actual

## 🏗️ Estructura del Proyecto

```
departure-time/
├── src/
│   ├── components/
│   │   ├── ControlButton.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── EventManager.tsx
│   │   ├── Toast.tsx
│   │   ├── ToastContainer.tsx
│   │   └── WelcomeScreen.tsx
│   ├── contexts/
│   │   ├── SoundContext.tsx
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   ├── useCountdown.ts
│   │   ├── useEvents.ts
│   │   ├── useNotifications.ts
│   │   ├── useSound.ts
│   │   └── useToast.ts
│   ├── types/
│   │   └── events.ts
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── dateHelpers.ts
│   │   ├── debounce.ts
│   │   └── timeFormat.ts
│   ├── contador.tsx
│   ├── contador-Milhouse.tsx
│   ├── index.tsx
│   └── index.css
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🤝 Contribuciones

Las contribuciones son bienvenidas:

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo `LICENSE` para más detalles.

## ✍️ Autores

- **Proyecto original**: [NikoMalek](https://github.com/NikoMalek)
- **Fork y desarrollo**: [SirDaXll](https://github.com/SirDaXll)

---

⏰ *¡Disfruta contando el tiempo hasta tus eventos importantes!* ✨

