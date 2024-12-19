import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { generateRandomEvents, salas } from '../services/eventGenerator';
import EventsTable from './EventsTable';

const FullCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 7;

  useEffect(() => {
    const generatedEvents = generateRandomEvents();
    setEvents(generatedEvents);
  }, []);

  const handleDateSelect = (selectInfo) => {
    const title = prompt('Por favor seleccione una sala:', salas.join('\n'));
    if (title && salas.includes(title)) {
      const newEvent = {
        title,
        start: selectInfo.startStr,
        end: selectInfo.endStr,
        allDay: selectInfo.allDay,
      };
      setEvents([...events, newEvent]);
    } else if (title) {
      alert('Por favor seleccione una sala válida');
    }
  };

  const handleEventClick = (clickInfo) => {
    if (confirm(`¿Desea eliminar la reserva de ${clickInfo.event.title}?`)) {
      clickInfo.event.remove();
      const updatedEvents = events.filter(event =>
        event.title !== clickInfo.event.title ||
        event.start !== clickInfo.event.startStr
      );
      setEvents(updatedEvents);
    }
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedEvents = [...filteredEvents].sort((a, b) =>
    new Date(a.start) - new Date(b.start)
  );

  const totalPages = Math.ceil(sortedEvents.length / eventsPerPage);
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = sortedEvents.slice(indexOfFirstEvent, indexOfLastEvent);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-turquesa mb-2">Calendario de Reservas</h2>
        <p className="text-gris-medio">Haga clic en una fecha para crear una reserva</p>
      </div>
      
      <div className="grid grid-cols-[1fr_auto] gap-4">
        {/* Columna del Calendario */}
        <div className="bg-white rounded-lg overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="dayGridMonth"
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={events}
            select={handleDateSelect}
            eventClick={handleEventClick}
            locale={esLocale}
            slotMinTime="07:00:00"
            slotMaxTime="21:00:00"
            allDaySlot={false}
            slotDuration="00:30:00"
            eventTimeFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
            }}
            height="auto"
            /** Estilos personalizados para eventos */
            eventContent={(eventInfo) => {
              // Vista mensual
              if (eventInfo.view.type === 'dayGridMonth') {
                return (
                  <div
                    className="bg-turquesa text-gris-claro font-bold rounded-md text-xs p-1 shadow-md"
                  >
                    {eventInfo.event.title}
                  </div>
                );
              }

              // Otras vistas (semana/día)
              return (
                <div
                  className="bg-turquesa text-gris-claro font-semibold rounded-md text-sm p-2"
                >
                  <div>{eventInfo.event.title}</div>
                  {eventInfo.event.extendedProps && (
                    <div className="text-xs">
                      <div>Capacidad: {eventInfo.event.extendedProps.capacity} personas</div>
                      <div>Ubicación: {eventInfo.event.extendedProps.location}</div>
                    </div>
                  )}
                </div>
              );
            }}
          />
        </div>

        {/* Columna de la Agenda */}
        <EventsTable 
          events={currentEvents}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          indexOfFirstEvent={indexOfFirstEvent}
          indexOfLastEvent={indexOfLastEvent}
          totalEvents={sortedEvents.length}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default FullCalendarView;
