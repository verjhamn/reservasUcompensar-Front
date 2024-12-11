import React from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
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
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }), // Comienza la semana el lunes
  getDay,
  locales,
});

// Generar eventos aleatorios para diciembre de 2024
const generateRandomEvents = () => {
  const salas = [
    "Sala Creativa",
    "Sala Ejecutiva",
    "Sala de Conferencias",
    "Sala de Capacitación",
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
  calendarContainer: "p-8 bg-gray-50 rounded-xl shadow-lg",
  header: "bg-gradient-to-r from-purple-600 to-indigo-500 text-white p-4 rounded-t-xl flex justify-between items-center",
  calendar: "bg-white rounded-lg overflow-hidden shadow-md",
};

// Header personalizado
const CustomToolbar = (toolbar) => {
  const goToBack = () => {
    toolbar.onNavigate("PREV");
  };

  const goToNext = () => {
    toolbar.onNavigate("NEXT");
  };

  const goToToday = () => {
    toolbar.onNavigate("TODAY");
  };

  return (
    <div className="flex justify-between items-center mb-4">
      <button
        onClick={goToBack}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Anterior
      </button>
      <span className="text-xl font-bold">{toolbar.label}</span>
      <button
        onClick={goToToday}
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Hoy
      </button>
      <button
        onClick={goToNext}
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
      >
        Siguiente
      </button>
    </div>
  );
};

const ModernCalendar = () => {
  return (
    <div className={customStyles.calendarContainer}>
      {/* Título */}
      <div className={customStyles.header}>
        <h2 className="text-2xl font-semibold">Calendario Moderno</h2>
      </div>

      {/* Calendario */}
      <div className={customStyles.calendar}>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={Views.MONTH} // Vista predeterminada
          views={{ month: true, week: true, day: true, agenda: true }} // Habilitar múltiples vistas
          components={{
            toolbar: CustomToolbar, // Encabezado personalizado
          }}
          style={{ height: 600, padding: "1rem" }}
          messages={{
            next: "Siguiente",
            previous: "Anterior",
            today: "Hoy",
            month: "Mes",
            week: "Semana",
            day: "Día",
            agenda: "Agenda",
            noEventsInRange: "No hay eventos en este rango.",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: "#7C3AED", // Morado vibrante para eventos
              color: "white",
              borderRadius: "10px",
              padding: "5px",
            },
          })}
        />
      </div>
    </div>
  );
};

export default ModernCalendar;
