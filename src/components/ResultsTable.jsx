import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ReservationModal from "./ReservationModal";
import { fetchFilteredReservations } from "../Services/reservasService";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../Services/SSOServices/authConfig";
import { fetchAuthToken } from "../Services/authService";

const ResultsTable = ({ filters = {}, goToMyReservations }) => {
  const { instance } = useMsal();
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
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
              tipo: coworking.tipo || "Coworking", // Usar tipo del espacio coworking
              // Usar las imágenes del espacio coworking específico
              imagenes: coworking.imagenes || []
            }));
          }
        });

        console.log('Espacios procesados:', processedSpaces); // Para debug
        setData(processedSpaces);

        if (processedSpaces.length === 1) {
          handleReserveClick(processedSpaces[0]);
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
          console.log("Usuario autenticado con SSO:", user);

          // Guardamos correctamente el usuario en localStorage
          localStorage.setItem("userData", JSON.stringify(user));
          window.dispatchEvent(new Event("storage")); // Actualiza el Header automáticamente

          // Llamamos a fetchAuthToken para registrar al usuario en el backend si no existe
          console.log("[ResultsTable] Registrando usuario en el backend si es necesario...");
          await fetchAuthToken();
        }

        setIsLoggedIn(true);
        // Remover el getRandomImage y pasar el item directamente
        setSelectedSpace(item);
        setIsModalOpen(true);
      } catch (error) {
        console.error("Error en el inicio de sesión con Microsoft:", error);
        return;
      }
    } else {
      //Si ya hay datos en localStorage, verificamos la autenticación en el backend
      console.log("[ResultsTable] Verificando autenticación en backend...");
      await fetchAuthToken();

      // Remover el getRandomImage y pasar el item directamente
      setSelectedSpace(item);
      setIsModalOpen(true);
    }
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;
  if (data.length === 0) return <p>No se encontraron resultados para los filtros seleccionados.</p>;

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
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
               {/*  <p className="text-gray-600 text-sm">Descripción: {item.descripcion || "Descripción no disponible"}</p> */}
              </div>
              <button
                onClick={() => handleReserveClick(item)}
                className="mt-4 w-full bg-turquesa text-white py-2 px-4 rounded hover:bg-turquesa/90 transition duration-300"
              >
                Reservar
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
      />
    </div>
  );
};

export default ResultsTable;