import React, { useState } from "react";

const coworkingPeriods = [
  { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
  { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
  { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
  { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
];

const SearchFilters = ({ filters, setFilters, onFilterChange }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const staticOptions = {
    sedes: ["Campus Av. 68"],
    espaciosFisicos: ["3", "4"],
    tiposRecurso: ["Personal", "Puesto en L"],
  };

  const formatFecha = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`; // Convertir a DD/MM/AAAA
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "fecha") {
      formattedValue = formatFecha(value);
    }

    const updatedFilters = { ...filters, [name]: formattedValue };
    setFilters(updatedFilters);
    //onFilterChange(updatedFilters);
  };

  const handlePeriodSelect = (e) => {
    const period = coworkingPeriods.find(p => p.id === parseInt(e.target.value));
    if (period) {
      const updatedFilters = {
        ...filters,
        horaInicio: period.start,
        horaFin: period.end,
      };
      setFilters(updatedFilters);
      //onFilterChange(updatedFilters);
    }
  };

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">

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

        {/* Tipo de Recurso */}
        <div>
          <label className="block text-gray-700 mb-1">Tipo de Recurso</label>
          <select
            name="tiporecurso"
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

            {/* Piso */}
            <div>
              <label className="block text-gray-700 mb-1">Piso</label>
              <select
                name="piso"
                value={filters.piso || ""}
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
                name="fecha"
                value={filters.fecha ? filters.fecha.split("/").reverse().join("-") : ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                min={new Date().toISOString().split("T")[0]} // Restringir fechas pasadas
              />
            </div>

            {/* Período */}
            <div>
              <label className="block text-gray-700 mb-1">Período</label>
              <select
                name="periodo"
                value={filters.horaInicio ? coworkingPeriods.find(p => p.start === filters.horaInicio)?.id : ""}
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
            {/* Código */}
            <div>
              <label className="block text-gray-700 mb-1">Código</label>
              <input
                type="search"
                name="palabra"
                value={filters.palabra || ""}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                placeholder="Digitar código"
              />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;
