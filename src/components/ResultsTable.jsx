/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import ReactPaginate from "react-paginate";
import { ImageIcon } from "lucide-react";
import ReservationModal from "./ReservationModal";

import { fetchFilteredReservations } from "../Services/reservasService";
import { useMsal } from "@azure/msal-react";
import { fetchAuthToken } from "../Services/authService";
import { startMicrosoftLogin } from "../Services/SSOServices/loginFlowService";

const ResultsTable = ({ filters = {}, goToMyReservations, isGuestMode, onSpaceLoaded, setAvailableFloors }) => {
  const { instance } = useMsal();
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const onSpaceLoadedRef = useRef(onSpaceLoaded);
  const setAvailableFloorsRef = useRef(setAvailableFloors);

  useEffect(() => {
    onSpaceLoadedRef.current = onSpaceLoaded;
    setAvailableFloorsRef.current = setAvailableFloors;
  }, [onSpaceLoaded, setAvailableFloors]);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(window.innerWidth <= 768 ? 4 : 9);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFilteredReservations(filters);

        const processedSpaces = response.flatMap(item => {
          if (item.coworking_contenedor === "NO") {
            return [{
              ...item,
              imagenes: item.imagenes,
              coworking_contenedor: "NO",
              /* Titulo: "Espacio", */
              tipo: item.key
            }];
          } else {
            // Para espacios coworking, procesar cada espacio individual
            return item.espacios_coworking.map(coworking => ({
              ...coworking,
              piso: item.piso,
              Titulo: "Coworking",
              coworking_contenedor: "SI",
              tipo: item.key, // Usar el tipo general del espacio (Coworking)
              tipoEspecifico: coworking.tipo || "Coworking", // Tipo específico del coworking
              // Usar las imágenes del espacio coworking específico
              imagenes: coworking.imagenes || []
            }));
          }
        });

        console.log('Espacios procesados:', processedSpaces); // Para debug
        setData(processedSpaces);

        // Extraer pisos únicos SOLO SI no hay un filtro de piso activo
        // Esto evita que al elegir un piso, las demás opciones desaparezcan del select
        if (typeof setAvailableFloorsRef.current === 'function' && !filters.piso) {
          const floors = processedSpaces.map(space => space.piso?.toString()).filter(Boolean);
          const uniqueFloors = [...new Set(floors)].sort((a, b) => {
            // Intenta ordenarlos numéricamente si es posible
            const numA = parseInt(a);
            const numB = parseInt(b);
            if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
            return a.localeCompare(b);
          });
          setAvailableFloorsRef.current(uniqueFloors);
        }

        // Notificar al padre cuando los datos están listos (usado por EspacioQRView para apertura automática)
        if (typeof onSpaceLoadedRef.current === 'function') {
          onSpaceLoadedRef.current(processedSpaces);
        }
      } catch (err) {
        console.error("Error al obtener datos en ResultsTable:", err);
        setError(err.message || "Error al cargar los datos.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [filters]);


  const handleReserveClick = async (item) => {
    if (!isGuestMode) {
      const userData = localStorage.getItem("userData");
      if (!userData || userData === "null") {
        try {
          await startMicrosoftLogin(instance, {
            redirectStartPage: window.location.href,
          });
        } catch (error) {
          console.error("Error iniciando sesión con Microsoft:", error);
        }
        return;
      } else {
        try {
          await fetchAuthToken();
        } catch (error) {
          console.error("Error sincronizando sesión interna:", error);
        }
      }
    }

    // Guests o usuarios autenticados: abrir modal de reserva normalmente
    setSelectedSpace(item);
    setIsModalOpen(true);
  };



  const renderInfoMessage = () => {
    // En modo invitado no mostramos alerta porque usan el formulario de cotizacion.
    if (filters.tipo && filters.tipo !== "Coworking" && !isGuestMode) {
      return (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-4 rounded">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                Estos espacios requieren solicitud y validacion previa. Selecciona el espacio para diligenciar la solicitud.
              </p>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No se encontraron resultados para los filtros seleccionados.</p>;

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      {/* ... (rest of render) ... */}
      {renderInfoMessage()}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((item, index) => {
          const usesInternalRequestFlow = !isGuestMode && item.coworking_contenedor !== "SI";
          const actionLabel = isGuestMode
            ? "Solicitar Cotizacion"
            : usesInternalRequestFlow
              ? "Solicitar"
              : "Reservar Ahora";

          return (
          <div
            key={`${item.id}-${index}`}
            onClick={() => handleReserveClick(item)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleReserveClick(item);
              }
            }}
            role="button"
            tabIndex={0}
            className="relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col animate-fade-in-up group hover:shadow-2xl hover:-translate-y-1 cursor-pointer bg-white border border-transparent hover:border-purple-200 outline-none focus:ring-4 focus:ring-purple-200"
          >
            <div className="relative overflow-hidden h-48 bg-gray-50 flex items-center justify-center">
              {item.imagenes && item.imagenes.length > 0 && item.imagenes[0]?.img_path ? (
                <img
                  src={item.imagenes[0].img_path}
                  alt={item.codigo}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 group-hover:text-purple-400 transition-colors duration-300">
                  <ImageIcon className="w-12 h-12 mb-2 opacity-60" />
                  <span className="text-sm font-medium">Sin imagen</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
                <span className="text-white font-medium px-4 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-sm">
                  {actionLabel}
                </span>
              </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
              <div className="flex-grow space-y-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-gray-800 leading-tight group-hover:text-purple-700 transition-colors">
                    {item.Titulo}
                  </h3>
                  <span className="text-purple-600 text-sm font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                    {item.codigo || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-0.5 text-sm text-neutral-500">
                  <p>
                    <span className="font-medium text-neutral-400 mr-1">Tipo:</span>
                    {item.tipo || "No disponible"}
                  </p>
                  <p>
                    <span className="font-medium text-neutral-400 mr-1">Piso:</span>
                    {item.piso || "No disponible"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="mt-4 md:mt-6">
        <ReactPaginate
          pageCount={Math.ceil(data.length / itemsPerPage)}
          onPageChange={({ selected }) => setPage(selected)}
          containerClassName="flex flex-wrap justify-center space-x-2"
          activeClassName="text-blue-500 font-bold"
          previousClassName="text-gray-500 hover:text-blue-500"
          nextClassName="text-gray-500 hover:text-blue-500"
          pageClassName="text-gray-500 hover:text-blue-500"
          pageRangeDisplayed={5}
          marginPagesDisplayed={2}
          previousLabel={"Anterior"}
          nextLabel={"Siguiente"}
          pageLinkClassName="px-3 py-1"
          renderOnZeroPageCount={null}
        />
      </div>

      <ReservationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        spaceData={selectedSpace}
        goToMyReservations={goToMyReservations}
        isGuestMode={isGuestMode}
      />
    </div>
  );
};

export default ResultsTable;

