import React, { useState, useRef, useEffect } from 'react';
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
const SESSION_HYDRATION_TIMEOUT_MS = 4000;
const SESSION_HYDRATION_POLL_MS = 200;

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

    // guestMode decides if ReservationModal opens as guest mode
    const [guestMode, setGuestMode] = useState(!isLoggedIn);
    const [filters] = useState({ id: codigo });

    // Avoid triggering automatic flow more than once per load
    const flujoIniciadoRef = useRef(false);

    useEffect(() => {
        if (isLoggedIn) {
            setGuestMode(false);
        }
    }, [isLoggedIn]);

    const hasInternalSession = () => {
        const storedUser = localStorage.getItem('userData');
        return !!storedUser && storedUser !== 'null' && !!getUserId();
    };

    const hydrateBackendSessionIfPossible = async () => {
        const storedUser = localStorage.getItem('userData');

        if (storedUser && storedUser !== 'null' && !getUserId()) {
            try {
                await fetchAuthToken();
            } catch (error) {
                console.error('[EspacioQR] Error rebuilding backend session:', error);
            }
        }

        return hasInternalSession();
    };

    const waitForInternalSession = async (timeoutMs = SESSION_HYDRATION_TIMEOUT_MS) => {
        const startedAt = Date.now();
        let backendHydrationRequested = false;

        while (Date.now() - startedAt < timeoutMs) {
            const storedUser = localStorage.getItem('userData');
            const hasUserData = !!storedUser && storedUser !== 'null';
            const userId = getUserId();

            if (hasUserData && userId) {
                return true;
            }

            if (hasUserData && !userId && !backendHydrationRequested) {
                backendHydrationRequested = true;

                try {
                    await fetchAuthToken();
                } catch (error) {
                    console.error('[EspacioQR] Error completing backend session after redirect:', error);
                }

                if (hasInternalSession()) {
                    return true;
                }
            }

            await new Promise((resolve) => setTimeout(resolve, SESSION_HYDRATION_POLL_MS));
        }

        return hasInternalSession();
    };

    // Internal user flow: check-out -> check-in -> reservation modal
    const verificarFlujoInterno = async (espacioCargado) => {
        try {
            const userId = getUserId();
            const fecha = format(new Date(), 'dd/MM/yyyy');

            // 1. Check check-out first
            const dispCheckOut = await getDisponibilidadCheckOut(codigo, fecha, userId);
            const reservaCheckOutUsuario = verificarReservaConCheckIn(dispCheckOut.reservas, userId);

            if (reservaCheckOutUsuario) {
                setReservaCheckOut({ ...reservaCheckOutUsuario, espacio: dispCheckOut.espacio });
                setShowCheckOutModal(true);
                return;
            }

            // 2. Then check check-in
            const dispCheckIn = await getDisponibilidadCheckIn(codigo, fecha, userId);
            const reservaCheckInUsuario = verificarReservaUsuario(dispCheckIn.reservas, userId);

            if (
                reservaCheckInUsuario &&
                reservaCheckInUsuario.estado !== 'Confirmada' &&
                reservaCheckInUsuario.estado !== 'Completada'
            ) {
                setReservaCheckIn({ ...reservaCheckInUsuario, espacio: dispCheckIn.espacio });
                setShowCheckInModal(true);
                return;
            }

            // 3. No pending check-in/check-out: open internal reservation modal
            setGuestMode(false);
            setSelectedSpace(espacioCargado);
            setShowReservationModal(true);
        } catch (error) {
            console.error('[EspacioQR] Error in internal flow:', error);
            // Fallback to internal modal by default
            setGuestMode(false);
            setSelectedSpace(espacioCargado);
            setShowReservationModal(true);
        }
    };

    // Called by ResultsTable after loading spaces
    const handleSpaceLoaded = async (espacios) => {
        if (flujoIniciadoRef.current) return;

        if (espacios && espacios.length === 1) {
            flujoIniciadoRef.current = true;
            const espacioCargado = espacios[0];
            const requiresLoginByUrlId = UUID_REGEX.test(codigo);
            const qrAuthPending = isQrAuthPending(codigo);

            if (await hydrateBackendSessionIfPossible()) {
                clearAuthFlowState();
                await verificarFlujoInterno(espacioCargado);
                return;
            }

            // Only auto-login for UUID QR URLs
            if (requiresLoginByUrlId) {
                // If we just returned from redirect, wait briefly for session hydration
                // before falling back to guest flow.
                if (qrAuthPending) {
                    const hydratedAfterRedirect = await waitForInternalSession();
                    if (hydratedAfterRedirect) {
                        clearAuthFlowState();
                        await verificarFlujoInterno(espacioCargado);
                        return;
                    }

                    clearAuthFlowState();
                }

                try {
                    await startMicrosoftLogin(instance, {
                        source: AUTH_FLOW_SOURCES.QR,
                        redirectStartPage: window.location.href,
                        metadata: { codigo },
                    });
                    return;
                } catch {
                    console.info('[EspacioQR] Login redirect failed. Starting guest flow.');
                    clearAuthFlowState();
                }
            }

            // Guest flow (no login or non-UUID URL)
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
        // Allow reopening if user clicks card again
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
