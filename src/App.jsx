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
        palabra: "", // Aquí guardaremos el código del espacio si viene en la URL
    });

    const [view, setView] = useState("table"); 
    const [showModal, setShowModal] = useState(true);

    // Extraer código del espacio desde la URL (ejemplo: /espacio/P3C01L)
    useEffect(() => {
        const pathParts = window.location.pathname.split("/");
        if (pathParts.length === 3 && pathParts[1] === "espacio") {
            const codigoEspacio = pathParts[2]; // Extrae "P3C01L"
            setFilters(prev => ({ ...prev, palabra: codigoEspacio }));
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

    return (
        <MsalProvider instance={msalInstance}>
            <div className="min-h-screen flex flex-col">
                {showModal && <InfoModal onClose={handleCloseModal} />}
                <Header />
                <main className="flex-grow bg-gray-100">
                    <div className="container mx-auto py-6">
                        <div className="flex justify-center space-x-4 mb-6">
                            <button
                                onClick={() => setView("table")}
                                className={`py-2 px-4 rounded ${view === "table" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                            >
                                Catálogo
                            </button>
                            <button
                                onClick={() => setView("Calendario")}
                                className={`py-2 px-4 rounded ${view === "Calendario" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                            >
                                Mis Reservas
                            </button>
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
