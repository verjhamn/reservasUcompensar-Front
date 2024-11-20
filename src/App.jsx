import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import SearchFilters from "./components/SearchFilters";
import ResultsTable from "./components/ResultsTable";

function App() {
  const [filters, setFilters] = useState({
    capacidad: "",
    espacio: "",
    ubicacion: "",
    fecha: "",
    horaInicio: "",
    horaFinal: "",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow bg-gray-100">
        <div className="container mx-auto py-6">
          <SearchFilters filters={filters} setFilters={setFilters} />
          <ResultsTable filters={filters} />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
