import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchFilters from "./components/SearchFilters";
import ResultsTable from "./components/ResultsTable";
import BigCalendarView from "./components/BigCalendarView";

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
                view === "table" ? "bg-orange-600 text-white" : "bg-gray-300"
              }`}
            >
              Reservar
            </button>
            <button
              onClick={() => setView("bigCalendar")}
              className={`py-2 px-4 rounded ${
                view === "bigCalendar" ? "bg-orange-600 text-white" : "bg-gray-300"
              }`}
            >
              Reservas
            </button>
          </div>

          {/* Renderizado condicional de la vista seleccionada */}
          {view === "table" && (
            <>
              <SearchFilters filters={filters} setFilters={setFilters} />
              <ResultsTable filters={filters} />
            </>
          )}
          {view === "bigCalendar" && <BigCalendarView />}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
