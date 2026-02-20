import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getUserId } from '../Services/authService';
import {
    getDisponibilidadCheckIn,
    getDisponibilidadCheckOut,
    verificarReservaUsuario,
    verificarReservaConCheckIn
} from '../Services/getDisponibilidadService';
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';
import ResultsTable from '../components/ResultsTable';

const EspacioQRView = ({ isLoggedIn, goToMyReservations }) => {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [reservaCheckIn, setReservaCheckIn] = useState(null);
    const [reservaCheckOut, setReservaCheckOut] = useState(null);
    const [filters, setFilters] = useState({ id: codigo });

    useEffect(() => {
        // Solo verificar check-in/check-out si está autenticado
        if (!isLoggedIn) {
            return; // Mostrar el espacio pero no verificar reservas
        }

        const verificarCheckOut = async () => {
            try {
                const userId = getUserId();
                const fecha = format(new Date(), "dd/MM/yyyy");
                const disponibilidad = await getDisponibilidadCheckOut(codigo, fecha, userId);

                const reservaUsuario = verificarReservaConCheckIn(disponibilidad.reservas, userId);

                if (reservaUsuario) {
                    setReservaCheckOut({ ...reservaUsuario, espacio: disponibilidad.espacio });
                    setShowCheckOutModal(true);
                    return true; // Encontró check-out
                }
                return false; // No encontró check-out
            } catch (error) {
                console.error("Error al verificar check-out:", error);
                return false;
            }
        };

        const verificarCheckIn = async () => {
            try {
                const userId = getUserId();
                const fecha = format(new Date(), "dd/MM/yyyy");
                const disponibilidad = await getDisponibilidadCheckIn(codigo, fecha, userId);

                const reservaUsuario = verificarReservaUsuario(disponibilidad.reservas, userId);

                if (reservaUsuario) {
                    if (reservaUsuario.estado !== "Confirmada" && reservaUsuario.estado !== "Completada") {
                        // Si tiene reserva pero no está confirmada, mostrar modal de check-in
                        setReservaCheckIn({ ...reservaUsuario, espacio: disponibilidad.espacio });
                        setShowCheckInModal(true);
                    }
                }
            } catch (error) {
                console.error("Error al verificar check-in:", error);
            }
        };

        // Primero verificar check-out, si no hay, verificar check-in
        const verificarReservas = async () => {
            const tieneCheckOut = await verificarCheckOut();
            if (!tieneCheckOut) {
                await verificarCheckIn();
            }
        };

        verificarReservas();
    }, [codigo, isLoggedIn, navigate]);

    const handleCloseCheckInModal = (checkInSuccess) => {
        setShowCheckInModal(false);
        if (checkInSuccess) {
            setReservaCheckIn(null);
            // Después de check-in exitoso, redirigir a Mis Reservas
            goToMyReservations();
        }
    };

    const handleCloseCheckOutModal = (checkOutSuccess) => {
        setShowCheckOutModal(false);
        if (checkOutSuccess) {
            setReservaCheckOut(null);
            // Redirigir al catálogo después de check-out exitoso
            navigate('/catalogo');
        }
    };

    return (
        <div className="container mx-auto py-6">
            {/* Mostrar el espacio específico con filtro por ID */}
            <ResultsTable filters={filters} goToMyReservations={goToMyReservations} />

            {showCheckInModal && (
                <CheckInModal
                    isOpen={showCheckInModal}
                    onClose={handleCloseCheckInModal}
                    reservaData={reservaCheckIn}
                />
            )}

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

export default EspacioQRView;
