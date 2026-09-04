/* eslint-disable react/prop-types */
import { FunnelIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const ESTADO_OPTIONS = [
  { value: "", label: "Todas" },
  { value: "Creada", label: "Creada" },
  { value: "Completada", label: "Completada" },
  { value: "Cancelada", label: "Cancelada" },
];

const LEGEND_ITEMS = [
  { label: "Creada", swatch: "bg-turquoise-500" },
  { label: "Completada", swatch: "bg-green-500" },
  { label: "Cancelada", swatch: "bg-magenta-500" },
];

const CalendarFiltersPanel = ({ filters, onFilterChange }) => (
  <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
    <div className="mb-3 flex items-center gap-2">
      <FunnelIcon className="h-4 w-4 text-turquoise-600" />
      <h3 className="text-sm font-bold text-blue-dark-500">Filtros</h3>
    </div>

    <label className="relative block">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        value={filters.search}
        onChange={(event) => onFilterChange("search", event.target.value)}
        placeholder="Buscar título, espacio, sede..."
        className="w-full rounded-lg border-gray-300 py-2 pl-8 pr-2 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
        aria-label="Buscar eventos"
      />
    </label>

    <div className="mt-4">
      <p className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-gray-400">Estado</p>
      <div className="flex flex-wrap gap-1.5">
        {ESTADO_OPTIONS.map((option) => (
          <button
            key={option.value || "todas"}
            type="button"
            onClick={() => onFilterChange("estado", option.value)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              filters.estado === option.value
                ? "bg-blue-dark-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            aria-pressed={filters.estado === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>

    <label
      className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2.5"
      onClick={() => onFilterChange("soloProximos", !filters.soloProximos)}
    >
      <span className="text-xs font-semibold text-gray-600">
        {filters.soloProximos ? "Solo próximos" : "Incluir pasados"}
      </span>
      <span
        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
          filters.soloProximos ? "bg-turquoise-600" : "bg-gray-300"
        }`}
      >
        <span
          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
            filters.soloProximos ? "translate-x-[18px]" : "translate-x-1"
          }`}
        />
      </span>
    </label>

    <div className="mt-4 border-t border-gray-100 pt-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-400">Convenciones</p>
      <ul className="space-y-1.5">
        {LEGEND_ITEMS.map((item) => (
          <li key={item.label} className="flex items-center gap-2 text-xs text-gray-600">
            <span className={`h-2 w-2 rounded-full ${item.swatch}`} aria-hidden="true" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CalendarFiltersPanel;
