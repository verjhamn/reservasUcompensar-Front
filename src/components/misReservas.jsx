import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import { getMisReservas } from "../services/getMisReservas"; 
import { deleteReserva } from "../services/deleteReservaService";

// Configuración de localización en español
const locales = { es: es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const BigCalendarView = () => {
  const [events, setEvents] = useState([]); // Eventos cargados desde el backend
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]); // Eventos filtrados por fecha

  // Obtener las reservas del usuario autenticado
  useEffect(() => {
    const fetchReservations = async () => {
      console.log("[BigCalendarView] Cargando reservas del usuario...");
      try {
        const reservas = await getMisReservas(); // Llamar al servicio
        console.log("[BigCalendarView] Reservas obtenidas:", reservas);

        // Convertir reservas al formato del calendario
        const formattedEvents = reservas.map((reserva) => ({
          id: reserva.id,
          title: reserva.titulo,
          start: new Date(reserva.hora_inicio),
          end: new Date(reserva.hora_fin),
          desc: reserva.descripcion,
        }));

        setEvents(formattedEvents);
        console.log("[BigCalendarView] Eventos formateados:", formattedEvents);
      } catch (error) {
        console.error("[BigCalendarView] Error al cargar reservas:", error);
      }
    };

    fetchReservations();
  }, []);

  // Filtrar eventos según la fecha seleccionada
  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        format(new Date(event.start), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );
    setFilteredEvents(filtered);
    console.log("[BigCalendarView] Eventos filtrados por fecha:", filtered);
  }, [selectedDate, events]);

  const handleEdit = (eventId) => {
    console.log("[BigCalendarView] Editar reserva con ID:", eventId);
    alert(`Editar reserva con ID: ${eventId}`);
  };

  const handleCancel = async (eventId) => {
    console.log("[BigCalendarView] Intentando cancelar reserva con ID:", eventId);
    if (window.confirm("¿Estás seguro de que deseas cancelar esta reserva?")) {
      try {
        await deleteReserva(eventId);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        console.log("[BigCalendarView] Reserva cancelada con éxito.");
        alert("Reserva cancelada con éxito.");
      } catch (error) {
        console.error("[BigCalendarView] Error al cancelar la reserva:", error);
        alert("Hubo un error al cancelar la reserva. Por favor, inténtalo de nuevo.");
      }
    }
  };

  // Estilo personalizado para el día seleccionado
  const dayPropGetter = (date) => {
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

  return (
    <div className="p-4 bg-gris-sutil rounded-lg shadow-lg">
      {/* Selector de fecha (calendario reducido) */}
      <div className="bg-white rounded-lg shadow-md mb-4">
        <Calendar
          localizer={localizer}
          events={[]} // Sin mostrar eventos en el calendario
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)} // Cambiar la fecha seleccionada
          views={["month"]}
          style={{ height: 300 }}
          dayPropGetter={dayPropGetter}
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
            weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(),
            dayFormat: "d", // Día del mes
          }}
        />
      </div>

      {/* Lista de eventos */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-turquesa mb-3">
          Reservas del {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
        </h3>

        {filteredEvents.length > 0 ? (
          <ul className="space-y-4">
            {filteredEvents.map((event) => (
              <li key={event.id} className="border-b pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-semibold text-gris-medio">
                      {event.title}
                    </h4>
                    <p className="text-sm text-gris-medio">
                      {format(new Date(event.start), "HH:mm")} -{" "}
                      {format(new Date(event.end), "HH:mm")}
                    </p>
                    <p className="text-sm text-gris-medio">{event.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Botón de editar */}
                    <button
                      onClick={() => handleEdit(event.id)}
                      className="text-sm text-white bg-turquesa px-3 py-1 rounded hover:bg-turquesa/90 transition"
                    >
                      Editar
                    </button>
                    {/* Botón de cancelar */}
                    <button
                      onClick={() => handleCancel(event.id)}
                      className="text-sm text-white bg-fucsia px-3 py-1 rounded hover:bg-fucsia/90 transition"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gris-medio">No hay reservas para este día.</p>
        )}
      </div>
    </div>
  );
};

export default BigCalendarView;
