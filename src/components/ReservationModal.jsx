import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";

const ReservationModal = ({ isOpen, onClose, spaceData }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [events, setEvents] = useState([
    {
      title: "Sala Reservada",
      start: new Date(2024, 12, 25, 10, 0),
      end: new Date(2024, 12, 25, 12, 0),
    },
    {
      title: "Sala Reservada",
      start: new Date(2024, 12, 19, 14, 0),
      end: new Date(2024, 12, 19, 16, 0),
    },
    {
      title: "Sala Reservada",
      start: new Date(2024, 12, 20, 9, 0),
      end: new Date(2024, 12, 20, 10, 30),
    },
  ]);

  if (!isOpen || !spaceData) return null;

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleDateSelect = (selectInfo) => {
    const title = prompt("Ingrese un título para la reserva:");
    if (title) {
      const newEvent = {
        title,
        start: selectInfo.start,
        end: selectInfo.end,
        allDay: false,
      };
      setEvents([...events, newEvent]);
    }
  };

  const handleEventClick = (clickInfo) => {
    if (confirm(`¿Desea eliminar la reserva de ${clickInfo.event.title}?`)) {
      clickInfo.event.remove();
      setEvents(events.filter((event) => event !== clickInfo.event));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[95vh] overflow-auto">
        {/* Header del Modal */}
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Detalles del Espacio</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        {/* Pestañas */}
        <div className="border-b mb-6">
          <button
            onClick={() => handleTabClick("info")}
            className={`py-2 px-4 ${activeTab === "info"
              ? "border-b-2 border-turquesa font-bold text-turquesa"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Información
          </button>
          <button
            onClick={() => handleTabClick("calendar")}
            className={`py-2 px-4 ${activeTab === "calendar"
              ? "border-b-2 border-turquesa font-bold text-turquesa"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Disponibilidad
          </button>
        </div>

        {/* Contenido de las pestañas */}
        {activeTab === "info" && (
          <div className="space-y-6">
            {/* Sección principal */}
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-2/3">
                <img
                  src={spaceData.image}
                  alt={spaceData.espaciofisico}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>

              {/* Información dividida en columnas */}
              <div className="w-full md:w-1/3 grid grid-cols-2 md:grid-cols-1 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg">Sede</h3>
                  <p className="text-gray-600 text-base">{spaceData.sede}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg">Ubicación</h3>
                  <p className="text-gray-600 text-base">{spaceData.localidad}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg">Espacio</h3>
                  <p className="text-gray-600 text-base">{spaceData.espaciofisico}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 text-lg">Recurso</h3>
                  <p className="text-gray-600 text-base">{spaceData.recurso}</p>
                </div>
                <div className="col-span-2 md:col-span-1">
                  <h3 className="font-semibold text-gray-700 text-lg">Horario</h3>
                  <p className="text-gray-600 text-base">
                    {spaceData.horainicio} - {spaceData.horafinal}
                  </p>
                </div>
              </div>
            </div>

            {/* Información adicional */}
            <div className="bg-gris-sutil p-4 md:p-6 rounded-lg">
              <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
              <p className="text-gray-600 text-base">
                <em>Descripción genérica del espacio disponible.</em>
              </p>
            </div>
          </div>
        )}



        {activeTab === "calendar" && (
          <div>
            <FullCalendar
              plugins={[timeGridPlugin, interactionPlugin]}
              initialView="timeGridWeek"
              hiddenDays={[0]} // Ocultar domingos
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "timeGridWeek,timeGridDay",
              }}
              events={events}
              locale={esLocale}
              slotMinTime="07:00:00"
              slotMaxTime="21:00:00"
              allDaySlot={false}
              slotDuration="00:30:00"
              selectable={true}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventBackgroundColor="#00aab7"
              eventBorderColor="#00aab7"
              eventTextColor="#f6f7f2"
              buttonText={{
                today: "Hoy",
                week: "Semana",
                day: "Día",
              }}
              height="auto"
              eventContent={(eventInfo) => (
                <div className="p-1">
                  <div className="font-semibold">{eventInfo.event.title}</div>
                  <div className="text-xs">
                    {new Date(eventInfo.event.start).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              )}
            />
          </div>
        )}

        {/* Footer del Modal */}
        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
          <button
            onClick={() => {
              alert("Reserva confirmada con éxito");
              onClose();
            }}
            className="px-6 py-3 text-base bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition-colors"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal;
