import React, { useState, useEffect } from "react";
import { Calendar } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import {
  calendarCulture,
  calendarFormats,
  calendarLocalizer,
  calendarMessages
} from "../utils/calendarLocale";
/* import { generateRandomEvents } from "../services/eventGenerator"; */

const MobileCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    const generatedEvents = generateRandomEvents();
    setEvents(generatedEvents);
  }, []);

  useEffect(() => {
    const filtered = events.filter((event) =>
      format(new Date(event.start), "yyyy-MM-dd") ===
      format(selectedDate, "yyyy-MM-dd")
    );
    setFilteredEvents(filtered);
  }, [selectedDate, events]);

  const handleEdit = (eventId) => {
    alert(`Editar reserva con ID: ${eventId}`);
  };

  const handleCancel = (eventId) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta reserva?")) {
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
      alert("Reserva eliminada con éxito.");
    }
  };

  // Estilo personalizado para el día seleccionado
  const dayPropGetter = (date) => {
    if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      return {
        style: {
          backgroundColor: "#00aab7",
          color: "#fff",
          /* borderRadius: "50%", */
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
          localizer={calendarLocalizer}
          culture={calendarCulture}
          events={[]} // Sin mostrar eventos en el calendario
          date={selectedDate}
          onNavigate={(date) => setSelectedDate(date)} // Cambiar la fecha seleccionada
          views={["month"]}
          style={{ height: 300 }}
          dayPropGetter={dayPropGetter}
          messages={calendarMessages}
          formats={calendarFormats}
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
                      {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
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

export default MobileCalendarView;
