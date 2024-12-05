import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es"; // Idioma español
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configuración del localizador
const locales = {
  es, // Localización en español
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Generar eventos aleatorios
const generateRandomEvents = () => {
  const titles = [
    "Reserva de Sala A",
    "Reunión de Trabajo",
    "Clases de Matemáticas",
    "Reserva de Sala de Cómputo",
    "Laboratorio de Física",
    "Consulta Académica",
  ];

  const events = [];

  for (let i = 0; i < 10; i++) {
    // Generar fechas aleatorias dentro del mes actual
    const day = Math.floor(Math.random() * 28) + 1; // Día del mes
    const hour = Math.floor(Math.random() * 9) + 8; // Hora de inicio (8 AM - 5 PM)

    const start = new Date(2024, 11, day, hour, 0); // Diciembre de 2023
    const end = new Date(start);
    end.setHours(start.getHours() + 1); // Duración de 1 hora

    events.push({
      title: titles[Math.floor(Math.random() * titles.length)],
      start,
      end,
    });
  }

  return events;
};

const BigCalendarView = () => {
  const events = generateRandomEvents(); // Generar los eventos al renderizar el componente

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">React Big Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 600 }}
        culture="es" // Forzar idioma español
      />
    </div>
  );
};

export default BigCalendarView;
