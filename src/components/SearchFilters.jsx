import React, { useState } from "react";

const coworkingPeriods = [
  { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
  { id: 1, name: "Mañana", start: "13:00", end: "17:00" },
  { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
  { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
];

const SearchFilters = ({ filters, setFilters, onFilterChange }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(null);

  // Opciones estáticas para los desplegables
  const staticOptions = {
    sedes: ["Campus AV 68"],
    espaciosFisicos: ["Sala 1", "Sala 2", "Laboratorio"],
    tiposRecurso: ["Personal", "Interlocución"],
  };

  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const handlePeriodSelect = (e) => {
    const period = coworkingPeriods.find(p => p.id === parseInt(e.target.value));
    setSelectedPeriod(period);
    onFilterChange(period);
  };

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Codigo */}
        <div>
          <label className="block text-gray-700 mb-1">Codigo</label>
          <input
            type="search"
            name="capacidad"
            value={filters.capacidad || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
            placeholder="Digitar código"
            min="1"
          />
        </div>
        {/* Sede */}
        <div>
          <label className="block text-gray-700 mb-1">Sede</label>
          <select
            name="sede"
            value={filters.sede || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
          >
            <option value="">Seleccionar</option>
            {staticOptions.sedes.map((sede, index) => (
              <option key={index} value={sede}>
                {sede}
              </option>
            ))}
          </select>
        </div>

        {/* Botón para mostrar más filtros */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-1">
          <button
            type="button"
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            className="text-turquesa underline"
          >
            {showMoreFilters ? "Menos filtros" : "Más filtros"}
          </button>
        </div>

        {/* Filtros adicionales */}
        {showMoreFilters && (
          <>
            {/* Tipo de Recurso */}
            <div>
              <label className="block text-gray-700 mb-1">Tipo de Recurso</label>
              <select
                name="tipo"
                value={filters.tiporecurso || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
              >
                <option value="">Seleccionar</option>
                {staticOptions.tiposRecurso.map((tipo, index) => (
                  <option key={index} value={tipo}>
                    {tipo}
                  </option>
                ))}
              </select>
            </div>
            {/* Espacio Físico */}
            <div>
              <label className="block text-gray-700 mb-1">Espacio Físico</label>
              <select
                name="espaciofisico"
                value={filters.espaciofisico || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
              >
                <option value="">Seleccionar</option>
                {staticOptions.espaciosFisicos.map((espacio, index) => (
                  <option key={index} value={espacio}>
                    {espacio}
                  </option>
                ))}
              </select>
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-gray-700 mb-1">Fecha</label>
              <input
                type="date"
                name="clseFechainicio"
                value={filters.clseFechainicio || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                min={new Date().toISOString().split("T")[0]} // Prevent selecting past dates
              />
            </div>

            {/* Período */}
            <div>
              <label className="block text-gray-700 mb-1">Período</label>
              <select
                name="periodo"
                value={selectedPeriod ? selectedPeriod.id : ""}
                onChange={handlePeriodSelect}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
              >
                <option value="">Seleccionar</option>
                {coworkingPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.name} ({period.start} - {period.end})
                  </option>
                ))}
              </select>
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;
