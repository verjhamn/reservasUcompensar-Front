import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ReservationModal from "./ReservationModal";
import QuoteRequestModal from "./QuoteRequestModal";
import { fetchFilteredReservations } from "../Services/reservasService";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../Services/SSOServices/authConfig";
import { fetchAuthToken } from "../Services/authService";

const ResultsTable = ({ filters = {}, goToMyReservations, isGuestMode }) => {
  const { instance } = useMsal();
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [quoteData, setQuoteData] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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
              Titulo: "Espacio",
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

        // Pre-select if only one result? Maybe remove this auto-select to avoid confusion
        // if (processedSpaces.length === 1) {
        //   handleReserveClick(processedSpaces[0]);
        // }
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
    // For both guests and logged in users, we show ReservationModal first to check availability
    setSelectedSpace(item);
    setIsModalOpen(true);

    if (!isGuestMode) {
      let userData = localStorage.getItem("userData");
      if (!userData) {
        try {
          const response = await instance.loginPopup(loginRequest);
          const accessToken = response.accessToken;

          // Obtener datos del usuario desde Microsoft Graph
          const graphResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
            headers: { Authorization: `Bearer ${accessToken}` },
          });
          const user = await graphResponse.json();

          if (user) {
            localStorage.setItem("userData", JSON.stringify(user));
            window.dispatchEvent(new Event("storage"));
            await fetchAuthToken();
          }

          setIsLoggedIn(true);
        } catch (error) {
          console.error("Error en el inicio de sesión con Microsoft:", error);
          // If login fails, we might close modal or let them try again inside modal if we moved logic there.
          // But since we are here, we keep modal open if they just closed popup? 
          // Actually if login fails, they shouldn't proceed.
          // For now, assume success or they stay on page.
          return;
        }
      } else {
        await fetchAuthToken();
      }
    }
    // Guest mode just opens modal (already set above)
  };

  const handleQuoteRequestFromModal = (data) => {
    setIsModalOpen(false);
    setQuoteData({
      space: selectedSpace,
      ...data
    });
    // Small delay for smooth transition
    setTimeout(() => setIsQuoteModalOpen(true), 150);
  };

  const renderInfoMessage = () => {
    if (filters.tipo && filters.tipo !== "Coworking") {
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
                Para reservar este tipo de espacio, por favor escribir al correo admon.campus@ucompensar.edu.co.
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

  const handleBackFromQuote = () => {
    setIsQuoteModalOpen(false);
    // Reopen reservation modal with same selected space
    // We might need to ensure ReservationModal state is preserved or re-initialized if needed
    // But since selectedSpace is in state, it should be fine.
    setTimeout(() => setIsModalOpen(true), 150);
  };

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      {/* ... (rest of render) ... */}
      {renderInfoMessage()}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {data.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((item, index) => (
          <div key={`${item.id}-${index}`} className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 flex flex-col">
            <img
              src={item.imagenes[0]?.img_path}
              alt={item.codigo}
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.Titulo} {item.codigo || "Código no disponible"}</h3>
                <p className="text-gray-600 text-sm">Tipo: {item.tipo || "Tipo no disponible"}</p>
                <p className="text-gray-600 text-sm">Piso: {item.piso || "No disponible"}</p>
              </div>
              <button
                onClick={() => handleReserveClick(item)}
                className={`mt-4 w-full py-2 px-4 rounded transition duration-300 font-medium shadow-sm ${isGuestMode
                  ? "bg-purple-600 hover:bg-purple-700 text-white"
                  : "bg-primary-600 hover:bg-primary-700 text-white"
                  }`}
              >
                {isGuestMode ? "Solicitar Cotización" : "Reservar"}
              </button>
            </div>
          </div>
        ))}
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
        onQuoteRequest={handleQuoteRequestFromModal}
      />

      <QuoteRequestModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
        spaceData={selectedSpace}
        quoteData={quoteData}
        onBack={handleBackFromQuote}
      />
    </div>
  );
};

export default ResultsTable;