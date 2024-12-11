import React from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es"; // Español

// Configuración de localización en español
const locales = {
  es: es,
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Semana comienza el lunes
  getDay,
  locales,
});

// Generar eventos aleatorios para diciembre de 2024
const generateRandomEvents = () => {
  const salas = [
    "Sala Ejecutiva",
    "Sala Creativa",
    "Sala de Conferencias",
    "Sala de Capacitación",
    "Sala de Reuniones A",
  ];

  const events = [];
  for (let day = 1; day <= 31; day++) {
    const numEvents = Math.floor(Math.random() * 3) + 2; // 2 a 4 eventos por día
    for (let i = 0; i < numEvents; i++) {
      const randomSala = salas[Math.floor(Math.random() * salas.length)];
      const randomHour = Math.floor(Math.random() * 9) + 8; // 8 AM a 6 PM
      const randomDuration = Math.floor(Math.random() * 3) + 1; // Duración: 1 a 3 horas

      const start = new Date(2024, 11, day, randomHour, 0); // Mes 11: diciembre
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

const events = generateRandomEvents(); // Generamos eventos aleatorios

// Estilos personalizados
const customStyles = {
  calendarContainer: "p-8 bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl shadow-lg",
  header: "bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white p-4 rounded-t-xl",
  calendar: "bg-white rounded-lg overflow-hidden shadow-md",
};

const ModernCalendar = () => {
  return (
    <div className={customStyles.calendarContainer}>
      {/* Título */}
      <div className={customStyles.header}>
        <h2 className="text-center text-2xl font-semibold tracking-wide">Calendario Moderno</h2>
      </div>

      {/* Calendario */}
      <div className={customStyles.calendar}>
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
              backgroundColor: "#FFA500", // Morado oscuro para eventos
              color: "white",
              borderRadius: "10px",
              padding: "5px",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            },
          })}
        />
      </div>
    </div>
  );
};

export default ModernCalendar;
