import React from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';

const locales = { es: es };
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
    getDay,
    locales,
});

const ReservationCalendar = ({
    events,
    selectedDate,
    onSelectDate
}) => {
    const dayPropGetter = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
        const hasEvents = events.some(event =>
            format(new Date(event.start), "yyyy-MM-dd") === dateStr
        );

        if (isSelected && hasEvents) {
            return {
                style: {
                    backgroundColor: "#9333ea",
                    color: "#fff",
                    position: "relative",
                    border: "2px solid #7e22ce"
                }
            };
        } else if (isSelected) {
            return {
                style: {
                    backgroundColor: "#9333ea",
                    color: "#fff"
                }
            };
        } else if (hasEvents) {
            return {
                style: {
                    backgroundColor: "#f3e8ff",
                    color: "#9333ea",
                    fontWeight: "bold"
                }
            };
        }
        return {};
    };

    return (
        <div className="p-4 bg-white rounded-2xl shadow-xl border border-neutral-100">
            <Calendar
                localizer={localizer}
                events={[]}
                selectable
                onSelectSlot={(slotInfo) => onSelectDate(slotInfo.start)}
                date={selectedDate}
                onNavigate={(date) => onSelectDate(date)}
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
    );
};

export default ReservationCalendar;
