import React, { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  ChevronUpDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowDownTrayIcon,
  CalendarIcon,
  ClockIcon
} from "@heroicons/react/24/outline";
import { getGeneralReport } from "../../Services/reportsService";
import { downloadReport } from "../../Services/DownloadReport";

const ReportsView = () => {
  // Modificar la definición de columnas para incluir estado al inicio
  const columns = [
    {
      key: 'estado',
      label: 'ESTADO',
      options: ['Creada', 'Cancelada'] // Opciones para el filtro dropdown
    },
    { key: 'fecha_hora_registro', label: 'FECHA Y HORA DE REGISTRO' },
    { key: 'fecha_reserva', label: 'FECHA DE RESERVA' },
    { key: 'hora_inicio_reserva', label: 'HORA DE INICIO DE RESERVA' },
    { key: 'hora_fin_reserva', label: 'HORA DE FIN DE RESERVA' },
    { key: 'codigo_espacio', label: 'CÓDIGO DE ESPACIO' },
    { key: 'usuario', label: 'USUARIO' },
    { key: 'cargo_rol', label: 'CARGO/ROL' },
    { key: 'correo', label: 'CORREO' },
    { key: 'titulo_reserva', label: 'TÍTULO DE RESERVA' }
  ];

  const [displayData, setDisplayData] = useState([]); // Datos paginados
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc'
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Obtener datos del servidor
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGeneralReport({
        page: currentPage,
        perPage: perPage,
        columnFilters: filters,
        sortField: sortConfig.field,
        sortDirection: sortConfig.direction
      });
      let items = [];
      let t_records = 0;
      let t_pages = 1;

      if (response && response.data && response.data.pagination) {
        // Formato Envoltorio doble: { data: { data: [], pagination: {} } }
        items = Array.isArray(response.data.data) ? response.data.data : [];
        t_records = response.data.pagination.total_records || 0;
        t_pages = response.data.pagination.last_page || 1;
      } else if (response && response.pagination) {
        // Formato Reportes Laravel Personalizado (data = [], pagination = {})
        items = Array.isArray(response.data) ? response.data : [];
        t_records = response.pagination.total_records || 0;
        t_pages = response.pagination.last_page || 1;
      } else if (response && response.data && Array.isArray(response.data.data)) {
        // Native LengthAwarePaginator en response.data
        items = response.data.data;
        t_records = response.data.total;
        t_pages = response.data.last_page;
      } else if (response && response.data && typeof response.data === 'object' && response.data.current_page) {
        // Formato híbrido alternativo donde todo está en response.data
        items = Array.isArray(response.data.data) ? response.data.data : [];
        t_records = response.data.total;
        t_pages = response.data.last_page;
      } else if (response && Array.isArray(response.data)) {
        // Formato plano simple
        items = response.data;
        t_records = response.total || items.length;
        t_pages = response.last_page || Math.ceil(t_records / perPage);
      } else if (Array.isArray(response)) {
        // Array directo
        items = response;
        t_records = items.length;
        t_pages = Math.ceil(t_records / perPage);
      } else if (response && Array.isArray(response.items)) {
        // Formato items personalizado antiguo
        items = response.items;
        t_records = response.total || items.length;
        t_pages = response.last_page || response.totalPages || Math.ceil(t_records / perPage);
      }

      // Seguridad total: Evitar mostrar menos de 1 página
      t_pages = Math.max(1, t_pages);
      t_records = Math.max(0, t_records);

      setDisplayData(items);
      setTotalRecords(t_records);
      setTotalPages(t_pages);
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Monitoreo Reactivo unificado (con Debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 500);
    return () => clearTimeout(timer);
  }, [filters, currentPage, perPage, sortConfig]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
    if (currentPage !== 1) setCurrentPage(1);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadReport(filters);
    } catch (error) {
      console.error("Error al descargar:", error);
    } finally {
      setDownloading(false);
    }
  };

  const getFilterType = (key) => {
    if (key.includes('fecha')) return 'date';
    if (key.includes('hora')) return 'time';
    return 'text';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Creada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderDateRangeFilter = (key) => {
    const desdeKey = `${key}_desde`;
    const hastaKey = `${key}_hasta`;
    const isActive = filters[desdeKey] || filters[hastaKey];

    return (
      <div className={`flex flex-col gap-1.5 rounded-md p-1 transition-all ${isActive ? 'bg-turquesa/5 ring-1 ring-turquesa/30' : ''}`}>
        <div>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-400 mb-0.5">
            <CalendarIcon className="w-3 h-3" />
            Desde
          </span>
          <input
            type="date"
            className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-turquesa focus:border-transparent"
            value={filters[desdeKey] || ''}
            onChange={(e) => handleFilterChange(desdeKey, e.target.value)}
          />
        </div>
        <div>
          <span className="flex items-center gap-1 text-xs font-medium text-gray-400 mb-0.5">
            <CalendarIcon className="w-3 h-3" />
            Hasta
          </span>
          <input
            type="date"
            className="w-full px-2 py-1 text-xs border rounded focus:ring-2 focus:ring-turquesa focus:border-transparent"
            value={filters[hastaKey] || ''}
            onChange={(e) => handleFilterChange(hastaKey, e.target.value)}
          />
        </div>
      </div>
    );
  };

  const renderFilterInput = (key, label, options) => {
    if (key === 'estado') {
      return (
        <select
          className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-turquesa focus:border-transparent"
          value={filters[key] || ''}
          onChange={(e) => handleFilterChange(key, e.target.value)}
        >
          <option value="">Todos</option>
          {options.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      );
    }

    const type = getFilterType(key);

    switch (type) {
      case 'date':
        return renderDateRangeFilter(key);

      case 'time':
        return (
          <div className="relative">
            <input
              type="time"
              className="w-full px-2 py-1 text-sm border rounded pl-8 focus:ring-2 focus:ring-turquesa focus:border-transparent"
              value={filters[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
            <ClockIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
        );

      default:
        return (
          <input
            type="text"
            className="w-full px-2 py-1 text-sm border rounded focus:ring-2 focus:ring-turquesa focus:border-transparent"
            placeholder={`Filtrar ${label.toLowerCase()}`}
            value={filters[key] || ''}
            onChange={(e) => handleFilterChange(key, e.target.value)}
          />
        );
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Reporte General de Reservas</h1>
        <div className="flex gap-4">
          <select
            value={perPage}
            onChange={(e) => { setPerPage(Number(e.target.value)); if (currentPage !== 1) setCurrentPage(1); }}
            className="border rounded px-3 py-1 w-32"
          >
            <option value={10}>10 / pág</option>
            <option value={20}>20 / pág</option>
            <option value={50}>50 / pág</option>
          </select>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-1 border rounded hover:bg-gray-50 bg-turquesa text-white hover:bg-turquesa/90 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {downloading ? (
              <ArrowPathIcon className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowDownTrayIcon className="w-5 h-5" />
            )}
            {downloading ? 'Descargando...' : 'Exportar .xlsx'}
          </button>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-1 border rounded hover:bg-gray-50"
          >
            <ArrowPathIcon className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {columns.map(({ key, label, options }) => (
                <th key={key} className="px-6 py-3 bg-gray-50">
                  <div className="flex flex-col gap-3">
                    <div
                      className="flex items-center justify-between group cursor-pointer"
                      onClick={() => handleSort(key)}
                    >
                      <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        {label}
                      </span>
                      <ChevronUpDownIcon
                        className={`w-4 h-4 text-gray-400 transition-colors group-hover:text-turquesa
                          ${sortConfig.field === key ? 'text-turquesa' : ''}`}
                      />
                    </div>
                    <div className="relative">
                      {renderFilterInput(key, label, options)}
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center">
                  <div className="flex justify-center items-center">
                    <ArrowPathIcon className="w-6 h-6 animate-spin text-gray-400" />
                    <span className="ml-2">Cargando...</span>
                  </div>
                </td>
              </tr>
            ) : displayData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                  No se encontraron resultados
                </td>
              </tr>
            ) : (
              displayData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {columns.map(({ key }) => (
                    <td key={key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {key === 'estado' ? (
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(row[key])}`}>
                          {row[key]}
                        </span>
                      ) : row[key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-3 border-t">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando {Math.min((currentPage - 1) * perPage + 1, totalRecords > 0 ? totalRecords : 0)} a{' '}
                {Math.min(currentPage * perPage, totalRecords)} de {totalRecords} resultados
              </p>
            </div>
            {/* Se retiró la condición excluyente totalPages > 1 para debug constante */}
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage <= 1 || loading}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:bg-gray-100"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <span className="px-3 py-1 font-medium text-sm">
                Página {currentPage} de {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage >= totalPages || loading}
                className="px-3 py-1 border rounded hover:bg-gray-50 disabled:bg-gray-100"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;