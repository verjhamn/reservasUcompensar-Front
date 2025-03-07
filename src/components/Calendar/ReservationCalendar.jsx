import React, { useMemo } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import es from 'date-fns/locale/es';
import ReservationList from './ReservationList';

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
    onSelectDate,
    onCancelReservation,
    showStatus = false
}) => {
    // Filtrar eventos por fecha seleccionada
    const filteredEvents = useMemo(() => {
        return events.filter(event =>
            format(new Date(event.hora_inicio), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
        );
    }, [events, selectedDate]);

    const dayPropGetter = (date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
        const hasEvents = events.some(event =>
            format(new Date(event.start), "yyyy-MM-dd") === dateStr
        );

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
            <div className="p-2 bg-white rounded-lg shadow-md mb-4">
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
            <ReservationList
                selectedDate={selectedDate}
                events={filteredEvents}
                onCancelReservation={onCancelReservation}
                showStatus={showStatus}
            />
        </div>
    );
};

export default ReservationCalendar;
