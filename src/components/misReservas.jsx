import React, { useState, useEffect } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";
import { getMisReservas } from "../services/getMisReservas";
import { deleteReserva } from "../services/deleteReservaService";

const locales = { es: es };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

const BigCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [daysWithEvents, setDaysWithEvents] = useState(new Set());

  useEffect(() => {
    const fetchReservations = async () => {
      console.log("[misReservas] Cargando reservas del usuario...");
      try {
        const response = await getMisReservas();
        console.log("[misReservas] Reservas obtenidas:", response);

        const formattedEvents = response.flatMap(item => {
          if (item.espacio === null) {
            return [{
              id: item.id,
              idEspacio: item.codigo,
              title: item.titulo,
              start: new Date(item.hora_inicio),
              end: new Date(item.hora_fin),
              desc: item.descripcion,
            }];
          } else {
            return [{
              id: item.id,
              idEspacio: item.espacio.codigo,
              title: item.titulo,
              start: new Date(item.hora_inicio),
              end: new Date(item.hora_fin),
              desc: item.descripcion,
            }];
          }
        }).filter(Boolean);
        
        setEvents(formattedEvents);
        
        // Crear un Set con las fechas que tienen eventos
        const eventDays = new Set(
          formattedEvents.map(event => format(new Date(event.start), "yyyy-MM-dd"))
        );
        setDaysWithEvents(eventDays);
        
        console.log("[misReservas] Eventos formateados:", formattedEvents);
      } catch (error) {
        console.error("[misReservas] Error al cargar reservas:", error);
      }
    };

    fetchReservations();
  }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        format(new Date(event.start), "yyyy-MM-dd") ===
        format(selectedDate, "yyyy-MM-dd")
    );
    setFilteredEvents(filtered);
    console.log("[misReservas] Eventos filtrados por fecha:", filtered);
  }, [selectedDate, events]);

  const handleEdit = (eventId) => {
    console.log("[misReservas] Editar reserva con ID:", eventId);
    alert(`Editar reserva con ID: ${eventId} (Funcionalidad en desarrollo...)`);
  };

  const handleCancel = async (eventId) => {
    console.log("[misReservas] Intentando eliminar reserva con ID:", eventId);
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      try {
        await deleteReserva(eventId);
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        console.log("[misReservas] Reserva cancelada con éxito.");
        alert("Reserva cancelada con éxito.");
      } catch (error) {
        console.error("[misReservas] Error al eliminar la reserva:", error);
        alert("Hubo un error al eliminar la reserva. Por favor, inténtalo de nuevo.");
      }
    }
  };

  const dayPropGetter = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
    const hasEvents = daysWithEvents.has(dateStr);

    if (isSelected && hasEvents) {
      return {
        style: {
          backgroundColor: "#00aab7",
          color: "#fff",
          position: "relative",
          border: "2px solid #008a94"
        }
      };
    } else if (isSelected) {
      return {
        style: {
          backgroundColor: "#00aab7",
          color: "#fff"
        }
      };
    } else if (hasEvents) {
      return {
        style: {
          backgroundColor: "#a8e3ea",
          color: "#00aab7",
          fontWeight: "bold"
        }
      };
    }
    return {};
  };

  return (
    <div className="p-4 bg-gris-sutil rounded-lg shadow-lg">
      <div className="bg-white rounded-lg shadow-md mb-4">
        <Calendar
          localizer={localizer}
          events={[]}
          selectable
          onSelectSlot={(slotInfo) => setSelectedDate(slotInfo.start)}
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)}
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
            monthHeaderFormat: "MMMM yyyy",
            weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(),
            dayFormat: "d",
          }}
        />
      </div>

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
                    <p className="text-sm text-gris-medio">ID Reserva: {event.id}</p>
                    <p className="text-sm text-gris-medio">Codigo Espacio: {event.idEspacio}</p>
                    <p className="text-sm text-gris-medio">
                      {format(new Date(event.start), "HH:mm")} -{" "}
                      {format(new Date(event.end), "HH:mm")}
                    </p>
                    <p className="text-sm text-gris-medio">{event.desc}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel(event.id)}
                      className="text-sm text-white bg-fucsia px-3 py-1 rounded hover:bg-fucsia/90 transition"
                    >
                      Eliminar
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