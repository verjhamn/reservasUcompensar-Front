/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { CalendarDays, ChevronDown, Clock, Eraser, Filter, Layers, MapPinned, Search } from "lucide-react";
import { getSedeLabel } from "../utils/constants";

const coworkingPeriods = [
  { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
  { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
  { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
  { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
];

const SPACE_TYPES = ["Coworking", "Espacio multipropósito", "Laboratorio", "Espacio de eventos", "Sala de clases"];
const RESOURCE_TYPES = ["Personal", "Puesto en L"];
const TEUSAQUILLO_BLOCKS = ["I", "J", "H", "F", "E", "D", "C", "B", "A"].map((block) => ({
  value: block,
  label: `Bloque ${block}`,
}));

const generateTimeOptions = (start, end) => {
  const times = [];
  for (let hour = start; hour <= end; hour += 1) {
    times.push(`${hour.toString().padStart(2, "0")}:00`);
  }
  return times;
};

const toInputDate = (value) => {
  if (!value) return "";
  if (value.includes("-")) return value;

  const [day, month, year] = value.split("/");
  return year && month && day ? `${year}-${month}-${day}` : "";
};

const formatFecha = (dateString) => {
  if (!dateString) return "";
  const [year, month, day] = dateString.split("-");
  return `${day}/${month}/${year}`;
};

const getDefaultFilters = (currentFilters, isGuestMode) => ({
  id: "",
  palabra: "",
  sede: currentFilters.sede || "",
  bloque: "",
  tipo: isGuestMode ? "Espacio de eventos" : "",
  piso: "",
  agrupable: "",
  tiporecurso: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
});

const FieldLabel = ({ icon: Icon, children }) => (
  <label className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-gray-700">
    <Icon className="h-4 w-4 text-purple-500" />
    {children}
  </label>
);

const SelectField = ({ label, name, value, onChange, options, placeholder, icon: Icon }) => (
  <div>
    <FieldLabel icon={Icon}>{label}</FieldLabel>
    <div className="relative">
      <select
        name={name}
        value={value || ""}
        onChange={onChange}
        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition hover:border-purple-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500"
      >
        <option value="">{placeholder}</option>
        {options.map((option) => {
          const isObjectOption = option !== null && typeof option === "object";
          const optionValue = isObjectOption ? option.value : option;
          const optionLabel = isObjectOption ? option.label : option;

          return (
          <option key={optionValue} value={optionValue}>
            {optionLabel}
          </option>
          );
        })}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
    </div>
  </div>
);

const TextField = ({ label, name, value, onChange, placeholder, type = "text", icon: Icon, min }) => (
  <div>
    <FieldLabel icon={Icon}>{label}</FieldLabel>
    <input
      type={type}
      name={name}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      min={min}
      className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition placeholder:text-gray-400 hover:border-purple-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500"
    />
  </div>
);

const SearchFilters = ({ filters, setFilters, onFilterChange, isGuestMode, availableFloors = [] }) => {
  const [showMoreFilters, setShowMoreFilters] = useState(isGuestMode);
  const startTimeOptions = useMemo(() => generateTimeOptions(7, 21), []);
  const isTeusaquilloCampus = filters.sede?.toString() === "2";

  const activeFiltersCount = [
    filters.id,
    filters.palabra,
    isTeusaquilloCampus ? filters.bloque : "",
    filters.tipo && !isGuestMode ? filters.tipo : "",
    filters.piso,
    filters.agrupable,
    filters.tiporecurso,
    filters.fecha,
    filters.horaInicio,
    filters.horaFin,
  ].filter(Boolean).length;

  const getEndTimeOptions = (startTime) => {
    if (!startTime) return generateTimeOptions(8, 22);
    const startHour = Number(startTime.split(":")[0]);
    return generateTimeOptions(startHour + 1, 22);
  };

  const updateFilters = (updatedFilters) => {
    setFilters(updatedFilters);
    if (typeof onFilterChange === "function") {
      onFilterChange(updatedFilters);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    const formattedValue = name === "fecha" ? formatFecha(value) : value;

    if (name === "tipo") {
      updateFilters({
        ...filters,
        tipo: formattedValue,
        horaInicio: "",
        horaFin: "",
        tiporecurso: "",
        piso: "",
      });
      return;
    }

    if (name === "horaInicio") {
      updateFilters({
        ...filters,
        horaInicio: formattedValue,
        horaFin: "",
      });
      return;
    }

    updateFilters({ ...filters, [name]: formattedValue });
  };

  const handlePeriodSelect = (event) => {
    const period = coworkingPeriods.find((item) => item.id === Number(event.target.value));
    if (!period) return;

    updateFilters({
      ...filters,
      horaInicio: period.start,
      horaFin: period.end,
    });
  };

  const handleClearFilters = () => {
    updateFilters(getDefaultFilters(filters, isGuestMode));
  };

  return (
    <aside className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-gray-50 px-5 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">Filtros</h3>
              {activeFiltersCount > 0 && (
                <span className="rounded-full bg-purple-600 px-2 py-0.5 text-xs font-bold text-white">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-medium text-gray-500">
              Sede seleccionada: {getSedeLabel(filters.sede) || "Sin sede"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClearFilters}
            className="rounded-lg p-2 text-gray-400 transition hover:bg-white hover:text-purple-600"
            title="Limpiar filtros"
          >
            <Eraser className="h-5 w-5" />
          </button>
        </div>
      </div>

      <form className="space-y-5 p-5">
        <div className="space-y-4">
          <TextField
            label="Código o palabra"
            name="palabra"
            value={filters.palabra}
            onChange={handleChange}
            placeholder="Ej: P3C01L"
            icon={Search}
          />

          {!isGuestMode && (
            <SelectField
              label="Tipo de espacio"
              name="tipo"
              value={filters.tipo}
              onChange={handleChange}
              options={SPACE_TYPES}
              placeholder="Todos los tipos"
              icon={Layers}
            />
          )}
        </div>

        <button
          type="button"
          onClick={() => setShowMoreFilters((current) => !current)}
          className="flex w-full items-center justify-between rounded-lg border border-purple-100 bg-purple-50 px-3 py-2 text-sm font-bold text-purple-700 transition hover:border-purple-200 hover:bg-purple-100"
        >
          <span>{showMoreFilters ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}</span>
          <ChevronDown className={`h-4 w-4 transition ${showMoreFilters ? "rotate-180" : ""}`} />
        </button>

        {showMoreFilters && (
          <div className="space-y-5 border-t border-gray-100 pt-5">
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Ubicación</p>
              {isTeusaquilloCampus && (
                <SelectField
                  label="Bloque"
                  name="bloque"
                  value={filters.bloque}
                  onChange={handleChange}
                  options={TEUSAQUILLO_BLOCKS}
                  placeholder="Todos los bloques"
                  icon={MapPinned}
                />
              )}
              <SelectField
                label="Piso"
                name="piso"
                value={filters.piso}
                onChange={handleChange}
                options={availableFloors}
                placeholder="Todos los pisos"
                icon={Layers}
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Disponibilidad</p>
              <TextField
                label="Fecha"
                name="fecha"
                value={toInputDate(filters.fecha)}
                onChange={handleChange}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                icon={CalendarDays}
              />

              {filters.tipo === "Coworking" ? (
                <>
                  <SelectField
                    label="Tipo de coworking"
                    name="tiporecurso"
                    value={filters.tiporecurso}
                    onChange={handleChange}
                    options={RESOURCE_TYPES}
                    placeholder="Todos"
                    icon={Layers}
                  />
                  <div>
                    <FieldLabel icon={Clock}>Franja horaria</FieldLabel>
                    <div className="relative">
                      <select
                        name="periodo"
                        value={filters.horaInicio ? coworkingPeriods.find((period) => period.start === filters.horaInicio)?.id ?? "" : ""}
                        onChange={handlePeriodSelect}
                        className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 pr-9 text-sm font-medium text-gray-700 outline-none transition hover:border-purple-300 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Todas las franjas</option>
                        {coworkingPeriods.map((period) => (
                          <option key={period.id} value={period.id}>
                            {period.name} ({period.start} - {period.end})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    </div>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <SelectField
                    label="Hora inicio"
                    name="horaInicio"
                    value={filters.horaInicio}
                    onChange={handleChange}
                    options={startTimeOptions}
                    placeholder="Inicio"
                    icon={Clock}
                  />
                  <SelectField
                    label="Hora fin"
                    name="horaFin"
                    value={filters.horaFin}
                    onChange={handleChange}
                    options={getEndTimeOptions(filters.horaInicio)}
                    placeholder="Fin"
                    icon={Clock}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </form>
    </aside>
  );
};

export default SearchFilters;
