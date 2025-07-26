import React, { useState, useEffect } from "react";
import { Toaster } from 'react-hot-toast';
import { getMisReservas } from "../Services/getMisReservas";
import { deleteReserva } from "../Services/deleteReservaService";
import { realizarCheckOut } from "../Services/checkInService";
import { showConfirmation, showSuccessToast, showErrorToast } from './UtilComponents/Confirmation';
import MyReservationList from './Calendar/MyReservationList';
import ReservationCalendar from './Calendar/ReservationCalendar';
import CheckOutModal from './CheckOutModal';
import { format } from 'date-fns';

const BigCalendarView = () => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showCheckOutModal, setShowCheckOutModal] = useState(false);
  const [reservaCheckOut, setReservaCheckOut] = useState(null);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await getMisReservas();
        const formattedEvents = response.map(item => ({
          id: item.id,
          type: item.espacio.key || 'Coworking',
          idEspacio: item.espacio.codigo,
          title: item.titulo,
          descripcion: item.descripcion,
          start: new Date(item.hora_inicio),
          end: new Date(item.hora_fin),
          hora_inicio: item.hora_inicio,
          hora_fin: item.hora_fin,
          estado: item.estado,
          espacio: item.espacio
        }));

        setEvents(formattedEvents);
      } catch (error) {
        console.error("[misReservas] Error al cargar reservas:", error);
        showErrorToast('Error al cargar las reservas');
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (eventId) => {
    try {
      const confirmed = await showConfirmation(
        () => { },
        "¿Estás seguro de que deseas cancelar esta reserva?"
      );

      if (confirmed) {
        await deleteReserva(eventId);
        setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
        showSuccessToast('Reserva cancelada con éxito');
      }
    } catch (error) {
      console.error("[misReservas] Error al cancelar la reserva:", error);
      showErrorToast('Error al cancelar la reserva');
    }
  };

  const handleCheckOut = (reserva) => {
    const ahora = new Date();
    const inicioReserva = new Date(reserva.hora_inicio);
    const finReserva = new Date(reserva.hora_fin);
    
    // Verificar que la reserva esté en el horario actual y tenga estado "Confirmada"
    if (reserva.estado === "Confirmada" && 
        inicioReserva <= ahora && 
        finReserva >= ahora) {
      setReservaCheckOut(reserva);
      setShowCheckOutModal(true);
    } else {
      showErrorToast('Solo puedes hacer check-out de reservas confirmadas en el horario actual');
    }
  };

  const handleCloseCheckOutModal = (checkOutSuccess) => {
    setShowCheckOutModal(false);
    if (checkOutSuccess) {
      // Actualizar la lista de eventos después del check-out exitoso
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === reservaCheckOut.id 
            ? { ...event, estado: "Completada" }
            : event
        )
      );
      setReservaCheckOut(null);
    }
  };

  const filteredEvents = events.filter(event =>
    format(new Date(event.start), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
  );

  return (
    <div className="p-4 bg-gris-sutil rounded-lg shadow-lg">
      <Toaster />
      <div className="flex flex-col lg:flex-row gap-4">

        <div className="w-full lg:w-1/3">
          <div className="sticky top-4">
            <ReservationCalendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onCancelReservation={handleCancel}
              showStatus={false}

            />
          </div>
        </div>


        <div className="w-full lg:w-2/3">
          <MyReservationList
            selectedDate={selectedDate}
            events={filteredEvents}
            onCancelReservation={handleCancel}
            onCheckOut={handleCheckOut}
          />
        </div>
      </div>

      {showCheckOutModal && (
        <CheckOutModal
          isOpen={showCheckOutModal}
          onClose={handleCloseCheckOutModal}
          reservaData={reservaCheckOut}
        />
      )}
    </div>
  );
};

export default BigCalendarView;