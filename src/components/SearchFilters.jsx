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

const SearchFilters = ({ filters, setFilters, onFilterChange, isGuestMode, availableFloors = [] }) => {
  // En modo invitado, mostrar filtros expandidos por defecto
  const [showMoreFilters, setShowMoreFilters] = useState(isGuestMode);

  const staticOptions = {
    sedes: ["Campus Av. 68"],
    espaciosFisicos: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    tipo: ["Coworking", "Espacio multipropósito", "Laboratorio", "Espacio de eventos", "Sala de clases"],
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
        piso: "",
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
    if (isGuestMode) {
      // En modo invitado, reseteamos pero manteniendo las restricciones
      const guestDefaults = {
        capacidad: "",
        espacio: "",
        ubicacion: "",
        fecha: "",
        horaInicio: "",
        horaFinal: "",
        palabra: "",
        id: "",
        sede: "1",
        tipo: "Espacio de eventos",
        tiporecurso: "",
        piso: "",
      };
      setFilters(guestDefaults);
      onFilterChange(guestDefaults);
    } else {
      // Modo normal: reseteo total
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
    }
  };

  return (
    <div className="bg-white shadow-xl p-6 md:p-8 rounded-2xl border border-neutral-100 transition-all hover:shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-gray-800 tracking-tight">Filtros de búsqueda</h3>
        <button
          onClick={handleClearFilters}
          className="text-neutral-400 hover:text-purple-600 transition-colors p-2 rounded-full hover:bg-purple-50"
          title="Limpiar Filtros"
        >
          <FontAwesomeIcon icon={faSyncAlt} className="text-lg" />
        </button>
      </div>
      <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
        {/* Sede - Visible only if NOT guest mode */}
        {!isGuestMode && (
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Sede</label>
            <div className="relative">
              <select
                name="sede"
                value={filters.sede || ""}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
              >
                <option value="1">Campus Av. 68</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* Tipo de espacio - Visible only if NOT guest mode */}
        {!isGuestMode && (
          <div>
            <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Tipo de espacio</label>
            <div className="relative">
              <select
                name="tipo"
                value={filters.tipo || ""}
                onChange={handleChange}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
              >
                <option value="">Seleccionar tipo...</option>
                {staticOptions.tipo.map((tipo, index) => (
                  <option key={index} value={tipo}>{tipo}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
              </div>
            </div>
          </div>
        )}

        {/* Botón para mostrar más filtros - Solo visible en modo normal */}
        {!isGuestMode && (
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <button
              type="button"
              onClick={() => setShowMoreFilters(!showMoreFilters)}
              className="text-purple-600 font-semibold hover:text-purple-800 transition-colors flex items-center gap-2 group py-2"
            >
              <span>{showMoreFilters ? "Menos filtros" : "Más filtros"}</span>
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${showMoreFilters ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}

        {/* Filtros adicionales */}
        {showMoreFilters && (
          <>
            {/* Conditional filters based on tipo === "Coworking" */}
            {filters.tipo === "Coworking" && (
              <>
                {/* Tipo de Coworking */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Tipo de Coworking</label>
                  <div className="relative">
                    <select
                      name="tiporecurso"
                      value={filters.tiporecurso || ""}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {staticOptions.tiposRecurso.map((tipo, index) => (
                        <option key={index} value={tipo}>{tipo}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Piso */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Piso</label>
                  <div className="relative">
                    <select
                      name="piso"
                      value={filters.piso || ""}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {availableFloors?.map((espacio, index) => (
                        <option key={index} value={espacio}>{espacio}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
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
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Franja horaria</label>
                  <div className="relative">
                    <select
                      name="periodo"
                      value={filters.horaInicio ? coworkingPeriods.find(p => p.start === filters.horaInicio)?.id : ""}
                      onChange={handlePeriodSelect}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {coworkingPeriods.map((period) => (
                        <option key={period.id} value={period.id}>
                          {period.name} ({period.start} - {period.end})
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Código */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Código</label>
                  <input
                    type="search"
                    name="palabra"
                    value={filters.palabra || ""}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 font-medium placeholder-gray-400 focus:placeholder-gray-300 hover:border-purple-300"
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
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Piso</label>
                  <div className="relative">
                    <select
                      name="piso"
                      value={filters.piso || ""}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {availableFloors?.map((espacio, index) => (
                        <option key={index} value={espacio}>{espacio}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Fecha */}
                <div>
                  <label className="block text-gray-700 mb-1">Fecha</label>
                  <input
                    type="date"
                    name="fecha"
                    value={filters.fecha ? filters.fecha.split("/").reverse().join("-") : ""}
                    onChange={handleChange}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 text-gray-700 font-medium hover:border-purple-300"
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>

                {/* Hora inicio */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Hora inicio</label>
                  <div className="relative">
                    <select
                      name="horaInicio"
                      value={filters.horaInicio || ""}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {startTimeOptions.map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
                </div>

                {/* Hora fin */}
                <div>
                  <label className="block text-sm font-medium text-neutral-600 mb-1.5 ml-1">Hora fin</label>
                  <div className="relative">
                    <select
                      name="horaFin"
                      value={filters.horaFin || ""}
                      onChange={handleChange}
                      className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
                    >
                      <option value="">Seleccionar</option>
                      {getEndTimeOptions(filters.horaInicio).map((time) => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                  </div>
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