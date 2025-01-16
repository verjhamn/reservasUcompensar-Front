import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchFilters from "./components/SearchFilters";
import ResultsTable from "./components/ResultsTable";
import BigCalendarView from "./components/BigCalendarView";
import FullCalendarView from "./components/FullCalendarView";

function App() {
  const [filters, setFilters] = useState({
    capacidad: "",
    espacio: "",
    ubicacion: "",
    fecha: "",
    horaInicio: "",
    horaFinal: "",
  });

  const [view, setView] = useState("table"); // Cambiar entre "table" y "bigCalendar"

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-6">
          {/* Navegación entre vistas */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setView("table")}
              className={`py-2 px-4 rounded ${
                view === "table" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"
              }`}
            >
              Catálogo
            </button>
            <button
              onClick={() => setView("Calendario")}
              className={`py-2 px-4 rounded ${
                view === "Calendario" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"
              }`}
            >
              Mis Reservas
            </button>
            <button
              onClick={() => setView("fullCalendar")}
              className={`py-2 px-4 rounded ${
                view === "fullCalendar" ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"
              }`}
            >
              Admin Calendario
            </button>
          </div>

          {/* Layout responsivo modificado */}
          {view === "table" && (
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar de filtros */}
              <div className="w-full lg:w-1/4">
                <SearchFilters filters={filters} setFilters={setFilters} />
              </div>
              {/* Contenido principal */}
              <div className="w-full lg:flex-1">
                <ResultsTable filters={filters} />
              </div>
            </div>
          )}
          {view === "Calendario" && <BigCalendarView />}
          {view === "fullCalendar" && <FullCalendarView />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
