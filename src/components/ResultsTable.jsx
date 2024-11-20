import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ResultsTable = ({ filters }) => {
  const [page, setPage] = useState(0); // Página actual
  const itemsPerPage = 10; // Número de elementos por página

  // Función para obtener los datos de los espacios
  const fetchSpaces = async ({ queryKey }) => {
    const [_, page, filters] = queryKey;

    // Obtener el token de autenticación
    const tokenResponse = await axios.post(
      "https://api-academusoft-web.ucompensar.edu.co:8093/integrador-rest/servicios/app-acceso/acceso?=",
      { codigoAplicacion: "ReservaEspacios" },
      {
        headers: {
          "Content-Type": "application/json",
          "WWW-Authenticate": "Basic UmVzZXJ2YUVzcGFjaW9zOjQ1OThlNzE0MWMyYTk5ODYyM2IzMzYxYmZmODMxYmQ0",
        },
      }
    );

    const token = tokenResponse.data.token;

    // Obtener los datos de los espacios
    const response = await axios.post(
      "https://api-academusoft-web.ucompensar.edu.co:8093/integrador-rest/servicios/app-integrador/aplicacion/horarioxRecursoFisico",
      {
        tipoRetorno: "DataObject",
        parametros: {
          periodoacademico: "20242",
          espaciofisico: filters.espaciofisico || undefined,
          tiporecurso: filters.tiporecurso || undefined,
          clseFechainicio: filters.clseFechainicio || undefined,
          clseFechafinal: filters.clseFechafinal || undefined,
          horainicio: filters.horainicio || undefined,
          horafinal: filters.horafinal || undefined,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Retornamos los datos de la página actual
    return response.data.data.slice(page * itemsPerPage, (page + 1) * itemsPerPage);
  };

  // Usar React Query para manejar las solicitudes
  const { data = [], isLoading, isError } = useQuery({
    queryKey: ["spaces", page, filters], // Cambia cada vez que cambian los filtros o la página
    queryFn: fetchSpaces,
    keepPreviousData: true, // Mantiene los datos previos mientras se cargan los nuevos
  });

  // Manejar cambio de página
  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (isError) {
    return <p>Error al cargar los datos. Por favor, inténtalo de nuevo.</p>;
  }

  return (
    <div className="bg-white shadow-md p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
          >
            <img
              src="https://ucompensar.edu.co/wp-content/uploads/2021/05/Tecnologia-en-Operaciones-d-ucompensar.jpg"
              alt="Espacio"
              className="h-48 w-full object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-bold text-gray-800">{item.sede}</h3>
              <p className="text-gray-600 text-sm">Ubicación: {item.localidad}</p>
              <p className="text-gray-600 text-sm">Espacio: {item.espaciofisico}</p>
              <p className="text-gray-600 text-sm">Recurso: {item.recurso}</p>
              <p className="text-gray-600 text-sm">
                Horario: {item.horainicio} - {item.horafinal}
              </p>
              <p className="text-gray-600 text-sm">
                <em>Descripción genérica del espacio disponible.</em>
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <ReactPaginate
          pageCount={5} // Ajusta según el total de páginas
          onPageChange={handlePageChange}
          containerClassName="flex justify-center space-x-2"
          activeClassName="text-blue-500 font-bold"
          previousClassName="text-gray-500 hover:text-blue-500"
          nextClassName="text-gray-500 hover:text-blue-500"
          pageClassName="text-gray-500 hover:text-blue-500"
        />
      </div>
    </div>
  );
};

// Exportar el componente como `default`
export default ResultsTable;
