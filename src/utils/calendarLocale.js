import { dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import es from "date-fns/locale/es";

const locales = { es };

const capitalizeFirstLetter = (value) => (
    value ? value.charAt(0).toUpperCase() + value.slice(1) : value
);

export const calendarCulture = "es";

export const calendarLocalizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

export const formatCalendarMonthHeader = (date) => (
    capitalizeFirstLetter(format(date, "MMMM 'de' yyyy", { locale: es }))
);

export const calendarMessages = {
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
};

export const calendarFormats = {
    monthHeaderFormat: formatCalendarMonthHeader,
    weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(),
    dayFormat: "d",
};
