/* eslint-disable react/prop-types */
import { useMemo, useRef, useState } from "react";
import { startOfMonth } from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import { ArrowPathIcon, TicketIcon } from "@heroicons/react/24/outline";
import "./reportsCalendar.css";
import MiniMonthNavigator from "./MiniMonthNavigator";
import CalendarFiltersPanel from "./CalendarFiltersPanel";
import EventDetailPanel from "./EventDetailPanel";
import { buildCalendarEvents, buildEventDateKeys, filterCalendarRows } from "./reportsCalendarUtils";

const renderEventContent = (eventInfo) => (
  <div className="flex items-center gap-1 overflow-hidden">
    {eventInfo.timeText && (
      <span className="shrink-0 text-[10px] font-bold opacity-80">{eventInfo.timeText}</span>
    )}
    <span className="truncate">{eventInfo.event.title}</span>
  </div>
);

const ReportsCalendar = ({ data, loading }) => {
  const calendarRef = useRef(null);
  const initialDateRef = useRef(new Date());
  // focusedDate: el día que el usuario eligió explícitamente en el mini-navegador (resaltado sólido).
  // visibleMonth: el mes que el mini-navegador muestra, sincronizado con la navegación del calendario principal.
  const [focusedDate, setFocusedDate] = useState(null);
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(initialDateRef.current));
  const [selectedRow, setSelectedRow] = useState(null);
  const [filters, setFilters] = useState({ soloProximos: true, estado: "", search: "" });

  const eventRows = useMemo(() => filterCalendarRows(data, filters), [data, filters]);
  const calendarEvents = useMemo(() => buildCalendarEvents(eventRows), [eventRows]);
  const eventDateKeys = useMemo(() => buildEventDateKeys(eventRows), [eventRows]);
  const showLoadingSkeleton = loading && !data.length;

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const handleSelectDate = (date) => {
    setFocusedDate(date);
    setVisibleMonth(startOfMonth(date));
    calendarRef.current?.getApi().gotoDate(date);
  };

  const handleMonthChange = (date) => setVisibleMonth(startOfMonth(date));

  const handleDatesSet = (arg) => {
    // Usar el punto medio del rango visible (no currentStart/activeStart) evita que el
    // relleno de días de otro mes en la vista de mes desalinee el mes mostrado en el mini-navegador.
    const midpoint = new Date((arg.start.getTime() + arg.end.getTime()) / 2);
    setVisibleMonth(startOfMonth(midpoint));
  };

  return (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-4">
      <div className="space-y-4 xl:col-span-1">
        <MiniMonthNavigator
          visibleMonth={visibleMonth}
          onMonthChange={handleMonthChange}
          focusedDate={focusedDate}
          onSelectDate={handleSelectDate}
          eventDates={eventDateKeys}
        />
        <CalendarFiltersPanel filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="xl:col-span-3">
        <div className="mb-4 flex items-center justify-between rounded-2xl border border-blue-light-100 bg-blue-light-50/70 px-4 py-3 text-sm text-blue-dark-600">
          <span>
            <span className="font-semibold">{eventRows.length}</span>{" "}
            {eventRows.length === 1 ? "evento" : "eventos"} de espacios para eventos
            {filters.soloProximos ? " próximos" : " (incluye pasados)"}
          </span>
        </div>

        {showLoadingSkeleton ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-3 rounded-2xl border border-gray-200 bg-white">
            <ArrowPathIcon className="h-8 w-8 animate-spin text-turquoise-500" />
            <p className="text-sm text-gray-500">Cargando calendario de eventos...</p>
          </div>
        ) : eventRows.length === 0 ? (
          <div className="flex min-h-[420px] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 text-center">
            <TicketIcon className="h-9 w-9 text-gray-300" aria-hidden="true" />
            <p className="text-sm font-semibold text-gray-600">No hay eventos que coincidan con los filtros actuales</p>
            <p className="text-xs text-gray-500">Ajusta la búsqueda, el estado, o activa &quot;Incluir pasados&quot;.</p>
          </div>
        ) : (
          <div className="uc-fullcalendar rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              locale={esLocale}
              initialView="dayGridMonth"
              initialDate={initialDateRef.current}
              headerToolbar={{ left: "prev,next today", center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay" }}
              height={700}
              slotMinTime="06:00:00"
              slotMaxTime="23:00:00"
              scrollTime="07:00:00"
              nowIndicator
              dayMaxEvents
              events={calendarEvents}
              eventContent={renderEventContent}
              eventClick={(info) => setSelectedRow(info.event.extendedProps.row)}
              datesSet={handleDatesSet}
            />
          </div>
        )}
      </div>

      <EventDetailPanel isOpen={Boolean(selectedRow)} row={selectedRow} onClose={() => setSelectedRow(null)} />
    </div>
  );
};

export default ReportsCalendar;
