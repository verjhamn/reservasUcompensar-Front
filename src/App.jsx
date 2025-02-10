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
import InfoModal from "./components/InfoModal";

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
        id:""
    });

    const [view, setView] = useState("table"); 
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Verificar si hay un usuario autenticado en localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        setIsLoggedIn(!!storedUser); // Si hay usuario, `isLoggedIn` será true
    }, []);

    // Verificar si el modal ya se ha mostrado
    useEffect(() => {
        const modalShown = localStorage.getItem("modalShown") ;
        if (!modalShown) {
            setShowModal(true);
            localStorage.setItem("modalShown", "true");
        }
    }, []);

    // Extraer código del espacio desde la URL
    useEffect(() => {
        const pathParts = window.location.pathname.split("/");
        if (pathParts.length === 3 && pathParts[1] === "espacio") {
            const codigoEspacio = pathParts[2];
            setFilters(prev => ({ ...prev, id: codigoEspacio }));
        }
    }, []);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleCloseModal = () => {
        setShowModal(false);
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
                <Header onLoginSuccess={handleLoginSuccess} onLogout={handleLogout} />
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
                                <button
                                    onClick={() => setView("Calendario")}
                                    className={`py-2 px-4 rounded ${view === "Calendario" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                                >
                                    Mis Reservas
                                </button>
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
                    </div>
                </main>
                <Footer />
            </div>
        </MsalProvider>
    );
}

export default App;
