import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";

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

// Generar eventos aleatorios para diciembre de 2024
const generateRandomEvents = () => {
  const salas = [
    "Sala de Reuniones A",
    "Sala de Conferencias B",
    "Sala de Capacitación C",
    "Sala de Reuniones D",
    "Sala Ejecutiva",
  ];

  const events = [];
  for (let day = 1; day <= 31; day++) {
    const numEvents = Math.floor(Math.random() * 4) + 2; // Generar entre 2 y 5 eventos por día
    for (let i = 0; i < numEvents; i++) {
      const randomSala = salas[Math.floor(Math.random() * salas.length)];
      const randomHour = Math.floor(Math.random() * 9) + 8; // Hora entre 8 AM y 6 PM
      const randomDuration = Math.floor(Math.random() * 3) + 1; // Duración entre 1 y 3 horas

      const start = new Date(2024, 11, day, randomHour, 0); // Mes 11 es diciembre
      const end = new Date(2024, 11, day, randomHour + randomDuration, 0);

      events.push({
        title: randomSala,
        start,
        end,
        desc: `Reserva en ${randomSala}`,
      });
    }
  }

  return events;
};

const initialEvents = generateRandomEvents(); // Generamos eventos aleatorios

const BigCalendarView = () => {
  const [events, setEvents] = useState(initialEvents); // Estado para los eventos visibles
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda

  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Convertir el término a minúsculas
    setSearchTerm(term);

    // Filtrar eventos según el término
    const filteredEvents = initialEvents.filter(
      (event) =>
        event.title.toLowerCase().includes(term) ||
        (event.desc && event.desc.toLowerCase().includes(term))
    );
    setEvents(filteredEvents);
  };

  return (
    <div className="p-8 bg-gray-100 rounded-xl shadow-lg">
      {/* Título y buscador */}
      <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white p-4 rounded-t-xl mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Calendario de Reservas</h2>
        <input
          type="text"
          placeholder="Buscar eventos..."
          value={searchTerm}
          onChange={handleSearch}
          className="p-2 rounded bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
      </div>

      {/* Calendario */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md">
        <Calendar
          localizer={localizer}
          events={events}
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
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#FFD580", // Naranja claro para eventos
              color: "#333", // Texto oscuro
              borderRadius: "8px",
              padding: "5px",
              border: "1px solid #FFA500", // Borde naranja más oscuro
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          })}
        />
      </div>
    </div>
  );
};

export default BigCalendarView;
