import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { getUserId, fetchAuthToken } from '../Services/authService';
import { useMsal } from '@azure/msal-react';
import {
    getDisponibilidadCheckIn,
    getDisponibilidadCheckOut,
    verificarReservaUsuario,
    verificarReservaConCheckIn
} from '../Services/getDisponibilidadService';
import {
    AUTH_FLOW_SOURCES,
    clearAuthFlowState,
    isQrAuthPending,
    startMicrosoftLogin
} from '../Services/SSOServices/loginFlowService';
import CheckInModal from '../components/CheckInModal';
import CheckOutModal from '../components/CheckOutModal';
import ReservationModal from '../components/ReservationModal';
import ResultsTable from '../components/ResultsTable';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const EspacioQRView = ({ isLoggedIn, goToMyReservations }) => {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const { instance } = useMsal();

    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showCheckOutModal, setShowCheckOutModal] = useState(false);
    const [showReservationModal, setShowReservationModal] = useState(false);

    const [reservaCheckIn, setReservaCheckIn] = useState(null);
    const [reservaCheckOut, setReservaCheckOut] = useState(null);
    const [selectedSpace, setSelectedSpace] = useState(null);

    // guestMode determina si el ReservationModal se abre en modo externo
    const [guestMode, setGuestMode] = useState(!isLoggedIn);
    const [filters] = useState({ id: codigo });

    // Ref para evitar interactuar procesar múltiples veces el cargue del espacio
    const flujoIniciadoRef = useRef(false);

    // Lógica para verificar check-in y check-out (usuario interno)
    const verificarFlujoInterno = async (espacioCargado) => {
        try {
            const userId = getUserId();
            const fecha = format(new Date(), "dd/MM/yyyy");

            // 1. Verificar check-out
            const dispCheckOut = await getDisponibilidadCheckOut(codigo, fecha, userId);
            const reservaCheckOutUsuario = verificarReservaConCheckIn(dispCheckOut.reservas, userId);

            if (reservaCheckOutUsuario) {
                setReservaCheckOut({ ...reservaCheckOutUsuario, espacio: dispCheckOut.espacio });
                setShowCheckOutModal(true);
                return;
            }

            // 2. Verificar check-in
            const dispCheckIn = await getDisponibilidadCheckIn(codigo, fecha, userId);
            const reservaCheckInUsuario = verificarReservaUsuario(dispCheckIn.reservas, userId);

            if (reservaCheckInUsuario && reservaCheckInUsuario.estado !== "Confirmada" && reservaCheckInUsuario.estado !== "Completada") {
                setReservaCheckIn({ ...reservaCheckInUsuario, espacio: dispCheckIn.espacio });
                setShowCheckInModal(true);
                return;
            }

            // 3. No hay check-in ni check-out pendiente → Abrir modal de reserva (interno)
            setGuestMode(false);
            setSelectedSpace(espacioCargado);
            setShowReservationModal(true);

        } catch (error) {
            console.error("[EspacioQR] Error en flujo interno:", error);
            // Si falla la verificación por alguna razón, abrir modal interno por defecto
            setGuestMode(false);
            setSelectedSpace(espacioCargado);
            setShowReservationModal(true);
        }
    };

    // Callback de ResultsTable cuando carga los datos
    const handleSpaceLoaded = async (espacios) => {
        if (flujoIniciadoRef.current) return;

        if (espacios && espacios.length === 1) {
            flujoIniciadoRef.current = true;
            const espacioCargado = espacios[0];
            const requiresLoginByUrlId = UUID_REGEX.test(codigo);
            const qrAuthPending = isQrAuthPending(codigo);
            const hasStoredUserData = !!localStorage.getItem("userData");

            // Si hay userData pero no userId backend, intentar reconstruir la sesión antes de pedir login.
            if (hasStoredUserData && !getUserId()) {
                try {
                    await fetchAuthToken();
                } catch (error) {
                    console.error("[EspacioQR] Error reconstruyendo sesión interna:", error);
                }
            }

            const hasInternalSession = !!localStorage.getItem("userData") && !!getUserId();

            if (hasInternalSession) {
                clearAuthFlowState();
                await verificarFlujoInterno(espacioCargado);
                return;
            }

            // Solo forzar login Microsoft si el QR viene con ID (UUID) en la URL.
            if (requiresLoginByUrlId) {
                // Si ya hubo intento de redirect desde QR y seguimos sin sesión, evitar loop.
                if (qrAuthPending) {
                    clearAuthFlowState();
                    setGuestMode(true);
                    setSelectedSpace(espacioCargado);
                    setShowReservationModal(true);
                    return;
                }

                try {
                    await startMicrosoftLogin(instance, {
                        source: AUTH_FLOW_SOURCES.QR,
                        redirectStartPage: window.location.href,
                        metadata: { codigo },
                    });
                    return;
                } catch {
                    console.info("[EspacioQR] Error en redirect de login. Flujo externo iniciado.");
                    clearAuthFlowState();
                }
            }

            // Flujo externo (sin login o URL sin ID)
            setGuestMode(true);
            setSelectedSpace(espacioCargado);
            setShowReservationModal(true);
        }
    };

    const handleCloseCheckInModal = (checkInSuccess) => {
        setShowCheckInModal(false);
        if (checkInSuccess) {
            setReservaCheckIn(null);
            goToMyReservations();
        }
    };

    const handleCloseCheckOutModal = (checkOutSuccess) => {
        setShowCheckOutModal(false);
        if (checkOutSuccess) {
            setReservaCheckOut(null);
            navigate('/catalogo');
        }
    };

    const handleCloseReservationModal = () => {
        setShowReservationModal(false);
        setSelectedSpace(null);
        // Permitir que se vuelva a abrir el modal si se clickea la tarjeta
        flujoIniciadoRef.current = false;
    };

    return (
        <div className="container mx-auto py-6">
            <ResultsTable
                filters={filters}
                goToMyReservations={goToMyReservations}
                isGuestMode={guestMode}
                onSpaceLoaded={handleSpaceLoaded}
            />

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

            {showReservationModal && selectedSpace && (
                <ReservationModal
                    isOpen={showReservationModal}
                    onClose={handleCloseReservationModal}
                    spaceData={selectedSpace}
                    goToMyReservations={goToMyReservations}
                    isGuestMode={guestMode}
                />
            )}
        </div>
    );
};

export default EspacioQRView;
