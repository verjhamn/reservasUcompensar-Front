import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { FunnelIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import FilterField from "./FilterField";

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

const AdminSearchFilters = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const staticOptions = {
    tipos: ["Coworking", "Espacio multipropósito", "Laboratorio", "Espacio de eventos", "Sala de clases"],
    estados: ["Creada", "Confirmada", "Completada", "Cancelada"],
    pisos: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
  };

  // Contar filtros activos
  const activeFiltersCount = Object.values(filters).filter(value => value && value.trim() !== "").length;

  const startTimeOptions = generateTimeOptions(7, 21);
  
  const getEndTimeOptions = (startTime) => {
    if (!startTime) return generateTimeOptions(8, 22);
    const startHour = parseInt(startTime.split(':')[0]);
    return generateTimeOptions(startHour + 1, 22);
  };

  const handleChange = (name, value) => {
    if (name === "tipo") {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        horaInicio: "",
        horaFin: "",
      }));
      return;
    }

    if (name === "periodo") {
      // Extraer el nombre del período del string seleccionado
      const periodName = value.split(' (')[0];
      const period = coworkingPeriods.find(p => p.name === periodName);
      if (period) {
        setFilters(prev => ({
          ...prev,
          horaInicio: period.start,
          horaFin: period.end,
        }));
      }
      return;
    }

    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      palabra: "",
      email: "",
      tipo: "",
      estado: "",
      piso: "",
      horaInicio: "",
      horaFin: ""
    });
    // Cerrar el panel en móvil después de limpiar
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl overflow-hidden">
      {/* Header del panel - siempre visible */}
      <div className="p-3 md:p-6">
        {/* Botón colapsable para móvil */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between mb-3 md:mb-4 lg:cursor-default"
        >
          <div className="flex items-center gap-2">
            <FunnelIcon className="h-5 w-5 text-turquesa" />
            <h3 className="text-base md:text-lg font-semibold">Filtros de búsqueda</h3>
            {activeFiltersCount > 0 && (
              <span className="bg-turquesa text-white text-xs font-bold rounded-full px-2 py-0.5 min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearFilters();
                }}
                className="text-turquesa hover:text-fucsia text-sm p-1"
                title="Limpiar Filtros"
              >
                <FontAwesomeIcon icon={faSyncAlt} className="w-4 h-4" />
              </button>
            )}
            <div className="lg:hidden">
              {isOpen ? (
                <ChevronUpIcon className="h-5 w-5 text-gray-600" />
              ) : (
                <ChevronDownIcon className="h-5 w-5 text-gray-600" />
              )}
            </div>
          </div>
        </button>

        {/* Resumen de filtros activos (solo visible cuando está cerrado en móvil) */}
        {!isOpen && activeFiltersCount > 0 && (
          <div className="lg:hidden flex flex-wrap gap-2 mb-3">
            {filters.palabra && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                📝 {filters.palabra}
              </span>
            )}
            {filters.email && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                ✉️ {filters.email.substring(0, 15)}...
              </span>
            )}
            {filters.tipo && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                🏢 {filters.tipo}
              </span>
            )}
            {filters.estado && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                📊 {filters.estado}
              </span>
            )}
            {filters.piso && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                🏗️ Piso {filters.piso}
              </span>
            )}
            {filters.horaInicio && (
              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                🕐 {filters.horaInicio}-{filters.horaFin}
              </span>
            )}
          </div>
        )}

        {/* Formulario de filtros - colapsable en móvil, siempre visible en desktop */}
        <div className={`${isOpen ? 'block' : 'hidden'} lg:block`}>
          <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3 md:gap-4">
        <FilterField
          label="Palabra clave"
          name="palabra"
          value={filters.palabra || ""}
          onChange={handleChange}
          type="text"
          placeholder="Buscar por código o palabra clave..."
        />

        <FilterField
          label="Correo electrónico"
          name="email"
          value={filters.email || ""}
          onChange={handleChange}
          type="email"
          placeholder="Buscar por correo del usuario..."
        />

        <FilterField
          label="Tipo de espacio"
          name="tipo"
          value={filters.tipo || ""}
          onChange={handleChange}
          type="select"
          placeholder="Seleccionar tipo de espacio..."
          options={staticOptions.tipos}
        />

        <FilterField
          label="Estado"
          name="estado"
          value={filters.estado || ""}
          onChange={handleChange}
          type="select"
          placeholder="Seleccionar estado..."
          options={staticOptions.estados}
        />

        <FilterField
          label="Piso"
          name="piso"
          value={filters.piso || ""}
          onChange={handleChange}
          type="select"
          placeholder="Seleccionar piso..."
          options={staticOptions.pisos}
        />

        {filters.tipo === "Coworking" ? (
          <FilterField
            label="Franja horaria"
            name="periodo"
            value={filters.horaInicio ? 
              coworkingPeriods.find(p => p.start === filters.horaInicio)?.name + ` (${filters.horaInicio} - ${filters.horaFin})` : ""
            }
            onChange={handleChange}
            type="select"
            placeholder="Seleccionar franja horaria..."
            options={coworkingPeriods.map(period => `${period.name} (${period.start} - ${period.end})`)}
          />
        ) : (
          <>
            <FilterField
              label="Hora inicio"
              name="horaInicio"
              value={filters.horaInicio || ""}
              onChange={handleChange}
              type="select"
              placeholder="Seleccionar hora de inicio..."
              options={startTimeOptions}
            />
            <FilterField
              label="Hora fin"
              name="horaFin"
              value={filters.horaFin || ""}
              onChange={handleChange}
              type="select"
              placeholder="Seleccionar hora de fin..."
              options={getEndTimeOptions(filters.horaInicio)}
            />
          </>
        )}
      </form>
        </div>
      </div>
    </div>
  );
};

export default AdminSearchFilters;
