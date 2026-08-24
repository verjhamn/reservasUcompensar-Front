/* eslint-disable react/prop-types */
import { useState } from "react";
import { CalendarDays, ChevronDown, ChevronUp, Eraser, Filter } from "lucide-react";
import FilterField from "./FilterField";
import { getSedeLabel } from "../../utils/constants";

const coworkingPeriods = [
  { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
  { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
  { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
  { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
];

const generateTimeOptions = (start, end) => {
  const times = [];
  for (let hour = start; hour <= end; hour += 1) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return times;
};

const AdminSearchFilters = ({ filters, setFilters }) => {
  const [isOpen, setIsOpen] = useState(false);

  const staticOptions = {
    tipos: ["Coworking", "Espacio multipropósito", "Laboratorio", "Espacio de eventos", "Sala de clases"],
    estados: ["Creada", "Confirmada", "Completada", "Cancelada"],
    pisos: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15"],
    bloques: ["I", "J", "H", "F", "E", "D", "C", "B", "A"].map((block) => ({
      value: block,
      label: `Bloque ${block}`,
    })),
    sedes: [
      { value: "1", label: "Campus Av. 68" },
      { value: "2", label: "Campus Teusaquillo" },
    ],
    agrupable: [
      { value: "SI", label: "Agrupable" },
      { value: "NO", label: "No agrupable" },
    ],
    tiposRecurso: ["Personal", "Puesto en L"],
  };

  const isTeusaquilloCampus = filters.sede?.toString() === "2";
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "bloque" && !isTeusaquilloCampus) return false;
    return value && value.toString().trim() !== "";
  }).length;
  const startTimeOptions = generateTimeOptions(7, 21);

  const getEndTimeOptions = (startTime) => {
    if (!startTime) return generateTimeOptions(8, 22);
    const startHour = Number(startTime.split(":")[0]);
    return generateTimeOptions(startHour + 1, 22);
  };

  const handleChange = (name, value) => {
    if (name === "tipo") {
      setFilters((prev) => ({
        ...prev,
        tipo: value,
        horaInicio: "",
        horaFin: "",
        tiporecurso: "",
      }));
      return;
    }

    if (name === "sede") {
      setFilters((prev) => ({
        ...prev,
        sede: value,
        bloque: value === "2" ? prev.bloque : "",
      }));
      return;
    }

    if (name === "horaInicio") {
      setFilters((prev) => ({
        ...prev,
        horaInicio: value,
        horaFin: "",
      }));
      return;
    }

    if (name === "periodo") {
      const periodName = value.split(" (")[0];
      const period = coworkingPeriods.find((item) => item.name === periodName);
      if (period) {
        setFilters((prev) => ({
          ...prev,
          horaInicio: period.start,
          horaFin: period.end,
        }));
      }
      return;
    }

    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({
      id: "",
      palabra: "",
      email: "",
      sede: "",
      bloque: "",
      tipo: "",
      piso: "",
      agrupable: "",
      tiporecurso: "",
      fecha: "",
      horaInicio: "",
      horaFin: "",
      estado: "",
    });

    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="p-4 md:p-5">
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-3 lg:cursor-default"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-purple-50 p-2">
              <Filter className="h-5 w-5 text-purple-600" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-gray-900 md:text-lg">Filtros</h3>
                {activeFiltersCount > 0 && (
                  <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                    {activeFiltersCount}
                  </span>
                )}
              </div>
              <p className="text-xs font-medium text-gray-500">Reservas internas</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleClearFilters();
                }}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-purple-50 hover:text-purple-600"
                title="Limpiar filtros"
              >
                <Eraser className="h-4 w-4" />
              </button>
            )}
            <div className="lg:hidden">
              {isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
            </div>
          </div>
        </button>

        {!isOpen && activeFiltersCount > 0 && (
          <div className="mt-4 flex flex-wrap gap-2 lg:hidden">
            {filters.palabra && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{filters.palabra}</span>}
            {filters.email && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{filters.email}</span>}
            {filters.sede && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{getSedeLabel(filters.sede)}</span>}
            {isTeusaquilloCampus && filters.bloque && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">Bloque {filters.bloque}</span>}
            {filters.piso && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">Piso {filters.piso}</span>}
            {filters.tipo && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{filters.tipo}</span>}
            {filters.estado && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{filters.estado}</span>}
            {filters.fecha && <span className="rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-700">{filters.fecha}</span>}
          </div>
        )}

        <div className={`${isOpen ? "block" : "hidden"} mt-5 lg:block`}>
          <form className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <FilterField
              label="ID"
              name="id"
              value={filters.id || ""}
              onChange={handleChange}
              type="text"
              placeholder="ID de reserva..."
            />

            <FilterField
              label="Palabra clave"
              name="palabra"
              value={filters.palabra || ""}
              onChange={handleChange}
              type="text"
              placeholder="Código, título o palabra..."
            />

            <FilterField
              label="Correo electrónico"
              name="email"
              value={filters.email || ""}
              onChange={handleChange}
              type="email"
              placeholder="Correo del usuario..."
            />

            <FilterField
              label="Sede"
              name="sede"
              value={filters.sede || ""}
              onChange={handleChange}
              type="select"
              placeholder="Todas las sedes"
              options={staticOptions.sedes}
            />

            <FilterField
              label="Tipo de espacio"
              name="tipo"
              value={filters.tipo || ""}
              onChange={handleChange}
              type="select"
              placeholder="Todos los tipos"
              options={staticOptions.tipos}
            />

            <FilterField
              label="Estado"
              name="estado"
              value={filters.estado || ""}
              onChange={handleChange}
              type="select"
              placeholder="Todos los estados"
              options={staticOptions.estados}
            />

            {isTeusaquilloCampus && (
              <FilterField
                label="Bloque"
                name="bloque"
                value={filters.bloque || ""}
                onChange={handleChange}
                type="select"
                placeholder="Todos los bloques"
                options={staticOptions.bloques}
              />
            )}

            <FilterField
              label="Piso"
              name="piso"
              value={filters.piso || ""}
              onChange={handleChange}
              type="select"
              placeholder="Todos los pisos"
              options={staticOptions.pisos}
            />

            <FilterField
              label="Agrupable"
              name="agrupable"
              value={filters.agrupable || ""}
              onChange={handleChange}
              type="select"
              placeholder="Todos"
              options={staticOptions.agrupable}
            />

            <div className="w-full">
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-neutral-600 md:text-sm">
                <CalendarDays className="h-4 w-4 text-purple-500" />
                Fecha
              </label>
              <input
                type="date"
                value={filters.fecha || ""}
                onChange={(event) => handleChange("fecha", event.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-purple-300 focus:border-transparent focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 md:py-2.5 md:text-base"
              />
            </div>

            {filters.tipo === "Coworking" ? (
              <>
                <FilterField
                  label="Tipo de coworking"
                  name="tiporecurso"
                  value={filters.tiporecurso || ""}
                  onChange={handleChange}
                  type="select"
                  placeholder="Todos"
                  options={staticOptions.tiposRecurso}
                />
                <FilterField
                  label="Franja horaria"
                  name="periodo"
                  value={
                    filters.horaInicio
                      ? `${coworkingPeriods.find((period) => period.start === filters.horaInicio)?.name || ""} (${filters.horaInicio} - ${filters.horaFin})`
                      : ""
                  }
                  onChange={handleChange}
                  type="select"
                  placeholder="Todas las franjas"
                  options={coworkingPeriods.map((period) => `${period.name} (${period.start} - ${period.end})`)}
                />
              </>
            ) : (
              <>
                <FilterField
                  label="Hora inicio"
                  name="horaInicio"
                  value={filters.horaInicio || ""}
                  onChange={handleChange}
                  type="select"
                  placeholder="Inicio"
                  options={startTimeOptions}
                />
                <FilterField
                  label="Hora fin"
                  name="horaFin"
                  value={filters.horaFin || ""}
                  onChange={handleChange}
                  type="select"
                  placeholder="Fin"
                  options={getEndTimeOptions(filters.horaInicio)}
                />
              </>
            )}
          </form>
        </div>
      </div>
    </aside>
  );
};

export default AdminSearchFilters;
