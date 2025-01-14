import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ReservationModal from "./ReservationModal";
import { fetchFilteredReservations } from "../services/reservasService";

const ResultsTable = ({ filters = {} }) => {
    const [page, setPage] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
                const reservations = await fetchFilteredReservations(filters);
                setData(reservations);
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
        "/src/assets/1.webp",
        "/src/assets/2.webp",
        "/src/assets/3.webp",
        "/src/assets/4.webp",
    ];

    const getRandomImage = () => {
        return images[Math.floor(Math.random() * images.length)];
    };

    const handlePageChange = ({ selected }) => {
        setPage(selected);
    };

    if (isLoading) {
        return <p>Cargando...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedData = data.slice(startIndex, endIndex);

    if (paginatedData.length === 0) {
        return <p>No se encontraron resultados para los filtros seleccionados.</p>;
    }

    return (
        <div className="bg-white shadow-md p-4 md:p-6 rounded-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {paginatedData.map((item) => (
                    <div
                        key={item.idEspacio}
                        className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition duration-300"
                    >
                        <img
                            src={getRandomImage()}
                            alt="Espacio"
                            className="h-48 w-full object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-bold text-gray-800">{item.nombre}</h3>
                            <p className="text-gray-600 text-sm">Sede: {item.sede}</p>                            
                            <p className="text-gray-600 text-sm">Ubicación: {item.ubicacion}</p>
                            <p className="text-gray-600 text-sm">Capacidad: {item.capacidad}</p>
                            <p className="text-gray-600 text-sm">Recurso: {item.tiporecurso}</p>
                            <p className="text-gray-600 text-sm">
                                <em>Descripción genérica del espacio disponible.</em>
                            </p>
                            <button
                                onClick={() => {
                                    setSelectedSpace({ ...item, image: getRandomImage() });
                                    setIsModalOpen(true);
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
                />
            </div>

            <ReservationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                spaceData={selectedSpace}
            />
        </div>
    );
};

export default ResultsTable;
