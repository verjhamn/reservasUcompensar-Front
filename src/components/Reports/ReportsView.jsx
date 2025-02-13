import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  TableRow,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableBody,
  Button,
  TextInput,
  Select,
  SelectItem,
} from "@tremor/react";
import {
  ArrowPathIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { getGeneralReport } from "../../Services/reportsService";
import { BarListHero } from "./BarList"

const ReportsView = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    dateRange: null,
    page: 1,
    perPage: 50
  });
  const [totalRecords, setTotalRecords] = useState(0);
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getGeneralReport({
        ...filters,
        page: currentPage,
        limit: filters.perPage
      });
      
      setData(response.data);
      setTotalRecords(response["reservas actuales"]);
      setTotalPages(Math.ceil(response["reservas actuales"] / filters.perPage));
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage, filters.perPage]);

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (

      <div className="p-6">
        <BarListHero />
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">
          Reporte General de Reservas
        </h2>
        <div className="flex gap-4 items-center">
          <Select
            value={filters.perPage}
            onValueChange={(value) => setFilters(prev => ({
              ...prev,
              perPage: value
            }))}
            className="w-32"
          >
            <SelectItem value={10}>10 / pág</SelectItem>
            <SelectItem value={20}>20 / pág</SelectItem>
            <SelectItem value={50}>50 / pág</SelectItem>
          </Select>
          <Button
            icon={FunnelIcon}
            variant="secondary"
            className="bg-white"
            onClick={() => setShowFilters(!showFilters)}
          >
            Filtros
          </Button>
          <Button
            icon={ArrowPathIcon}
            onClick={fetchData}
            loading={loading}
            className="bg-white"
          >
            Actualizar
          </Button>
        </div>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <TextInput
          icon={MagnifyingGlassIcon}
          placeholder="Buscar en todas las columnas..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({
            ...prev,
            search: e.target.value
          }))}
          className="max-w-full"
        />
      </div>

      {/* Tabla */}
      <Card className="overflow-hidden">
        <Table>
          <TableHead className="bg-gray-50">
            <TableRow>
              <TableHeaderCell className="font-semibold">Fecha Registro</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Fecha Reserva</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Horario</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Código</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Usuario</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Cargo</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Correo</TableHeaderCell>
              <TableHeaderCell className="font-semibold">Título</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                <TableCell>{item.fecha_hora_registro}</TableCell>
                <TableCell>{item.fecha_reserva}</TableCell>
                <TableCell>{`${item.hora_inicio_reserva} - ${item.hora_fin_reserva}`}</TableCell>
                <TableCell>{item.codigo_espacio}</TableCell>
                <TableCell>{item.usuario}</TableCell>
                <TableCell>{item.cargo_rol}</TableCell>
                <TableCell>{item.correo}</TableCell>
                <TableCell>{item.titulo_reserva}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Paginación */}
        <div className="mt-4 px-4 py-3 border-t border-gray-200 flex items-center justify-between">
          <span className="text-sm text-gray-600">
            Página {currentPage} de {totalPages} ({totalRecords} registros totales)
          </span>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Mostrando {(currentPage - 1) * filters.perPage + 1} - {Math.min(currentPage * filters.perPage, totalRecords)}
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white"
                disabled={currentPage === 1}
                onClick={handlePreviousPage}
              >
                Anterior
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white"
                disabled={currentPage >= totalPages}
                onClick={handleNextPage}
              >
                Siguiente
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsView;