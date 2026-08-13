import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDownTrayIcon,
  ArrowPathIcon,
  CalendarIcon,
  ChartBarSquareIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpDownIcon,
  ClockIcon,
  FunnelIcon,
  TableCellsIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { getGeneralReport } from "../../Services/reportsService";
import { downloadReport } from "../../Services/DownloadReport";
import ReportsDashboard from "./ReportsDashboard";

const COLUMNS = [
  { key: "estado", label: "ESTADO", options: ["Creada", "Completada", "Cancelada"] },
  { key: "fecha_hora_registro", label: "FECHA Y HORA DE REGISTRO" },
  { key: "fecha_reserva", label: "FECHA DE RESERVA" },
  { key: "hora_inicio_reserva", label: "HORA DE INICIO DE RESERVA" },
  { key: "hora_fin_reserva", label: "HORA DE FIN DE RESERVA" },
  { key: "codigo_espacio", label: "CÓDIGO DE ESPACIO" },
  { key: "usuario", label: "USUARIO" },
  { key: "cargo_rol", label: "CARGO/ROL" },
  { key: "correo", label: "CORREO" },
  { key: "titulo_reserva", label: "TÍTULO DE RESERVA" },
];

const EMPTY_REPORT = { items: [], totalRecords: 0, totalPages: 1 };

const normalizeReportResponse = (response, perPage) => {
  if (!response) return EMPTY_REPORT;

  const wrappedPayload = response.data && response.data.pagination ? response.data : response;

  if (wrappedPayload.pagination) {
    const items = Array.isArray(wrappedPayload.data) ? wrappedPayload.data : [];
    const totalRecords = Number(
      wrappedPayload.pagination.total_records
      ?? wrappedPayload["reservas actuales"]
      ?? items.length,
    );

    return {
      items,
      totalRecords: Math.max(0, totalRecords),
      totalPages: Math.max(1, Number(wrappedPayload.pagination.last_page) || Math.ceil(totalRecords / perPage)),
    };
  }

  const nativePaginator = response.data?.current_page ? response.data : response.current_page ? response : null;
  if (nativePaginator) {
    const items = Array.isArray(nativePaginator.data) ? nativePaginator.data : [];
    const totalRecords = Number(nativePaginator.total ?? items.length);
    return {
      items,
      totalRecords: Math.max(0, totalRecords),
      totalPages: Math.max(1, Number(nativePaginator.last_page) || Math.ceil(totalRecords / perPage)),
    };
  }

  const directItems = Array.isArray(response)
    ? response
    : Array.isArray(response.data)
      ? response.data
      : Array.isArray(response.items)
        ? response.items
        : [];
  const totalRecords = Number(response.total ?? response["reservas actuales"] ?? directItems.length);

  return {
    items: directItems,
    totalRecords: Math.max(0, totalRecords),
    totalPages: Math.max(1, Number(response.last_page ?? response.totalPages) || Math.ceil(totalRecords / perPage)),
  };
};

const formatNumber = (value) => new Intl.NumberFormat("es-CO").format(value || 0);

