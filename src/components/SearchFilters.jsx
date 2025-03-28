import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const coworkingPeriods = [
  { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
  { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
  { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
  { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
];

const generateTimeOptions = (start, end) => {
  const times = [];
  for (let i = parseInt(start); i <= parseInt(end); i++) {
    const time = `${i.toString().padStart(2, '0')}:00`;
    times.push(time);
  }
  return times;
};

const SearchFilters = ({ filters, setFilters, onFilterChange }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  const staticOptions = {
    sedes: ["Campus Av. 68"],
    espaciosFisicos: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13","14", "15"],
    tipo: ["Coworking", "Espacio multipropósito","Laboratorio", "Espacio de eventos" , "Sala de clases"],
    tiposRecurso: ["Personal", "Puesto en L"],
  };

  const startTimeOptions = generateTimeOptions(7, 21);
  
  // Generar opciones de hora fin basadas en la hora de inicio seleccionada
  const getEndTimeOptions = (startTime) => {
    if (!startTime) return generateTimeOptions(8, 22);
    const startHour = parseInt(startTime.split(':')[0]);
    return generateTimeOptions(startHour + 1, 22);
  };

  const formatFecha = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === "fecha") {
      formattedValue = formatFecha(value);
    }

    // Reset time-related filters when changing tipo
    if (name === "tipo") {
      const updatedFilters = {
        ...filters,
        [name]: formattedValue,
        horaInicio: "",
        horaFin: "",
        tiporecurso: "",
      };
      setFilters(updatedFilters);
    } 
    // Reset hora fin when hora inicio changes
    else if (name === "horaInicio") {
      const updatedFilters = {
        ...filters,
        [name]: formattedValue,
        horaFin: "", // Reset hora fin when hora inicio changes
      };
      setFilters(updatedFilters);
    }
    else {
      const updatedFilters = { ...filters, [name]: formattedValue };
      setFilters(updatedFilters);
    }
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
    }
  };

  const handleClearFilters = () => {
    const defaultFilters = {
      capacidad: "",
      espacio: "",
      ubicacion: "",
      fecha: "",
      horaInicio: "",
      horaFinal: "",
      palabra: "",
      id: "",
      sede: "",
      tipo: "",
      tiporecurso: "",
      piso: "",
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros de búsqueda</h3>
        <button
          onClick={handleClearFilters}
          className="text-turquesa hover:text-fucsia"
          title="Limpiar Filtros"
        >
          <FontAwesomeIcon icon={faSyncAlt} />
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Sede - Always visible */}
        <div>
          <label className="block text-gray-700 mb-1">Sede</label>
          <select
            name="sede"
            value={filters.sede || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
          >
            <option value="Campus Av. 68">Campus Av. 68</option>
          </select>
        </div>

        {/* Tipo de espacio - Always visible */}
        <div>
          <label className="block text-gray-700 mb-1">Tipo de espacio</label>
          <select
            name="tipo"
            value={filters.tipo || ""}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
          >
            <option value="">Seleccionar</option>
            {staticOptions.tipo.map((tipo, index) => (
              <option key={index} value={tipo}>{tipo}</option>
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
            {/* Conditional filters based on tipo === "Coworking" */}
            {filters.tipo === "Coworking" && (
              <>
                {/* Tipo de Coworking */}
                <div>
                  <label className="block text-gray-700 mb-1">Tipo de Coworking</label>
                  <select
                    name="tiporecurso"
                    value={filters.tiporecurso || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                  >
                    <option value="">Seleccionar</option>
                    {staticOptions.tiposRecurso.map((tipo, index) => (
                      <option key={index} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>

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
                      <option key={index} value={espacio}>{espacio}</option>
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
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Franja horaria for Coworking */}
                <div>
                  <label className="block text-gray-700 mb-1">Franja horaria</label>
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
                    placeholder="Ej: P3C01L"
                  />
                </div>
              </>
            )}

            {/* Filters for non-Coworking spaces */}
            {filters.tipo && filters.tipo !== "Coworking" && (
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
                      <option key={index} value={espacio}>{espacio}</option>
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
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Hora inicio */}
                <div>
                  <label className="block text-gray-700 mb-1">Hora inicio</label>
                  <select
                    name="horaInicio"
                    value={filters.horaInicio || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                  >
                    <option value="">Seleccionar</option>
                    {startTimeOptions.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>

                {/* Hora fin */}
                <div>
                  <label className="block text-gray-700 mb-1">Hora fin</label>
                  <select
                    name="horaFin"
                    value={filters.horaFin || ""}
                    onChange={handleChange}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa"
                  >
                    <option value="">Seleccionar</option>
                    {getEndTimeOptions(filters.horaInicio).map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default SearchFilters;