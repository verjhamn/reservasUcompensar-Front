import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import { generateRandomEvents } from '../services/eventGenerator';

// Configuración de localización en español
const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const BigCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [allEvents, setAllEvents] = useState([]);

  useEffect(() => {
    const generatedEvents = generateRandomEvents();
    setEvents(generatedEvents);
    setAllEvents(generatedEvents);
  }, []);

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (term.trim() === '') {
      setEvents(allEvents); // Si la búsqueda está vacía, mostramos todos los eventos
    } else {
      // Filtrar eventos según el término
      const filteredEvents = allEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(term) ||
          (event.desc && event.desc.toLowerCase().includes(term))
      );
      setEvents(filteredEvents);
    }
  };

  // Convertir las fechas ISO a objetos Date
  const formattedEvents = events.map(event => ({
    ...event,
    start: new Date(event.start),
    end: new Date(event.end)
  }));

  const eventStyleGetter = (event, start, end, isSelected, view) => {
    // Si estamos en vista agenda, retornamos null para usar el estilo predeterminado
    if (view === 'agenda') return {};

    // Estilo base común para todos los eventos
    const baseStyle = {
      backgroundColor: "#00aab7", // turquesa
      color: "#f6f7f2", // gris-claro
      borderRadius: "4px",
      border: "none",
      fontSize: "0.875rem",
      fontWeight: "500",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
    };

    // Estilos específicos para la vista mensual
    const monthViewStyle = {
      ...baseStyle,
      padding: "2px 5px",
      marginBottom: "2px",
      height: "auto",
      minHeight: "25px",
      display: "flex",
      alignItems: "center",
    };

    // Estilos específicos para las vistas de semana y día
    const timeViewStyle = {
      ...baseStyle,
      padding: "4px 8px",
      height: "100%",
      marginLeft: "2px",
      marginRight: "2px",
      border: "1px solid #3182ce",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    };

    // Determinar si estamos en vista de mes
    const isMonthView = view === 'month';

    return {
      style: isMonthView ? monthViewStyle : timeViewStyle
    };
  };

  return (
    <div className="p-8 bg-gris-sutil rounded-xl shadow-lg">
      {/* Título y buscador */}
      <div className="bg-turquesa text-gris-claro p-4 rounded-t-xl mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendario de Reservas</h2>
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 rounded bg-white text-gris-medio shadow-md focus:outline-none focus:ring-2 focus:ring-fucsia"
        />
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <Calendar
          localizer={localizer}
          events={formattedEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 600, padding: "1rem" }}
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
          eventPropGetter={eventStyleGetter}
          formats={{
            monthHeaderFormat: 'MMMM yyyy',
            dayHeaderFormat: 'cccc dd',
            dayRangeHeaderFormat: ({ start, end }) =>
              `${format(start, 'dd MMM')} - ${format(end, 'dd MMM')}`,
            agendaDateFormat: 'dd/MM/yyyy',
            agendaTimeFormat: 'HH:mm',
            agendaTimeRangeFormat: ({ start, end }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
          }}
          components={{
            event: (props) => {
              // Si estamos en vista agenda, retornamos null para usar el componente predeterminado
              if (props.view === 'agenda') return null;

              return (
                <div className="h-full">
                  <div className="font-semibold">{props.event.title}</div>
                  {!props.event.allDay && props.event.capacity && (
                    <div className="text-xs opacity-90">
                      Capacidad: {props.event.capacity}
                    </div>
                  )}
                </div>
              );
            }
          }}
          popup
          popupOffset={30}
          showMultiDayTimes
          step={30}
          timeslots={2}
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 21, 0, 0)}
        />
      </div>

      {/* Leyenda */}
      <div className="mt-4 p-4 bg-white rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-2 text-turquesa">Información</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-turquesa rounded mr-2"></div>
            <span className="text-sm text-gris-medio">Reserva activa</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gris-sutil border border-gris-medio rounded mr-2"></div>
            <span className="text-sm text-gris-medio">Horario disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BigCalendarView;
