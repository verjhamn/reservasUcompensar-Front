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
  // Definir las columnas exactamente como aparecen en la UI
  const columns = [
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

  const [allData, setAllData] = useState([]); // Almacena todos los datos
  const [filteredData, setFilteredData] = useState([]); // Datos filtrados
  const [displayData, setDisplayData] = useState([]); // Datos paginados
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [filters, setFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({
    field: null,
    direction: 'asc'
  });
  const [showDatePicker, setShowDatePicker] = useState({});
  const [showTimePicker, setShowTimePicker] = useState({});

  // Obtener datos del servidor
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGeneralReport();
      if (response && response.data) {
        setAllData(response.data);
        setFilteredData(response.data);
      }
    } catch (error) {
      console.error("Error al obtener datos:", error);
    } finally {
      setLoading(false);
    }
  };

  // Aplicar filtros y ordenamiento
  useEffect(() => {
    let result = [...allData];

    // Aplicar filtros
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value.toString().trim() !== '') {
        result = result.filter(item => 
          item[key]?.toString().toLowerCase().includes(value.toLowerCase())
        );
      }
    });

    // Aplicar ordenamiento
    if (sortConfig.field) {
      result.sort((a, b) => {
        if (a[sortConfig.field] < b[sortConfig.field]) 
          return sortConfig.direction === 'asc' ? -1 : 1;
        if (a[sortConfig.field] > b[sortConfig.field]) 
          return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1); // Reset a primera página cuando cambian filtros
  }, [filters, sortConfig, allData]);

  // Aplicar paginación
  useEffect(() => {
    const start = (currentPage - 1) * perPage;
    const end = start + perPage;
    setDisplayData(filteredData.slice(start, end));
  }, [currentPage, perPage, filteredData]);

  // Cargar datos iniciales
  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSort = (field) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleDownload = async () => {
    try {
      await downloadReport();
    } catch (error) {
      console.error("Error al descargar:", error);
    }
  };

  const getFilterType = (key) => {
    if (key.includes('fecha')) return 'date';
    if (key.includes('hora')) return 'time';
    return 'text';
  };

  const renderFilterInput = (key, label) => {
    const type = getFilterType(key);
    
    switch (type) {
      case 'date':
        return (
          <div className="relative">
            <input
              type="date"
              className="w-full px-2 py-1 text-sm border rounded pl-8 focus:ring-2 focus:ring-turquesa focus:border-transparent"
              value={filters[key] || ''}
              onChange={(e) => handleFilterChange(key, e.target.value)}
            />
            <CalendarIcon className="w-4 h-4 text-gray-400 absolute left-2 top-1/2 transform -translate-y-1/2" />
          </div>
        );
      
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

  const totalRecords = filteredData.length;
  const totalPages = Math.ceil(totalRecords / perPage);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Reporte General de Reservas</h1>
        <div className="flex gap-4">
          <select
            value={perPage}
            onChange={(e) => setPerPage(Number(e.target.value))}
            className="border rounded px-3 py-1 w-32"
          >
            <option value={10}>10 / pág</option>
            <option value={20}>20 / pág</option>
            <option value={50}>50 / pág</option>
          </select>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-1 border rounded hover:bg-gray-50 bg-turquesa text-white hover:bg-turquesa/90"
          >
            <ArrowDownTrayIcon className="w-5 h-5" />
            Descargar Excel
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
              {columns.map(({ key, label }) => (
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
                      {renderFilterInput(key, label)}
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
                      {row[key]}
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
                Mostrando {Math.min((currentPage - 1) * perPage + 1, totalRecords)} a{' '}
                {Math.min(currentPage * perPage, totalRecords)} de {totalRecords} resultados
              </p>
            </div>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1 || loading}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:bg-gray-100"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <span className="px-3 py-1">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages || loading}
                  className="px-3 py-1 border rounded hover:bg-gray-50 disabled:bg-gray-100"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsView;