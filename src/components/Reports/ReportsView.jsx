import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getGeneralDashboardReport, getGeneralReport } from "../../Services/reportsService";
import { downloadReport } from "../../Services/DownloadReport";
import ReportsDashboard from "./ReportsDashboard";
import ReportsCalendar from "./calendar/ReportsCalendar";
import {
  isEventReservation,
  isFutureActiveReservation,
  normalizeSearchText,
  parseReportDate,
  startOfLocalDay,
} from "./reportDateUtils";

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

const normalizeDashboardResponse = (response) => {
  if (!response) return { items: [], totalRecords: 0 };

  const payload = response.data
    && !Array.isArray(response.data)
    && (Array.isArray(response.data.data) || response.data["reservas actuales"] !== undefined)
    ? response.data
    : response;
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.items)
        ? payload.items
        : [];
  const totalRecords = Number(payload["reservas actuales"] ?? payload.total ?? items.length);

  return {
    items,
    totalRecords: Math.max(0, Number.isFinite(totalRecords) ? totalRecords : items.length),
  };
};

const filterDashboardData = (data, filters) => {
  const scope = filters.scope || "upcoming";
  const status = normalizeSearchText(filters.estado);
  const campus = normalizeSearchText(filters.sede);
  const spaceType = normalizeSearchText(filters.tipo_espacio);
  const fromDate = parseReportDate(filters.fecha_reserva_desde);
  const toDate = parseReportDate(filters.fecha_reserva_hasta);
  const today = startOfLocalDay();

  return data.filter((row) => {
    const isUpcoming = isFutureActiveReservation(row, today);
    if (scope === "upcoming" && !isUpcoming) return false;
    if (scope === "events" && (!isUpcoming || !isEventReservation(row))) return false;
    if (status && normalizeSearchText(row.estado) !== status) return false;
    if (campus && !normalizeSearchText(row.sede).includes(campus)) return false;
    if (spaceType && !normalizeSearchText(row.tipo_espacio).includes(spaceType)) return false;

    if (fromDate || toDate) {
      const reservationDate = parseReportDate(row.fecha_reserva);
      if (!reservationDate) return false;
      if (fromDate && reservationDate < fromDate) return false;
      if (toDate && reservationDate > toDate) return false;
    }

    return true;
  });
};

const formatNumber = (value) => new Intl.NumberFormat("es-CO").format(value || 0);

