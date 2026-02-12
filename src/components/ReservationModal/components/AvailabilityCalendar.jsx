import React from 'react';
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";

const locales = { es: es };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const AvailabilityCalendar = ({ events, date, onNavigate, onSelectSlot, dayPropGetter, slotPropGetter }) => {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            selectable="ignoreEvents"
            onSelectSlot={onSelectSlot}
            date={date}
            onNavigate={onNavigate}
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
                monthHeaderFormat: "MMMM yyyy",
                weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(),
                dayFormat: "d",
            }}
        />
    );
};

export default AvailabilityCalendar;
