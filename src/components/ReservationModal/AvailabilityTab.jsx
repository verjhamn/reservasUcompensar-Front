import React from "react";
import { Calendar } from "react-big-calendar";
import { format } from "date-fns";
import es from "date-fns/locale/es";

const AvailabilityTab = ({
    filteredEvents,
    selectedDate,
    handleSlotSelect,
    handleNavigate,
    dayPropGetter,
    renderTimeSelector,
    localizer,
    reservationTitle,
    setReservationTitle,
    reservationDescription,
    setReservationDescription,
    handleConfirmReservation,
}) => (
    <div>
        <Calendar
            localizer={localizer}
            events={filteredEvents}
            selectable
            onSelectSlot={handleSlotSelect}
            date={selectedDate}
            onNavigate={handleNavigate}
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
                monthHeaderFormat: "MMMM yyyy", // Nombre del mes y año en español
                weekdayFormat: (date) => format(date, "EE", { locale: es }).toUpperCase(), // Días abreviados (LU, MA...)
                dayFormat: "d", // Día del mes
            }}
        />
        {renderTimeSelector()}
        {/* Campo de título y descripción de la reserva */}
        <div className="bg-white p-4 mt-1">
            <h3 className="text-lg font-semibold text-turquesa mb-1">Título de la reserva</h3>
            <input
                type="text"
                value={reservationTitle}
                onChange={(e) => setReservationTitle(e.target.value)}
                placeholder="Ingrese el título de la reserva"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa mb-4"
            />

            <h3 className="text-lg font-semibold text-turquesa mb-3">Descripción de la reserva</h3>
            <textarea
                value={reservationDescription}
                onChange={(e) => setReservationDescription(e.target.value)}
                placeholder="Ingrese la descripción de la reserva"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
                rows="3"
            />
        </div>

        {/* Botón de confirmación */}
        <div className="mt-4 flex justify-end">
            <button
                onClick={handleConfirmReservation}
                className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition"
            >
                Confirmar Reserva
            </button>
        </div>
    </div>
);

export default AvailabilityTab;