const ReportsView = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [displayData, setDisplayData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: "asc" });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const requestId = useRef(0);

  const fetchData = useCallback(async () => {
    const currentRequest = ++requestId.current;
    setLoading(true);
    setError("");

    try {
      const response = await getGeneralReport({
        page: currentPage,
        perPage,
        columnFilters: filters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      });
      const report = normalizeReportResponse(response, perPage);

      if (currentRequest !== requestId.current) return;
      setDisplayData(report.items);
      setTotalRecords(report.totalRecords);
      setTotalPages(report.totalPages);
      setLastUpdated(new Date());
    } catch (fetchError) {
      if (currentRequest !== requestId.current) return;
      console.error("Error al obtener datos:", fetchError);
      setError("No fue posible cargar el reporte. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [currentPage, filters, perPage, sortConfig]);

  useEffect(() => {
    const timer = setTimeout(fetchData, 500);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const handleFilterChange = (key, value) => {
    setFilters((previous) => ({ ...previous, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortConfig((previous) => ({
      field,
      direction: previous.field === field && previous.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadReport(filters);
    } catch (downloadReportError) {
      console.error("Error al descargar:", downloadReportError);
      setDownloadError("No se pudo generar el archivo. Intenta nuevamente.");
    } finally {
      setDownloading(false);
    }
  };

  const renderDateRangeFilter = (key) => {
    const fromKey = `${key}_desde`;
    const toKey = `${key}_hasta`;
    const isActive = filters[fromKey] || filters[toKey];

    return (
      <div className={`flex flex-col gap-1.5 rounded-md p-1 transition-all ${isActive ? "bg-turquoise-50 ring-1 ring-turquoise-200" : ""}`}>
        <label>
          <span className="mb-0.5 flex items-center gap-1 text-xs font-medium text-gray-400">
            <CalendarIcon className="h-3 w-3" /> Desde
          </span>
          <input
            type="date"
            className="w-full rounded border px-2 py-1 text-xs focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
            value={filters[fromKey] || ""}
            onChange={(event) => handleFilterChange(fromKey, event.target.value)}
          />
        </label>
        <label>
          <span className="mb-0.5 flex items-center gap-1 text-xs font-medium text-gray-400">
            <CalendarIcon className="h-3 w-3" /> Hasta
          </span>
          <input
            type="date"
            className="w-full rounded border px-2 py-1 text-xs focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
            value={filters[toKey] || ""}
            onChange={(event) => handleFilterChange(toKey, event.target.value)}
          />
        </label>
      </div>
    );
  };

  const renderFilterInput = (key, label, options = []) => {
    if (key === "estado") {
      return (
        <select
          className="w-full rounded border px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
          value={filters[key] || ""}
          onChange={(event) => handleFilterChange(key, event.target.value)}
          aria-label={`Filtrar por ${label.toLowerCase()}`}
        >
          <option value="">Todos</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      );
    }

    if (key.includes("fecha")) return renderDateRangeFilter(key);

    if (key.includes("hora")) {
      return (
        <div className="relative">
          <ClockIcon className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="time"
            className="w-full rounded border py-1 pl-8 pr-2 text-sm focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
            value={filters[key] || ""}
            onChange={(event) => handleFilterChange(key, event.target.value)}
            aria-label={`Filtrar por ${label.toLowerCase()}`}
          />
        </div>
      );
    }

    return (
      <input
        type="text"
        className="w-full rounded border px-2 py-1 text-sm focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
        placeholder={`Filtrar ${label.toLowerCase()}`}
        value={filters[key] || ""}
        onChange={(event) => handleFilterChange(key, event.target.value)}
      />
    );
  };

  const getStatusColor = (status) => {
    switch (String(status).toLowerCase()) {
      case "creada": return "bg-turquoise-50 text-turquoise-700 ring-turquoise-200";
      case "completada": return "bg-green-50 text-green-700 ring-green-200";
      case "cancelada": return "bg-magenta-50 text-magenta-700 ring-magenta-200";
      default: return "bg-gray-100 text-gray-700 ring-gray-200";
    }
  };

  const activeFilterCount = Object.values(filters).filter((value) => String(value || "").trim()).length;
  const firstVisibleRecord = totalRecords > 0 ? Math.min((currentPage - 1) * perPage + 1, totalRecords) : 0;
  const lastVisibleRecord = Math.min(currentPage * perPage, totalRecords);

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Analítica de ocupación</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-blue-dark-500 sm:text-3xl">Reportes de reservas</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Consulta el comportamiento de las reservas, explora el detalle y exporta la información con los mismos filtros.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-gray-500">
              Actualizado a las {lastUpdated.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            type="button"
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-turquoise-400 hover:text-turquoise-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-5 w-5 ${loading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </header>

      <nav className="mb-6 flex w-full gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:w-fit" aria-label="Secciones de reportes">
        {[
          { id: "dashboard", label: "Dashboard", icon: ChartBarSquareIcon },
          { id: "detail", label: "Detalle y exportación", icon: TableCellsIcon },
        ].map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveSection(id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition sm:flex-none ${
              activeSection === id
                ? "bg-blue-dark-500 text-white shadow-sm"
                : "text-gray-600 hover:bg-gray-50 hover:text-blue-dark-500"
            }`}
            aria-current={activeSection === id ? "page" : undefined}
          >
            <Icon className="h-5 w-5" /> {label}
          </button>
        ))}
      </nav>

      {error && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-magenta-200 bg-magenta-50 px-4 py-3 text-sm text-magenta-800 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{error}</span>
          <button type="button" onClick={fetchData} className="font-semibold underline underline-offset-2">Reintentar</button>
        </div>
      )}

      {activeSection === "dashboard" ? (
        <>
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" aria-label="Filtros del dashboard">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-turquoise-600" />
                <h2 className="font-semibold text-blue-dark-500">Filtros del análisis</h2>
                {activeFilterCount > 0 && <span className="rounded-full bg-turquoise-50 px-2 py-0.5 text-xs font-bold text-turquoise-700">{activeFilterCount}</span>}
              </div>
              {activeFilterCount > 0 && (
                <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-magenta-600">
                  <XMarkIcon className="h-4 w-4" /> Limpiar
                </button>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <label className="text-sm font-medium text-gray-600">
                Estado
                <select
                  value={filters.estado || ""}
                  onChange={(event) => handleFilterChange("estado", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="Creada">Creada</option>
                  <option value="Completada">Completada</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </label>
              <label className="text-sm font-medium text-gray-600">
                Sede
                <input
                  type="text"
                  value={filters.sede || ""}
                  onChange={(event) => handleFilterChange("sede", event.target.value)}
                  placeholder="Ej. Campus Av. 68"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Tipo de espacio
                <input
                  type="text"
                  value={filters.tipo_espacio || ""}
                  onChange={(event) => handleFilterChange("tipo_espacio", event.target.value)}
                  placeholder="Ej. Laboratorio"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Reserva desde
                <input
                  type="date"
                  value={filters.fecha_reserva_desde || ""}
                  onChange={(event) => handleFilterChange("fecha_reserva_desde", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Reserva hasta
                <input
                  type="date"
                  value={filters.fecha_reserva_hasta || ""}
                  onChange={(event) => handleFilterChange("fecha_reserva_hasta", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
            </div>
          </section>

          <ReportsDashboard
            data={displayData}
            totalRecords={totalRecords}
            currentPage={currentPage}
            loading={loading}
            error={error}
          />
        </>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" aria-label="Detalle del reporte">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-blue-dark-500">Reporte general de reservas</h2>
                {activeFilterCount > 0 && (
                  <button type="button" onClick={clearFilters} className="inline-flex items-center gap-1 rounded-full bg-turquoise-50 px-2.5 py-1 text-xs font-semibold text-turquoise-700 hover:bg-turquoise-100">
                    {activeFilterCount} filtros <XMarkIcon className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-1 text-sm text-gray-500">Filtra por columna, ordena los resultados o descarga el archivo Excel.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <select
                value={perPage}
                onChange={(event) => { setPerPage(Number(event.target.value)); setCurrentPage(1); }}
                className="rounded-lg border-gray-300 py-2 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                aria-label="Resultados por página"
              >
                <option value={10}>10 por página</option>
                <option value={20}>20 por página</option>
                <option value={50}>50 por página</option>
              </select>
              <button
                type="button"
                onClick={handleDownload}
                disabled={downloading}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-turquoise-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-turquoise-700 disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {downloading ? <ArrowPathIcon className="h-5 w-5 animate-spin" /> : <ArrowDownTrayIcon className="h-5 w-5" />}
                {downloading ? "Generando..." : "Exportar .xlsx"}
              </button>
            </div>
          </div>

          {downloadError && <p className="border-b border-magenta-100 bg-magenta-50 px-5 py-3 text-sm text-magenta-800" role="alert">{downloadError}</p>}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  {COLUMNS.map(({ key, label, options }) => (
                    <th key={key} scope="col" className="min-w-44 bg-gray-50 px-5 py-3 text-left align-top first:min-w-36">
                      <div className="flex flex-col gap-3">
                        <button
                          type="button"
                          className="group flex w-full items-center justify-between gap-2 text-left"
                          onClick={() => handleSort(key)}
                        >
                          <span className="text-xs font-semibold uppercase tracking-wider text-gray-700">{label}</span>
                          <ChevronUpDownIcon className={`h-4 w-4 shrink-0 transition-colors group-hover:text-turquoise-600 ${sortConfig.field === key ? "text-turquoise-600" : "text-gray-400"}`} />
                        </button>
                        {renderFilterInput(key, label, options)}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {loading && !displayData.length ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-6 py-14 text-center">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500"><ArrowPathIcon className="h-6 w-6 animate-spin text-turquoise-500" /> Cargando reporte...</span>
                    </td>
                  </tr>
                ) : !displayData.length ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-6 py-14 text-center text-sm text-gray-500">No se encontraron resultados con los filtros seleccionados.</td>
                  </tr>
                ) : (
                  displayData.map((row, index) => (
                    <tr key={row.numero ?? `${row.correo}-${index}`} className={`transition hover:bg-turquoise-50/40 ${loading ? "opacity-60" : ""}`}>
                      {COLUMNS.map(({ key }) => (
                        <td key={key} className="max-w-xs whitespace-nowrap px-5 py-4 text-sm text-gray-700">
                          {key === "estado" ? (
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${getStatusColor(row[key])}`}>{row[key] || "Sin estado"}</span>
                          ) : (
                            <span className="block max-w-xs truncate" title={row[key] || undefined}>{row[key] ?? "—"}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              Mostrando <span className="font-semibold">{formatNumber(firstVisibleRecord)}–{formatNumber(lastVisibleRecord)}</span> de <span className="font-semibold">{formatNumber(totalRecords)}</span> resultados
            </p>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1 || loading}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="min-w-32 text-center text-sm font-medium text-gray-700">Página {formatNumber(currentPage)} de {formatNumber(totalPages)}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage >= totalPages || loading}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                aria-label="Página siguiente"
              >
                <ChevronRightIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ReportsView;
