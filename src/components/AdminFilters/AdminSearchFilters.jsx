import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";
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
  const staticOptions = {
    tipos: ["Coworking", "Espacio multipropósito", "Laboratorio", "Espacio de eventos", "Sala de clases"],
    estados: ["Creada", "Confirmada", "Cancelada"],
    pisos: ["3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"]
  };

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

      <form className="grid grid-cols-1 gap-4">
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
  );
};

export default AdminSearchFilters;
