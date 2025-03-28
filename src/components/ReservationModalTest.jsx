import React, { useState, useEffect } from "react";
import { format, startOfDay, isBefore } from "date-fns";
import es from "date-fns/locale/es";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";

import ModalHeader from "./ReservationModal/ModalHeader";
import Tabs from "./ReservationModal/Tabs";
import InfoTab from "./ReservationModal/InfoTab";
import AvailabilityTab from "./ReservationModal/AvailabilityTab";
import TimeSelector from "./ReservationModal/TimeSelector";
import ReservationDetails from "./ReservationModal/ReservationDetails";
import ConfirmButton from "./ReservationModal/ConfirmButton";

import { createReservation } from "../Services/createReservationService";
import { getUserId } from "../Services/authService";

const locales = { es };
const localizer = dateFnsLocalizer({
  format,
  startOfWeek: () => startOfDay(new Date()),
  getDay: (date) => date.getDay(),
  parse: (str) => new Date(str),
  locales,
});

const ReservationModal = ({ isOpen, onClose, spaceData, reservas, goToMyReservations }) => {
  const [activeTab, setActiveTab] = useState("info");
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservationTitle, setReservationTitle] = useState("");
  const [reservationDescription, setReservationDescription] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [selectedHours, setSelectedHours] = useState([]); // Agregar selectedHours al estado

  const isCoworking = spaceData?.coworking == "SI";

  useEffect(() => {
    if (spaceData && spaceData.reservas) {
      const eventsForSpace = spaceData.reservas.map(reserva => ({
        id: reserva.id,
        title: reserva.titulo,
        start: new Date(reserva.inicio.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
        end: new Date(reserva.fin.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
        desc: `Reservado por: ${reserva.usuario.nombre}`,
        usuario: reserva.usuario,
        estado: reserva.estado
      }));
      setFilteredEvents(eventsForSpace);
    }
  }, [spaceData]);

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

  const handleConfirmReservation = async () => {
    if (!reservationTitle.trim()) {
      alert("Por favor ingrese un título para la reserva");
      return;
    }

    let startDateTime, endDateTime;

    if (isCoworking) {
      // Lógica para coworking
    } else {
      // Lógica para no coworking
    }

    const formattedDate = format(selectedDate, "dd/MM/yyyy");
    const formattedStartTime = format(startDateTime, "HH:mm");
    const formattedEndTime = format(endDateTime, "HH:mm");

    const reservationData = {
      espacio_id: spaceData.id,
      espacio_type: "App\\Models\\basics\\EspacioCoworking",
      user_id: getUserId() || "1",
      titulo: reservationTitle,
      descripcion: reservationDescription || "",
      fecha_reserva: formattedDate,
      hora_inicio: formattedStartTime,
      hora_fin: formattedEndTime,
      observaciones: reservationDescription || ""
    };

    console.log("Intentando crear reserva con datos:", JSON.stringify(reservationData, null, 2));

    try {
      const response = await createReservation(reservationData);
      if (response.status === "success") {
        alert("Reserva confirmada con éxito");
        onClose();
        goToMyReservations();
      } else {
        throw new Error(response.message || "Error al crear la reserva");
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 21; hour++) {
      slots.push(`${hour}:00`);
      slots.push(`${hour}:30`);
    }
    return slots;
  };

  const isTimeSlotAvailable = (timeSlot) => {
    const slotDate = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${timeSlot}`);

    return !filteredEvents.some(event =>
      slotDate >= new Date(event.start) &&
      slotDate < new Date(event.end)
    );
  };

  const handleTimeSelect = (time) => {
    if (selectedHours.includes(time)) {
      setSelectedHours(prev => prev.filter(h => h !== time));
    } else {
      // Convertimos todas las horas a números para ordenarlas
      const allHours = [...selectedHours, time].map(h => parseInt(h.split(':')[0]));
      const min = Math.min(...allHours);
      const max = Math.max(...allHours);

      // Verificamos si las horas son consecutivas
      if (max - min + 1 !== allHours.length) {
        alert("Las horas seleccionadas deben ser consecutivas");
        return;
      }

      setSelectedHours(prev => [...prev, time].sort());
    }
  };

  const coworkingPeriods = [
    { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
    { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
    { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
    { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
  ];

  const renderTimeSelector = () => {
    if (isCoworking) {
      return (
        <TimeSelector
          timeSlots={coworkingPeriods}
          handleTimeSelect={setSelectedPeriod}
        />
      );
    }

    return (
      <div className="bg-white p-4 mt-4">
        <h3 className="text-lg font-semibold text-turquesa mb-3">Seleccionar horario</h3>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
          {generateTimeSlots().map((time) => (
            <button
              key={time}
              onClick={() => handleTimeSelect(time)}
              disabled={!isTimeSlotAvailable(time)}
              className={`
                p-2 rounded-md text-sm
                ${selectedHours.includes(time)
                  ? 'bg-turquesa text-white'
                  : isTimeSlotAvailable(time)
                    ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {time}
            </button>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen || !spaceData) return null;

  const dayPropGetter = (date) => {
    if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
      return { className: "bg-turquesa text-white" };
    }
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return { className: "bg-gray-200 text-gray-400 cursor-not-allowed" };
    }
    return {};
  };

  const handleNavigate = (date) => {
    if (isBefore(startOfDay(date), startOfDay(new Date()))) {
      return;
    }
    setSelectedDate(date);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-6xl w-full max-h-[95vh] overflow-auto">
        <ModalHeader title="Detalles del Espacio" onClose={onClose} />
        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
        {activeTab === "info" && <InfoTab spaceData={spaceData} setActiveTab={setActiveTab} />}
        {activeTab === "availability" && (
          <AvailabilityTab
            filteredEvents={filteredEvents}
            selectedDate={selectedDate}
            handleSlotSelect={handleSlotSelect}
            handleNavigate={handleNavigate}
            dayPropGetter={dayPropGetter}
            renderTimeSelector={renderTimeSelector}
            localizer={localizer}
            reservationTitle={reservationTitle}
            setReservationTitle={setReservationTitle}
            reservationDescription={reservationDescription}
            setReservationDescription={setReservationDescription}
            handleConfirmReservation={handleConfirmReservation}
          />
        )}
      </div>
    </div>
  );
};

export default ReservationModal;
