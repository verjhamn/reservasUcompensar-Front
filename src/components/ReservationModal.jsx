import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, addHours, isBefore, startOfDay } from "date-fns";
import es from "date-fns/locale/es";
import { toast, Toaster } from 'react-hot-toast';
import { createReservation } from "../Services/createReservationService";
import { getUserId } from "../Services/authService";
import { getDisponibilidad, processOccupiedHours } from "../Services/getDisponibilidadService";
import { canReserveAnySpace } from '../utils/userHelper';
import { getDisponibilidadMes } from "../Services/getDisponibilidadService";

import LoadingSpinner from './UtilComponents/LoadingSpinner';
import Carousel from './UtilComponents/Carousel';

const locales = { es: es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const ReservationModal = ({ isOpen, onClose, spaceData, goToMyReservations }) => {

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("info");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedHours, setSelectedHours] = useState([]);
  const [reservationTitle, setReservationTitle] = useState("");
  const [reservationDescription, setReservationDescription] = useState("");
  const [reservedHours, setReservedHours] = useState([]);
  const [monthAvailability, setMonthAvailability] = useState({});

  const isCoworking = spaceData?.coworking_contenedor === "SI";

  useEffect(() => {
    if (spaceData && spaceData.reservas) {
      const eventsForSpace = spaceData.reservas.map(reserva => ({
        id: reserva.id,
        title: reserva.titulo,
        start: new Date(reserva.inicio.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
        end: new Date(reserva.fin.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
        desc: `Reservado por: ${reserva.usuario.nombre}`,
        usuario: reserva.usuario,
        estado: reserva.estado
      }));
      setFilteredEvents(eventsForSpace);
    }
  }, [spaceData]);

  // Cargar disponibilidad del mes cuando cambie el espacio o el mes
  useEffect(() => {
    const fetchMonthAvailability = async () => {
      if (selectedDate && spaceData?.id) {
        try {
          const month = selectedDate.getMonth() + 1;
          const year = selectedDate.getFullYear();
          
          const disponibilidadMes = await getDisponibilidadMes(spaceData.id, month, year);
          const horasArray = processOccupiedHours(disponibilidadMes);
          
          // Crear objeto con disponibilidad del mes
          // Para el mes completo, necesitamos procesar las reservas por día
          const availabilityData = {};
          
          // Procesar cada día del mes
          const daysInMonth = new Date(year, month, 0).getDate();
          for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month - 1, day);
            const dateKey = format(currentDate, "yyyy-MM-dd");
            
            // Filtrar reservas para este día específico
            const dayReservas = disponibilidadMes.reservas.filter(reserva => {
              const reservaDate = new Date(reserva.hora_inicio);
              return format(reservaDate, "yyyy-MM-dd") === dateKey;
            });
            
            // Procesar horas ocupadas para este día
            const horasOcupadas = new Set();
            dayReservas.forEach(reserva => {
              if (reserva.estado !== "Completada" && reserva.estado !== "Cancelada") {
                const inicio = new Date(reserva.hora_inicio);
                const fin = new Date(reserva.hora_fin);
                
                let horaActual = new Date(inicio);
                while (horaActual < fin) {
                  horasOcupadas.add(format(horaActual, "HH:00"));
                  horaActual = addHours(horaActual, 1);
                }
              }
            });
            
            availabilityData[dateKey] = Array.from(horasOcupadas).sort();
          }
          
          setMonthAvailability(availabilityData);
          console.log('Disponibilidad del mes cargada:', availabilityData);
        } catch (error) {
          console.error("Error al cargar disponibilidad del mes:", error);
        }
      }
    };

    fetchMonthAvailability();
  }, [spaceData?.id, selectedDate.getMonth(), selectedDate.getFullYear()]);

  useEffect(() => {
    const fetchDisponibilidad = async () => {
      if (selectedDate && spaceData?.id) {
        try {
          const formattedDate = format(selectedDate, "dd/MM/yyyy");
          const disponibilidad = await getDisponibilidad(spaceData.id, formattedDate);
          
          console.log('Respuesta disponibilidad:', disponibilidad);

          // Usar la nueva función de procesamiento
          const horasArray = processOccupiedHours(disponibilidad, selectedDate);
          
          console.log('Horas ocupadas finales:', horasArray);
          setReservedHours(horasArray);
        } catch (error) {
          console.error("Error al obtener disponibilidad:", error);
        }
      }
    };

    fetchDisponibilidad();
  }, [selectedDate, spaceData?.id]);

  const handleSlotSelect = (slotInfo) => {
    const selectedStart = startOfDay(slotInfo.start);
    const selectedEnd = addHours(selectedStart, 23);

    // Verificar que la fecha seleccionada no sea anterior al día actual
    if (isBefore(selectedStart, startOfDay(new Date()))) {
      toast.error('No se puede reservar en días anteriores al actual.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
        },
      });
      return;
    }

    // Verificar si el día seleccionado tiene disponibilidad
    if (!hasAvailabilityForDate(selectedStart)) {
      toast.error('Este día no tiene disponibilidad. Por favor seleccione otro día.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
        },
      });
      return;
    }

    const isSlotOccupied = filteredEvents.some(
      (event) =>
        new Date(selectedStart) < new Date(event.end) &&
        new Date(selectedEnd) > new Date(event.start)
    );

    if (!isSlotOccupied) {
      setSelectedDate(selectedStart);
      setSelectedHours([]);
    } else {
      toast.error('Este horario ya está ocupado. Por favor seleccione otro.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
        },
      });
    }
  };

  const handleConfirmReservation = async () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    const isAdmin = canReserveAnySpace(userData?.mail);

    if (!isAdmin && spaceData.coworking_contenedor !== "SI") {
      toast.error(
        'Por favor, para reservar este espacio escribir al correo admon.campus@ucompensar.edu.co',
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      return; // Solo retornamos sin cerrar el modal
    }

    setLoading(true);
    try {
      // Validation checks...
      if (!isCoworking) {
        // Para espacios NO coworking: validar título y descripción
        if (!reservationTitle.trim()) {
          toast.error('Por favor ingrese un título para la reserva', {
            duration: 4000,
            position: 'top-right',
          });
          setLoading(false);
          return;
        }
        
        if (!reservationDescription.trim()) {
          toast.error('Por favor ingrese una descripción para la reserva', {
            duration: 4000,
            position: 'top-right',
          });
          setLoading(false);
          return;
        }
      }
      // Para espacios coworking: no se requieren validaciones de título y descripción

      let startDateTime, endDateTime;

      if (!selectedHours.length) {
        toast.error('Por favor seleccione al menos una hora', {
          duration: 4000,
          position: 'top-right',
        });
        setLoading(false);
        return;
      }
      
      startDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedHours[0]}`);
      endDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedHours[selectedHours.length - 1]}`);
      endDateTime.setHours(endDateTime.getHours() + 1);

      const formattedDate = format(selectedDate, "dd/MM/yyyy");
      const formattedStartTime = format(startDateTime, "HH:mm");
      const formattedEndTime = format(endDateTime, "HH:mm");

      const reservationData = {
        espacio_id: spaceData.id,
        espacio_type: spaceData.coworking_contenedor === "SI" 
          ? "App\\Models\\basics\\EspacioCoworking"
          : "App\\Models\\basics\\Espacio",
        user_id: getUserId() || "3816a79a-78e1-4dc1-ae3b-3c5e4533ff8f",
        titulo: isCoworking ? `Reserva ${spaceData.codigo} - ${formattedDate}` : reservationTitle, // Título automático para coworking, manual para otros
        descripcion: isCoworking ? "" : reservationDescription, // Solo para espacios NO coworking
        fecha_reserva: formattedDate,
        hora_inicio: formattedStartTime,
        hora_fin: formattedEndTime,
        observaciones: isCoworking ? reservationDescription : "" // Solo para espacios coworking
      };

      try {
        const response = await createReservation(reservationData);
        console.log("Respuesta del servidor:", response);

        if (response.status === "success") {
          toast.success(
            `Reserva confirmada con éxito para el día ${formattedDate} de ${formattedStartTime} a ${formattedEndTime}`,
            {
              duration: 4000,
              position: 'top-right',
              style: {
                background: '#dcfce7',
                color: '#16a34a',
              },
            }
          );
          onClose();
          goToMyReservations();
        } else {
          throw new Error(response.message || 'Error al crear la reserva');
        }
      } catch (error) {
        toast.error(
          `Error al crear la reserva: ${error.message || 'Por favor, intente nuevamente.'}`,
          {
            duration: 4000,
            position: 'top-right',
            style: {
              background: '#fee2e2',
              color: '#dc2626',
            },
          }
        );
      }
    } catch (error) {
      toast.error('Error al confirmar la reserva', {
        duration: 4000,
        position: 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
      slots.push(timeSlot);
    }
    return slots;
  };

  const isTimeSlotAvailable = (timeSlot) => {
    /* console.log('Checking slot:', timeSlot, 'Reserved hours:', reservedHours); // Debug */
    return !reservedHours.includes(timeSlot);
  };

  const handleTimeSelect = (time) => {
    const timeValue = parseInt(time.split(':')[0]);
    
    if (selectedHours.includes(time)) {
      // Si la hora ya está seleccionada, verificar si es una hora de extremo
      const sortedHours = selectedHours.map(h => parseInt(h.split(':')[0])).sort();
      const minHour = Math.min(...sortedHours);
      const maxHour = Math.max(...sortedHours);
      
      // Solo permitir desmarcar si es la hora mínima o máxima
      if (timeValue === minHour || timeValue === maxHour) {
        // Si es la hora mínima, eliminar todas las horas hasta la siguiente
        if (timeValue === minHour) {
          const nextHour = sortedHours.find(h => h > timeValue);
          if (nextHour) {
            setSelectedHours(prev => prev.filter(h => parseInt(h.split(':')[0]) >= nextHour));
          } else {
            setSelectedHours(prev => prev.filter(h => h !== time));
          }
        } else {
          // Si es la hora máxima, eliminar todas las horas desde la anterior
          const prevHour = sortedHours.find(h => h < timeValue);
          if (prevHour) {
            setSelectedHours(prev => prev.filter(h => parseInt(h.split(':')[0]) <= prevHour));
          } else {
            setSelectedHours(prev => prev.filter(h => h !== time));
          }
        }
      } else {
        // Mostrar mensaje de error si intenta desmarcar una hora intermedia
        toast.error('No puedes desmarcar horas intermedias. Solo puedes desmarcar las horas de los extremos.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#fee2e2',
            color: '#dc2626',
          },
        });
      }
      return;
    }

    // Si no está seleccionada, agregar la hora y completar el rango
    const currentHours = selectedHours.map(h => parseInt(h.split(':')[0]));
    const allHours = [...currentHours, timeValue].sort();
    const min = Math.min(...allHours);
    const max = Math.max(...allHours);
    
    // Generar todas las horas del rango
    const rangeHours = [];
    for (let i = min; i <= max; i++) {
      rangeHours.push(`${i.toString().padStart(2, '0')}:00`);
    }
    
    setSelectedHours(rangeHours);
  };

  const handleHourClick = (hour) => {
    const newSelectedHours = new Set(selectedHours);
    const hourValue = parseInt(hour.split(':')[0]);

    if (selectedHours.has(hour)) {
      // Si se está deseleccionando una hora, eliminar todas las horas posteriores
      const sortedHours = Array.from(selectedHours).sort();
      const hourIndex = sortedHours.indexOf(hour);

      // Eliminar la hora actual y todas las posteriores
      const updatedHours = sortedHours.slice(0, hourIndex);
      setSelectedHours(new Set(updatedHours));
    } else {
      // Verificar si la nueva hora es consecutiva
      const sortedHours = Array.from(selectedHours).sort();

      if (selectedHours.size === 0 ||
        sortedHours.some(selectedHour => {
          const selectedValue = parseInt(selectedHour.split(':')[0]);
          return Math.abs(selectedValue - hourValue) === 1;
        })) {
        newSelectedHours.add(hour);
        setSelectedHours(newSelectedHours);
      }
    }
  };

  const renderTimeSelector = () => {
    return (
      <div className="bg-white p-4 mt-4">
        <h3 className="text-lg font-semibold text-turquesa mb-3">
          {isCoworking ? "Seleccionar período" : "Seleccionar horario"}
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {generateTimeSlots().map((time) => {
            const isAvailable = isTimeSlotAvailable(time);
            return (
              <button
                key={time}
                onClick={() => isAvailable && handleTimeSelect(time)}
                disabled={!isAvailable}
                className={`
                  p-2 rounded-md text-sm
                  ${selectedHours.includes(time)
                    ? 'bg-turquesa text-white'
                    : isAvailable
                      ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }
                `}
              >
                {time}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!isOpen || !spaceData) return null;

  // Función para verificar si un día tiene disponibilidad
  const hasAvailabilityForDate = (date) => {
    // Si es una fecha anterior al día actual, no tiene disponibilidad
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return false;
    }

    // Usar datos del mes si están disponibles, sino usar datos del día
    const dateKey = format(date, "yyyy-MM-dd");
    const dayReservedHours = monthAvailability[dateKey] || reservedHours;

    // Si no hay datos de disponibilidad cargados aún, asumir que tiene disponibilidad
    if (dayReservedHours.length === 0) {
      return true;
    }

    // Para todos los tipos de espacios, verificar si al menos una hora está disponible
    const timeSlots = generateTimeSlots();
    return timeSlots.some(timeSlot => !dayReservedHours.includes(timeSlot));
  };

  const dayPropGetter = (date) => {
    // Primero verificar si es una fecha anterior al día actual
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return {
        style: {
          backgroundColor: "#f0f0f0",
          color: "#d3d3d3",
          pointerEvents: "none",
        },
        className: "rbc-off-range-bg",
      };
    }
    
    // Luego verificar si el día no tiene disponibilidad
    if (!hasAvailabilityForDate(date)) {
      // Si es el día seleccionado y no tiene disponibilidad, usar rojo más oscuro
      if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
        return {
          style: {
            backgroundColor: "#d32f2f",
            color: "#fff",
            border: "2px solid #b71c1c",
            borderRadius: "4px",
            fontWeight: "bold",
          },
          className: "rbc-day-no-availability-selected",
        };
      }
      
      // Si no está seleccionado, usar el estilo normal de sin disponibilidad
      return {
        style: {
          backgroundColor: "#ffebee",
          color: "#d32f2f",
          border: "2px solid #f44336",
          borderRadius: "4px",
        },
        className: "rbc-day-no-availability",
      };
    }
    
    // Finalmente, si es el día seleccionado y tiene disponibilidad
    if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      return {
        style: {
          backgroundColor: "#00aab7",
          color: "#fff",
        },
      };
    }
    
    return {};
  };

  const slotPropGetter = (date) => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return {
        style: {
          backgroundColor: "#f0f0f0",
          color: "#d3d3d3",
          pointerEvents: "none",
          cursor: "not-allowed",
        },
        className: "rbc-off-range-bg",
      };
    }
    return {};
  };

  const handleNavigate = (date) => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      toast.error('No se puede reservar en días anteriores al actual.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#fee2e2',
          color: '#dc2626',
        },
      });
      return;
    }
    setSelectedDate(date);
  };

  const getImagePaths = () => {
    if (!spaceData) return [];
    if (spaceData.coworking_contenedor === "SI") {
      return spaceData.imagenes?.map(img => img.img_path) || [];
    }
    return spaceData.imagenes?.map(img => img.img_path) || [];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Toaster />
      <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[95vh] overflow-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{spaceData.tipo}: {spaceData.codigo}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 ${activeTab === "info"
              ? "border-b-2 border-turquesa font-bold text-turquesa"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Información
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`py-2 px-4 ${activeTab === "availability"
              ? "border-b-2 border-turquesa font-bold text-turquesa"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Disponibilidad
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === "info" && (
          <div className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-2/3 h-64 md:h-80">
                <Carousel images={getImagePaths()} />
              </div>
              <div className="w-full max-h-80 md:w-1/3 grid grid-cols-2 md:grid-cols-1 gap-4 overflow-y-auto">

                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-lg truncate">Código</h3>
                  <p className="text-gray-600 text-base truncate">{spaceData.codigo}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-lg truncate">Tipo</h3>
                  <p className="text-gray-600 text-base truncate">
                    {spaceData.tipo}
                    {spaceData.tipoEspecifico && spaceData.tipoEspecifico !== spaceData.tipo && (
                      <span className="text-gray-500"> - {spaceData.tipoEspecifico}</span>
                    )}
                  </p>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-lg truncate">Piso</h3>
                  <p className="text-gray-600 text-base truncate">{spaceData.piso}</p>
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-gray-700 text-lg truncate">Equipos</h3>
                  <p className="text-gray-600 text-base truncate">{spaceData.cantidad_equipos}</p>
                </div>
              </div>
            </div>

            <div className="bg-gris-sutil p-4 md:p-6 rounded-lg">
              <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
              <p className="text-gray-600 text-base">
                {spaceData.descripcion || "Sin observaciones adicionales."}
              </p>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setActiveTab("availability")}
                className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition flex items-center gap-2"
              >
                Siguiente
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

                 {activeTab === "availability" && (
           <div>
             {/* Leyenda del calendario */}
                           <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">Leyenda del calendario:</h4>
                <div className="flex flex-wrap gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#00aab7] rounded"></div>
                    <span>Día seleccionado</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#d32f2f] border-2 border-[#b71c1c] rounded"></div>
                    <span>Día seleccionado sin disponibilidad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#f0f0f0] rounded"></div>
                    <span>Días anteriores (no disponibles)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#ffebee] border-2 border-[#f44336] rounded"></div>
                    <span>Sin disponibilidad</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    <span>Con disponibilidad</span>
                  </div>
                </div>
              </div>
             
             <Calendar
              localizer={localizer}
              events={filteredEvents}
              selectable="ignoreEvents"
              onSelectSlot={handleSlotSelect}
              date={selectedDate}
              onNavigate={handleNavigate}
              views={["month"]}
              style={{ height: 300 }}
              dayPropGetter={dayPropGetter}
              slotPropGetter={slotPropGetter}
              messages={{
                next: "Siguiente",
                previous: "Anterior",
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día",
                agenda: "Agenda",
                date: "Fecha",
                time: "Hora",
                event: "Evento",
                noEventsInRange: "No hay eventos en este rango.",
              }}
              formats={{
                monthHeaderFormat: "MMMM yyyy", // Nombre del mes y año en español
                weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(), // Días abreviados (LU, MA...)
                dayFormat: "d", // Día del mes
              }}
            />
            {renderTimeSelector()}
            {/* Campo de título y descripción de la reserva */}
            <div className="bg-white p-4 mt-1">
              {isCoworking ? (
                // Para espacios coworking: solo observaciones
                <>
                  <h3 className="text-lg font-semibold text-turquesa mb-3">Observaciones (opcional)</h3>
                  <textarea
                    value={reservationDescription}
                    onChange={(e) => setReservationDescription(e.target.value)}
                    placeholder="Ingrese observaciones adicionales (opcional)"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
                    rows="3"
                  />
                </>
              ) : (
                // Para otros espacios: título y descripción
                <>
                  <h3 className="text-lg font-semibold text-turquesa mb-1">Título de la reserva</h3>
                  <input
                    type="text"
                    value={reservationTitle}
                    onChange={(e) => setReservationTitle(e.target.value)}
                    placeholder="Ingrese el título de la reserva"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa mb-4"
                  />

                  <h3 className="text-lg font-semibold text-turquesa mb-3">Descripción de la reserva</h3>
                  <textarea
                    value={reservationDescription}
                    onChange={(e) => setReservationDescription(e.target.value)}
                    placeholder="Ingrese la descripción de la reserva"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
                    rows="3"
                  />
                </>
              )}
            </div>

            {/* Botón de confirmación */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleConfirmReservation}
                className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>
        )}
      </div>
      <LoadingSpinner loading={loading} />
    </div>
  );
};

export default ReservationModal;