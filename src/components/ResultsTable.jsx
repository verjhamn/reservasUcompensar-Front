import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ReservationModal from "./ReservationModal";
import LoginTest from "./loginTest";
import { fetchFilteredReservations } from "../Services/reservasService";

const ResultsTable = ({ filters = {}, goToMyReservations }) => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setItemsPerPage(4);
      } else {
        setItemsPerPage(9);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchFilteredReservations(filters);

        // Extraemos espacios_coworking y agregamos el atributo `piso`
        const coworkingSpaces = response
          .flatMap(item =>
            item.espacios_coworking.map(coworking => ({
              ...coworking,
              piso: item.piso, // Incluimos el piso del espacio principal
            }))
          )
          .filter(Boolean); // Evitar valores nulos o indefinidos

        setData(coworkingSpaces);

        // Nueva funcionalidad: Si hay solo un resultado y el código vino en la URL, abrir el modal automáticamente
        if (coworkingSpaces.length === 1 && filters.palabra) {
          setSelectedSpace({ ...coworkingSpaces[0], image: getRandomImage() });
          setIsLoginOpen(true);
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

  const images = [
    "https://reservas.ucompensar.edu.co/img/1.webp",
    "https://reservas.ucompensar.edu.co/img/2.webp",
    "https://reservas.ucompensar.edu.co/img/3.webp",
    "https://reservas.ucompensar.edu.co/img/4.webp",
  ];

  const getRandomImage = () => {
    return images[Math.floor(Math.random() * images.length)];
  };

  const handlePageChange = ({ selected }) => {
    setPage(selected);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return <p>Cargando...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (data.length === 0) {
    return <p>No se encontraron resultados para los filtros seleccionados.</p>;
  }

  const startIndex = page * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {paginatedData.map((item, index) => (
          <div
            key={`${item.id}-${index}`}
            className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300 flex flex-col"
          >
            <img
              src={getRandomImage()}
              alt="Espacio"
              className="h-48 w-full object-cover"
            />
            <div className="p-4 flex flex-col flex-grow">
              <div className="flex-grow">
                <h3 className="text-lg font-bold text-gray-800">{item.tipo || "Tipo no disponible"}</h3>
                <p className="text-gray-600 text-sm">Código: {item.codigo || "Código no disponible"}</p>
                <p className="text-gray-600 text-sm">Piso: {item.piso || "No disponible"}</p>
                <p className="text-gray-600 text-sm">Descripción: {item.descripcion || "Descripción no disponible"}</p>
              </div>
              <button
                onClick={() => {
                  setSelectedSpace({ ...item, image: getRandomImage() });
                  setIsLoginOpen(true);
                }}
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
          onPageChange={handlePageChange}
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

      <LoginTest
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

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
