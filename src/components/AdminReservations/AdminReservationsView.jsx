import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import SearchFilters from '../SearchFilters';
import ReservationCalendar from '../Calendar/ReservationCalendar';
import { getAllReservations } from '../../Services/adminReservasService';
import { deleteReserva } from '../../Services/deleteReservaService';
import { showConfirmation, showSuccessToast, showErrorToast } from '../UtilComponents/Confirmation';

const AdminReservationsView = () => {
    const [filters, setFilters] = useState({});
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchReservations();
    }, [filters]);

    const fetchReservations = async () => {
        try {
            const data = await getAllReservations(filters);
            console.log('Datos crudos:', data);

            const formattedReservations = data.map(reservation => ({
                id: reservation.id,
                titulo: reservation.titulo,
                descripcion: reservation.descripcion,
                hora_inicio: reservation.hora_inicio,
                hora_fin: reservation.hora_fin,
                estado: reservation.estado,
                usuario: reservation.usuario,
                // Formatear el espacio de la misma manera que en misReservas
                type: reservation.espacio?.key || 'Coworking',
                idEspacio: reservation.espacio?.codigo,
                espacio: {
                    codigo: reservation.espacio?.codigo,
                    key: reservation.espacio?.key,
                    tipo: reservation.espacio?.tipo_espacio,
                    nombre: reservation.espacio?.nombre
                },
                start: new Date(reservation.hora_inicio),
                end: new Date(reservation.hora_fin)
            }));
            
            console.log('Reservas formateadas:', formattedReservations);
            setReservations(formattedReservations);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            showErrorToast('Error al cargar las reservas');
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            const confirmed = await showConfirmation(
                () => {}, 
                "¿Estás seguro de que deseas cancelar esta reserva?"
            );

            if (confirmed) {
                await deleteReserva(reservationId);
                await fetchReservations();
                showSuccessToast('Reserva cancelada con éxito');
            }
        } catch (error) {
            showErrorToast('Error al cancelar la reserva');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4">
                    <SearchFilters 
                        filters={filters} 
                        setFilters={setFilters}
                        isAdminView={true} // Para habilitar filtros adicionales si es necesario
                    />
                </div>
                <div className="w-full lg:flex-1">
                    <ReservationCalendar
                        events={reservations}
                        selectedDate={selectedDate}
                        onSelectDate={setSelectedDate}
                        onCancelReservation={handleCancelReservation}
                        showStatus={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminReservationsView;