const ReportsView = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [dashboardData, setDashboardData] = useState([]);
  const [dashboardTotalRecords, setDashboardTotalRecords] = useState(0);
  const [dashboardFilters, setDashboardFilters] = useState({ scope: "upcoming" });
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const [dashboardLastUpdated, setDashboardLastUpdated] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [tableError, setTableError] = useState("");
  const [tableLastUpdated, setTableLastUpdated] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [tableFilters, setTableFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ field: null, direction: "asc" });
  const [tableTotalRecords, setTableTotalRecords] = useState(0);
  const [tableTotalPages, setTableTotalPages] = useState(1);
  const tableRequestId = useRef(0);
  const dashboardRequestId = useRef(0);

  const fetchTableData = useCallback(async () => {
    const currentRequest = ++tableRequestId.current;
    setTableLoading(true);
    setTableError("");

    try {
      const response = await getGeneralReport({
        page: currentPage,
        perPage,
        columnFilters: tableFilters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction,
      });
      const report = normalizeReportResponse(response, perPage);

      if (currentRequest !== tableRequestId.current) return;
      setTableData(report.items);
      setTableTotalRecords(report.totalRecords);
      setTableTotalPages(report.totalPages);
      setTableLastUpdated(new Date());
    } catch (fetchError) {
      if (currentRequest !== tableRequestId.current) return;
      console.error("Error al obtener el detalle del reporte:", fetchError);
      setTableError("No fue posible cargar el reporte. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      if (currentRequest === tableRequestId.current) setTableLoading(false);
    }
  }, [currentPage, perPage, sortConfig, tableFilters]);

  const fetchDashboardData = useCallback(async () => {
    const currentRequest = ++dashboardRequestId.current;
    setDashboardLoading(true);
    setDashboardError("");

    try {
      const response = await getGeneralDashboardReport();
      const report = normalizeDashboardResponse(response);

      if (currentRequest !== dashboardRequestId.current) return;
      setDashboardData(report.items);
      setDashboardTotalRecords(report.totalRecords);
      setDashboardLastUpdated(new Date());
    } catch (fetchError) {
      if (currentRequest !== dashboardRequestId.current) return;
      console.error("Error al obtener el consolidado del dashboard:", fetchError);
      setDashboardError("No fue posible cargar el consolidado del dashboard. Revisa tu conexión e inténtalo de nuevo.");
    } finally {
      if (currentRequest === dashboardRequestId.current) setDashboardLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchTableData, 500);
    return () => clearTimeout(timer);
  }, [fetchTableData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleTableFilterChange = (key, value) => {
    setTableFilters((previous) => ({ ...previous, [key]: value }));
    setCurrentPage(1);
  };

  const clearTableFilters = () => {
    setTableFilters({});
    setCurrentPage(1);
  };

  const handleDashboardFilterChange = (key, value) => {
    setDashboardFilters((previous) => ({ ...previous, [key]: value }));
  };

  const clearDashboardFilters = () => setDashboardFilters({ scope: "upcoming" });

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
      await downloadReport(tableFilters);
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
    const isActive = tableFilters[fromKey] || tableFilters[toKey];

    return (
      <div className={`flex flex-col gap-1.5 rounded-md p-1 transition-all ${isActive ? "bg-turquoise-50 ring-1 ring-turquoise-200" : ""}`}>
        <label>
          <span className="mb-0.5 flex items-center gap-1 text-xs font-medium text-gray-400">
            <CalendarIcon className="h-3 w-3" /> Desde
          </span>
          <input
            type="date"
            className="w-full rounded border px-2 py-1 text-xs focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
            value={tableFilters[fromKey] || ""}
            onChange={(event) => handleTableFilterChange(fromKey, event.target.value)}
          />
        </label>
        <label>
          <span className="mb-0.5 flex items-center gap-1 text-xs font-medium text-gray-400">
            <CalendarIcon className="h-3 w-3" /> Hasta
          </span>
          <input
            type="date"
            className="w-full rounded border px-2 py-1 text-xs focus:border-transparent focus:ring-2 focus:ring-turquoise-500"
            value={tableFilters[toKey] || ""}
            onChange={(event) => handleTableFilterChange(toKey, event.target.value)}
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
          value={tableFilters[key] || ""}
          onChange={(event) => handleTableFilterChange(key, event.target.value)}
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
            value={tableFilters[key] || ""}
            onChange={(event) => handleTableFilterChange(key, event.target.value)}
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
        value={tableFilters[key] || ""}
        onChange={(event) => handleTableFilterChange(key, event.target.value)}
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

  const filteredDashboardData = useMemo(
    () => filterDashboardData(dashboardData, dashboardFilters),
    [dashboardData, dashboardFilters],
  );
  const dashboardFilterCount = Object.entries(dashboardFilters).filter(([key, value]) => (
    String(value || "").trim() && (key !== "scope" || value !== "upcoming")
  )).length;
  const tableFilterCount = Object.values(tableFilters).filter((value) => String(value || "").trim()).length;
  const firstVisibleRecord = tableTotalRecords > 0
    ? Math.min((currentPage - 1) * perPage + 1, tableTotalRecords)
    : 0;
  const lastVisibleRecord = Math.min(currentPage * perPage, tableTotalRecords);
  const usesDashboardData = activeSection === "dashboard" || activeSection === "calendar";
  const activeLoading = usesDashboardData ? dashboardLoading : tableLoading;
  const activeError = usesDashboardData ? dashboardError : tableError;
  const activeLastUpdated = usesDashboardData ? dashboardLastUpdated : tableLastUpdated;
  const refreshActiveSection = usesDashboardData ? fetchDashboardData : fetchTableData;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-primary-600">Analítica de ocupación</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-blue-dark-500 sm:text-3xl">Reportes de reservas</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-600">
            Analiza el consolidado general y consulta o exporta el detalle con filtros independientes.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {activeLastUpdated && (
            <span className="text-xs text-gray-500">
              Actualizado a las {activeLastUpdated.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
          <button
            type="button"
            onClick={refreshActiveSection}
            disabled={activeLoading}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-turquoise-400 hover:text-turquoise-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <ArrowPathIcon className={`h-5 w-5 ${activeLoading ? "animate-spin" : ""}`} />
            Actualizar
          </button>
        </div>
      </header>

      <nav className="mb-6 flex w-full gap-1 rounded-xl border border-gray-200 bg-white p-1 shadow-sm sm:w-fit" aria-label="Secciones de reportes">
        {[
          { id: "dashboard", label: "Dashboard", icon: ChartBarSquareIcon },
          { id: "calendar", label: "Calendario", icon: CalendarIcon },
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

      {activeError && (
        <div className="mb-6 flex flex-col gap-3 rounded-xl border border-magenta-200 bg-magenta-50 px-4 py-3 text-sm text-magenta-800 sm:flex-row sm:items-center sm:justify-between" role="alert">
          <span>{activeError}</span>
          <button type="button" onClick={refreshActiveSection} className="font-semibold underline underline-offset-2">Reintentar</button>
        </div>
      )}

      {activeSection === "dashboard" ? (
        <>
          <section className="mb-6 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm" aria-label="Filtros del dashboard">
            <div className="mb-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <FunnelIcon className="h-5 w-5 text-turquoise-600" />
                <h2 className="font-semibold text-blue-dark-500">Filtros del análisis</h2>
                {dashboardFilterCount > 0 && <span className="rounded-full bg-turquoise-50 px-2 py-0.5 text-xs font-bold text-turquoise-700">{dashboardFilterCount}</span>}
              </div>
              {dashboardFilterCount > 0 && (
                <button type="button" onClick={clearDashboardFilters} className="inline-flex items-center gap-1 text-sm font-semibold text-gray-500 hover:text-magenta-600">
                  <XMarkIcon className="h-4 w-4" /> Limpiar
                </button>
              )}
            </div>
            <p className="mb-4 text-xs text-gray-500">
              Estos filtros solo modifican los indicadores del dashboard; no afectan la tabla ni el archivo exportado.
            </p>
            <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Enfoque temporal del dashboard">
              {[
                { value: "upcoming", label: "Próximas activas" },
                { value: "events", label: "Próximos eventos" },
                { value: "all", label: "Todo el histórico" },
              ].map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => handleDashboardFilterChange("scope", option.value)}
                  className={`rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                    (dashboardFilters.scope || "upcoming") === option.value
                      ? "bg-blue-dark-500 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-blue-dark-500"
                  }`}
                  aria-pressed={(dashboardFilters.scope || "upcoming") === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              <label className="text-sm font-medium text-gray-600">
                Estado
                <select
                  value={dashboardFilters.estado || ""}
                  onChange={(event) => handleDashboardFilterChange("estado", event.target.value)}
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
                  value={dashboardFilters.sede || ""}
                  onChange={(event) => handleDashboardFilterChange("sede", event.target.value)}
                  placeholder="Ej. Campus Av. 68"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Tipo de espacio
                <input
                  type="text"
                  value={dashboardFilters.tipo_espacio || ""}
                  onChange={(event) => handleDashboardFilterChange("tipo_espacio", event.target.value)}
                  placeholder="Ej. Laboratorio"
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Reserva desde
                <input
                  type="date"
                  value={dashboardFilters.fecha_reserva_desde || ""}
                  onChange={(event) => handleDashboardFilterChange("fecha_reserva_desde", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
              <label className="text-sm font-medium text-gray-600">
                Reserva hasta
                <input
                  type="date"
                  value={dashboardFilters.fecha_reserva_hasta || ""}
                  onChange={(event) => handleDashboardFilterChange("fecha_reserva_hasta", event.target.value)}
                  className="mt-1.5 w-full rounded-lg border-gray-300 text-sm focus:border-turquoise-500 focus:ring-turquoise-500"
                />
              </label>
            </div>
          </section>

          <ReportsDashboard
            data={filteredDashboardData}
            allData={dashboardData}
            consolidatedTotalRecords={dashboardTotalRecords}
            loading={dashboardLoading}
            error={dashboardError}
            scope={dashboardFilters.scope || "upcoming"}
            isFiltered={dashboardFilterCount > 0}
          />
        </>
      ) : activeSection === "calendar" ? (
        <ReportsCalendar data={dashboardData} loading={dashboardLoading} />
      ) : (
        <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm" aria-label="Detalle del reporte">
          <div className="flex flex-col gap-4 border-b border-gray-200 px-5 py-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-blue-dark-500">Reporte general de reservas</h2>
                {tableFilterCount > 0 && (
                  <button type="button" onClick={clearTableFilters} className="inline-flex items-center gap-1 rounded-full bg-turquoise-50 px-2.5 py-1 text-xs font-semibold text-turquoise-700 hover:bg-turquoise-100">
                    {tableFilterCount} filtros <XMarkIcon className="h-3.5 w-3.5" />
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
                {tableLoading && !tableData.length ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-6 py-14 text-center">
                      <span className="inline-flex items-center gap-2 text-sm text-gray-500"><ArrowPathIcon className="h-6 w-6 animate-spin text-turquoise-500" /> Cargando reporte...</span>
                    </td>
                  </tr>
                ) : !tableData.length ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="px-6 py-14 text-center text-sm text-gray-500">No se encontraron resultados con los filtros seleccionados.</td>
                  </tr>
                ) : (
                  tableData.map((row, index) => (
                    <tr key={row.numero ?? `${row.correo}-${index}`} className={`transition hover:bg-turquoise-50/40 ${tableLoading ? "opacity-60" : ""}`}>
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
              Mostrando <span className="font-semibold">{formatNumber(firstVisibleRecord)}–{formatNumber(lastVisibleRecord)}</span> de <span className="font-semibold">{formatNumber(tableTotalRecords)}</span> resultados
            </p>
            <div className="flex items-center justify-between gap-2 sm:justify-end">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage <= 1 || tableLoading}
                className="rounded-lg border border-gray-300 p-2 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-300"
                aria-label="Página anterior"
              >
                <ChevronLeftIcon className="h-5 w-5" />
              </button>
              <span className="min-w-32 text-center text-sm font-medium text-gray-700">Página {formatNumber(currentPage)} de {formatNumber(tableTotalPages)}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(tableTotalPages, page + 1))}
                disabled={currentPage >= tableTotalPages || tableLoading}
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
