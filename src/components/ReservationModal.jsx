import React, { useState, useEffect } from "react";
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

const ReservationModal = ({ isOpen, onClose, spaceData, reservas }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    if (spaceData && reservas) {
      const eventsForSpace = reservas.filter(
        (reserva) => reserva.idEspacio === spaceData.idEspacio
      );
      setFilteredEvents(
        eventsForSpace.map((reserva) => ({
          title: reserva.titulo,
          start: new Date(reserva.inicio),
          end: new Date(reserva.fin),
        }))
      );
    }
  }, [spaceData, reservas]);

  const handleSlotSelect = (slotInfo) => {
    const isSlotOccupied = filteredEvents.some(
      (event) =>
        new Date(slotInfo.start) < new Date(event.end) &&
        new Date(slotInfo.end) > new Date(event.start)
    );

    if (!isSlotOccupied) {
      setSelectedSlot(slotInfo);
    } else {
      alert("Este horario ya está ocupado. Por favor seleccione otro.");
    }
  };

  const handleConfirmReservation = () => {
    if (selectedSlot) {
      const newReservation = {
        idEspacio: spaceData.idEspacio,
        titulo: `Reserva para ${spaceData.espaciofisico}`,
        inicio: selectedSlot.start.toISOString(),
        fin: selectedSlot.end.toISOString(),
        idUsuario: "U001", // Simulado
        nombreUsuario: "Juan Pérez", // Simulado
        correoUsuario: "juan.perez@example.com", // Simulado
      };

      console.log("Reserva enviada al backend:", newReservation);
      alert("Reserva confirmada con éxito.");
      onClose();
    } else {
      alert("Por favor seleccione un horario antes de confirmar.");
    }
  };

  if (!isOpen || !spaceData) return null;

  const dayPropGetter = (date) => {
    if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      return {
        style: {
          backgroundColor: "#00aab7",
          color: "#fff",
          /* borderRadius: "50%", */
        },
      };
    }
    return {};
  }

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

        {/* Tabs */}
        <div className="border-b mb-6">
          <button
            onClick={() => setActiveTab("info")}
            className={`py-2 px-4 ${activeTab === "info"
              ? "border-b-2 border-turquesa font-bold text-turquesa"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Información
          </button>
          <button
            onClick={() => setActiveTab("availability")}
            className={`py-2 px-4 ${activeTab === "availability"
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
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="w-full md:w-2/3">
                <img
                  src={spaceData.image}
                  alt={spaceData.espaciofisico}
                  className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                />
              </div>
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
                {/*          <div className="col-span-2 md:col-span-1">
                  <h3 className="font-semibold text-gray-700 text-lg">Horario</h3>
                  <p className="text-gray-600 text-base">
                    {spaceData.horainicio} - {spaceData.horafinal}
                  </p>
                </div> */}
              </div>
            </div>

            <div className="bg-gris-sutil p-4 md:p-6 rounded-lg">
              <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
              <p className="text-gray-600 text-base">
                <em>Descripción genérica del espacio disponible.</em>
              </p>
            </div>
          </div>
        )}

        {activeTab === "availability" && (
          <div className="bg-white rounded-lg shadow-md mb-4">
            <Calendar
              localizer={localizer}
              events={[]} // Sin mostrar eventos en el calendario
              selectable
              onSelectSlot={handleSlotSelect}
              date={new Date()}
              onNavigate={(date) => setSelectedDate(date)} // Cambiar la fecha seleccionada
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
                weekdayFormat: (date) =>
                  format(date, "EE", { locale: es }).toUpperCase(),
                dayFormat: "d",
              }}
            />
            {/* Lista de eventos */}
            <div className="bg-white p-4">
              <h3 className="text-lg font-semibold text-turquesa mb-3">
                Reservas del {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
              </h3>

              {filteredEvents.length > 0 ? (
                <ul className="space-y-4">
                  {filteredEvents.map((event) => (
                    <li key={event.id} className="border-b pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-base font-semibold text-gris-medio">
                            {event.title}
                          </h4>
                          <p className="text-sm text-gris-medio">
                            {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                          </p>
                          <p className="text-sm text-gris-medio">{event.desc}</p>
                        </div>
                        <div className="flex gap-2">
                          {/* Botón de editar */}
                          <button
                            onClick={() => handleEdit(event.id)}
                            className="text-sm text-white bg-turquesa px-3 py-1 rounded hover:bg-turquesa/90 transition"
                          >
                            Editar
                          </button>
                          {/* Botón de cancelar */}
                          <button
                            onClick={() => handleCancel(event.id)}
                            className="text-sm text-white bg-fucsia px-3 py-1 rounded hover:bg-fucsia/90 transition"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gris-medio">No hay reservas para este día.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleConfirmReservation}
                className="px-6 py-3 text-base m-2 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition-colors"
              >
                Confirmar Reserva
              </button>
            </div>
          </div>

        )}
      </div>
    </div>
  );
};

export default ReservationModal;
