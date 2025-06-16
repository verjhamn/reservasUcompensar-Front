import React, { useState, useEffect } from "react";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Services/SSOServices/authConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchFilters from "./components/SearchFilters";
import ResultsTable from "./components/ResultsTable";
import BigCalendarView from "./components/misReservas";
import FullCalendarView from "./components/FullCalendarView";
import ReportsView from "./components/Reports/ReportsView";
import InfoModal from "./components/InfoModal";
import CheckInModal from "./components/CheckInModal";
import { hasAdminAccess, canAccessReports } from './utils/userHelper';
import AdminReservationsView from './components/AdminReservations/AdminReservationsView';
import { getDisponibilidad, verificarReservaUsuario } from './Services/getDisponibilidadService';
import { getUserId } from './Services/authService';
import { format } from 'date-fns';
import { getDisponibilidadCheckIn } from './Services/getDisponibilidadService';

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
    const [filters, setFilters] = useState({
        capacidad: "",
        espacio: "",
        ubicacion: "",
        fecha: "",
        horaInicio: "",
        horaFinal: "",
        palabra: "",
        id: ""
    });

    const [view, setView] = useState("table");
    const [showModal, setShowModal] = useState(false);
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [canViewReports, setCanViewReports] = useState(false);
    const [reservaCheckIn, setReservaCheckIn] = useState(null);

    // Verificar si hay un usuario autenticado en localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        setIsLoggedIn(!!storedUser);
    }, []);

    // Verificar si el modal ya se ha mostrado
    useEffect(() => {
        const modalShown = localStorage.getItem("modalShown");
        if (!modalShown) {
            setShowModal(true);
            localStorage.setItem("modalShown", "true");
        }
    }, []);

    // Extraer código del espacio desde la URL y verificar check-in
    useEffect(() => {
        const verificarCheckIn = async () => {
            const pathParts = window.location.pathname.split("/");
            if (pathParts.length === 3 && pathParts[1] === "espacio") {
                const codigoEspacio = pathParts[2];
                setFilters(prev => ({ ...prev, id: codigoEspacio }));

                if (isLoggedIn) {
                    try {
                        const userId = getUserId();
                        const fecha = format(new Date(), "dd/MM/yyyy");
                        const disponibilidad = await getDisponibilidadCheckIn(codigoEspacio, fecha, userId);
                        
                        const reservaUsuario = verificarReservaUsuario(disponibilidad.reservas, userId);
                        
                        if (reservaUsuario) {
                            if (reservaUsuario.estado === "Confirmada") {
                                // Si ya está confirmada, continuar con el flujo normal
                                return;
                            } else {
                                // Si tiene reserva pero no está confirmada, mostrar modal de check-in
                                setReservaCheckIn({ ...reservaUsuario, espacio: disponibilidad.espacio });
                                setShowCheckInModal(true);
                            }
                        }
                    } catch (error) {
                        console.error("Error al verificar check-in:", error);
                    }
                }
            }
        };

        verificarCheckIn();
    }, [isLoggedIn]);

    useEffect(() => {
        const checkUserPermissions = () => {
            const userData = JSON.parse(localStorage.getItem("userData") || "{}");
            const isAdminUser = hasAdminAccess();
            const canViewReportsUser = canAccessReports(userData?.mail);
            
            setIsAdmin(isAdminUser);
            setCanViewReports(canViewReportsUser);
        };

        if (isLoggedIn) {
            checkUserPermissions();
        } else {
            setIsAdmin(false);
            setCanViewReports(false);
        }
    }, [isLoggedIn]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleCloseCheckInModal = (checkInSuccess) => {
        setShowCheckInModal(false);
        if (checkInSuccess) {
            // Si el check-in fue exitoso, continuar con el flujo normal
            setReservaCheckIn(null);
        }
    };

    const goToMyReservations = () => {
        setView("Calendario");
    };

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <MsalProvider instance={msalInstance}>
            <div className="min-h-screen flex flex-col">
                {showModal && <InfoModal onClose={handleCloseModal} />}
                <Header 
                    onLoginSuccess={handleLoginSuccess}
                    onLogout={handleLogout}
                    isLoggedIn={isLoggedIn}
                    isAdmin={isAdmin}
                    canViewReports={canViewReports}
                    onMyReservationsClick={goToMyReservations}
                />
                <main className="flex-grow bg-gray-100">
                    <div className="container mx-auto py-6">
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                onClick={() => setView("table")}
                                className={`py-2 px-4 rounded ${view === "table" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                            >
                                Catálogo
                            </button>

                            {/* 🔹 Solo mostrar botón "Mis Reservas" si el usuario está autenticado */}
                            {isLoggedIn && (
                                <>
                                    <button
                                        onClick={() => setView("Calendario")}
                                        className={`py-2 px-4 rounded ${view === "Calendario" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                                    >
                                        Mis Reservas
                                    </button>
                                    {isAdmin && (
                                        <button
                                            onClick={() => setView("adminReservations")}
                                            className={`py-2 px-4 rounded ${view === "adminReservations" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                                        >
                                            Administrar Reservas
                                        </button>
                                    )}
                                    {(isAdmin || canViewReports) && (
                                        <button
                                            onClick={() => setView("reports")}
                                            className={`py-2 px-4 rounded ${view === "reports" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                                        >
                                            Reportes
                                        </button>
                                    )}
                                </>
                            )}
                        </div>

                        {view === "table" && (
                            <div className="flex flex-col lg:flex-row gap-6">
                                <div className="w-full lg:w-1/4">
                                    <SearchFilters filters={filters} setFilters={setFilters} onFilterChange={handleFilterChange} />
                                </div>
                                <div className="w-full lg:flex-1">
                                    <ResultsTable filters={filters} goToMyReservations={goToMyReservations} />
                                </div>
                            </div>
                        )}
                        {view === "Calendario" && <BigCalendarView />}
                        {view === "fullCalendar" && <FullCalendarView />}
                        {view === "reports" && (isAdmin || canViewReports) && <ReportsView />}
                        {view === "adminReservations" && isAdmin && <AdminReservationsView />}
                    </div>
                </main>
                <Footer />

                {showCheckInModal && (
                    <CheckInModal
                        isOpen={showCheckInModal}
                        onClose={handleCloseCheckInModal}
                        reservaData={reservaCheckIn}
                    />
                )}
            </div>
        </MsalProvider>
    );
}

export default App;
