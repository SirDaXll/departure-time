import React, { useState, useEffect, useRef } from 'react';
import { SavedEvent, EventFormData, EventFormState, EventType } from '../types/events';
import { Calendar, Clock, CalendarDays, Plus, Trash2, Edit2, X, Download, Upload, ChevronUp, ChevronDown } from 'lucide-react';
import { isValidDayForMonth, getMaxDaysInMonth } from '../utils/dateHelpers';
import { MONTH_NAMES } from '../utils/constants';
import { ToastType } from './Toast';

interface EventManagerProps {
  events: SavedEvent[];
  onAddEvent: (formData: EventFormData) => void;
  onUpdateEvent: (id: string, formData: EventFormData) => void;
  onDeleteEvent: (id: string) => void;
  onSelectEvent?: (event: SavedEvent) => void;
  onClose: () => void;
  onExport: () => void;
  onImport: (file: File) => Promise<void>;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  showToast: (message: string, type: ToastType) => void;
}

const EventManager = React.memo<EventManagerProps>((
  {
    events,
    onAddEvent,
    onUpdateEvent,
    onDeleteEvent,
    onSelectEvent,
    onClose,
    onExport,
    onImport,
    onMoveUp,
    onMoveDown,
    showToast,
  }
) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const firstFocusableRef = useRef<HTMLButtonElement>(null);
  const [formData, setFormData] = useState<EventFormState>({
    name: '',
    type: EventType.DATE,
    month: 0,
    day: 1,
    hour: 12,
    dayOfMonth: 1,
  });

  const resetForm = () => {
    setFormData({
      name: '',
      type: EventType.DATE,
      month: 0,
      day: 1,
      hour: 12,
      dayOfMonth: 1,
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleDelete = (event: SavedEvent) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el evento "${event.name}"?`)) {
      onDeleteEvent(event.id);
      showToast(`Evento "${event.name}" eliminado`, 'success');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsImporting(true);
      try {
        await onImport(file);
        showToast('Eventos importados exitosamente', 'success');
      } catch (error) {
        showToast(`Error al importar eventos: ${error}`, 'error');
      } finally {
        setIsImporting(false);
        // Limpiar el input para permitir reimportar el mismo archivo
        e.target.value = '';
      }
    }
  };

  // Cerrar con tecla Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isAdding) {
          resetForm();
        } else {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isAdding, onClose]);

  // Focus trap para accesibilidad
  useEffect(() => {
    const modal = modalRef.current;
    if (!modal) return;

    // Enfocar el primer elemento al abrir
    firstFocusableRef.current?.focus();

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modal.querySelectorAll(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement?.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement?.focus();
      }
    };

    modal.addEventListener('keydown', handleTabKey);
    return () => modal.removeEventListener('keydown', handleTabKey);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    // Verificar nombres duplicados
    const isDuplicate = events.some(
      event => event.name.toLowerCase() === formData.name.trim().toLowerCase() 
        && event.id !== editingId
    );

    if (isDuplicate) {
      showToast(`Ya existe un evento con el nombre "${formData.name}". Por favor elige un nombre diferente.`, 'warning');
      return;
    }

    // Validar que los campos requeridos estén presentes según el tipo
    let eventData: EventFormData;
    
    if (formData.type === EventType.DATE) {
      if (formData.month === undefined || formData.day === undefined) return;
      
      // Validar que el día sea válido para el mes
      if (!isValidDayForMonth(formData.day, formData.month)) {
        const maxDays = getMaxDaysInMonth(formData.month);
        showToast(`El día ${formData.day} no es válido para ${MONTH_NAMES[formData.month]}. El máximo es ${maxDays}.`, 'error');
        return;
      }
      
      eventData = {
        name: formData.name,
        type: EventType.DATE,
        month: formData.month,
        day: formData.day,
      };
    } else if (formData.type === EventType.TIME) {
      if (formData.hour === undefined) return;
      eventData = {
        name: formData.name,
        type: EventType.TIME,
        hour: formData.hour,
      };
    } else {
      if (formData.dayOfMonth === undefined) return;
      eventData = {
        name: formData.name,
        type: EventType.DAY_OF_MONTH,
        dayOfMonth: formData.dayOfMonth,
      };
    }

    if (editingId) {
      onUpdateEvent(editingId, eventData);
      showToast(`Evento "${formData.name}" actualizado`, 'success');
    } else {
      onAddEvent(eventData);
      showToast(`Evento "${formData.name}" creado`, 'success');
    }
    resetForm();
  };

  const handleEdit = (event: SavedEvent) => {
    setEditingId(event.id);
    setIsAdding(true);
    
    const baseFormData: EventFormState = {
      name: event.name,
      type: event.type,
    };
    
    if (event.type === EventType.DATE) {
      setFormData({
        ...baseFormData,
        month: event.targetDate.month,
        day: event.targetDate.day,
      });
    } else if (event.type === EventType.TIME) {
      setFormData({
        ...baseFormData,
        hour: event.targetHour,
      });
    } else {
      setFormData({
        ...baseFormData,
        dayOfMonth: event.targetDay,
      });
    }
  };

  const getEventDescription = (event: SavedEvent): string => {
    if (event.type === EventType.DATE) {
      return `${event.targetDate.day} de ${MONTH_NAMES[event.targetDate.month]}`;
    } else if (event.type === EventType.TIME) {
      return `${event.targetHour.toString().padStart(2, '0')}:00`;
    } else {
      return `Día ${event.targetDay} de cada mes`;
    }
  };

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case EventType.DATE:
        return <Calendar className="text-purple-500" size={20} />;
      case EventType.TIME:
        return <Clock className="text-blue-500" size={20} />;
      case EventType.DAY_OF_MONTH:
        return <CalendarDays className="text-green-500" size={20} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="event-manager-title"
    >
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col transition-colors duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700 text-white p-6 flex justify-between items-center">
          <h2 id="event-manager-title" className="text-2xl font-bold">Gestión de eventos</h2>
          <button
            ref={firstFocusableRef}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white bg-opacity-20 hover:bg-opacity-30 transition-colors duration-200 flex items-center justify-center"
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Botones de Exportar/Importar */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={onExport}
              className="flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              title="Exportar eventos a JSON"
            >
              <Upload size={18} />
              Exportar
            </button>
            <button
              onClick={handleImportClick}
              disabled={isImporting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Importar eventos desde JSON"
            >
              {isImporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Importando...
                </>
              ) : (
                <>
                  <Download size={18} />
                  Importar
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          {/* Add Event Button */}
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full mb-6 bg-gradient-to-r from-blue-500 to-purple-500 dark:from-blue-600 dark:to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-purple-600 dark:hover:from-blue-700 dark:hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-md"
            >
              <Plus size={20} />
              Agregar nuevo evento
            </button>
          )}

          {/* Add/Edit Form */}
          {isAdding && (
            <form onSubmit={handleSubmit} className="mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-600">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                {editingId ? 'Editar evento' : 'Nuevo evento'}
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nombre del evento:
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ej: Navidad, Almuerzo, Día de pago..."
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tipo de evento:
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as EventType })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={EventType.DATE}>Fecha específica (ej: Navidad)</option>
                  <option value={EventType.TIME}>Hora del día (ej: Almuerzo)</option>
                  <option value={EventType.DAY_OF_MONTH}>Día del mes (ej: Día de pago)</option>
                </select>
              </div>

              {/* Date Type Fields */}
              {formData.type === EventType.DATE && (
                <div className="mb-4 grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Mes:
                    </label>
                    <select
                      value={formData.month}
                      onChange={(e) => {
                        const newMonth = parseInt(e.target.value);
                        const maxDays = getMaxDaysInMonth(newMonth);
                        const currentDay = formData.day ?? 1;
                        const newDay = currentDay > maxDays ? maxDays : currentDay;
                        setFormData({ ...formData, month: newMonth, day: newDay });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {MONTH_NAMES.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Día:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={getMaxDaysInMonth(formData.month ?? 0)}
                      value={formData.day}
                      onChange={(e) => {
                        const value = parseInt(e.target.value) || 1;
                        const maxDays = getMaxDaysInMonth(formData.month ?? 0);
                        const clampedValue = Math.min(maxDays, Math.max(1, value));
                        setFormData({ ...formData, day: clampedValue });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Máximo: {getMaxDaysInMonth(formData.month ?? 0)} días
                    </p>
                  </div>
                </div>
              )}

              {/* Time Type Fields */}
              {formData.type === EventType.TIME && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hora (0-23):
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="23"
                    value={formData.hour}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (isNaN(value)) {
                        setFormData({ ...formData, hour: 0 });
                      } else {
                        const clampedValue = Math.min(23, Math.max(0, value));
                        setFormData({ ...formData, hour: clampedValue });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {(() => {
                      const hour = formData.hour ?? 0;
                      const hour24 = hour.toString().padStart(2, '0');
                      const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                      const ampm = hour >= 12 ? 'PM' : 'AM';
                      return `${hour24}:00 (${hour12}:00 ${ampm})`;
                    })()}
                  </p>
                </div>
              )}

              {/* Day of Month Type Fields */}
              {formData.type === EventType.DAY_OF_MONTH && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Día del mes (1-31):
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={formData.dayOfMonth}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1;
                      const clampedValue = Math.min(31, Math.max(1, value));
                      setFormData({ ...formData, dayOfMonth: clampedValue });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-600 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 dark:bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200"
                >
                  {editingId ? 'Actualizar' : 'Agregar'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Events List */}
          <div className="space-y-3">
            {events.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p className="text-lg">No hay eventos guardados</p>
                <p className="text-sm mt-2">Agrega tu primer evento para comenzar</p>
              </div>
            ) : (
              events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div 
                      className="flex items-start gap-3 flex-1 cursor-pointer"
                      onClick={() => onSelectEvent && onSelectEvent(event)}
                    >
                      <div className="mt-1">
                        {getEventIcon(event.type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{event.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{getEventDescription(event)}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                          {event.type === EventType.DATE && 'Fecha específica'}
                          {event.type === EventType.TIME && 'Hora del día'}
                          {event.type === EventType.DAY_OF_MONTH && 'Día del mes'}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      {/* Botones de reordenar */}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => onMoveUp(event.id)}
                          disabled={index === 0}
                          className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Mover arriba"
                          title="Mover arriba"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <button
                          onClick={() => onMoveDown(event.id)}
                          disabled={index === events.length - 1}
                          className="w-6 h-6 rounded-md bg-gray-100 dark:bg-gray-600 hover:bg-gray-200 dark:hover:bg-gray-500 text-gray-600 dark:text-gray-300 flex items-center justify-center transition-colors duration-200 disabled:opacity-30 disabled:cursor-not-allowed"
                          aria-label="Mover abajo"
                          title="Mover abajo"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>
                      {/* Botones de editar/eliminar */}
                      <button
                        onClick={() => handleEdit(event)}
                        className="w-8 h-8 rounded-md bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-600 dark:text-blue-300 flex items-center justify-center transition-colors duration-200"
                        aria-label="Editar evento"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(event)}
                        className="w-8 h-8 rounded-md bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-600 dark:text-red-300 flex items-center justify-center transition-colors duration-200"
                        aria-label="Eliminar evento"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

EventManager.displayName = 'EventManager';

export default EventManager;
