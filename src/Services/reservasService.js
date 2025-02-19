import axios from "axios";
import { getAuthToken, fetchAuthToken, setAuthToken } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Función para filtrar reservas (Coworking)
export const fetchFilteredReservations = async (filters) => {
    try {
       
        // Configurar encabezados con el token
        const config = {
            headers: {
                 // Incluir token
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        console.log("Filtros procesados:", filters); // Debugging

        // Realizar solicitud al nuevo endpoint con el body adecuado
        const body = {
            palabra: filters.palabra || "",
            tipo: filters.tipo || "",
            sede: filters.sede || "",
            piso: filters.piso || "",
            agrupable: filters.agrupable || "",
            espaciofisico: filters.espaciofisico || "",
            tiporecurso: filters.tiporecurso || "",
            capacidad: filters.capacidad || "",
            fecha: filters.fecha || "",
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || "",
            id:filters.id || "",
        };
        console.log("Body de la solicitud:", body); // Debugging
        

        const response = await axios.post(`${API_BASE_URL}/espacios/filtrar`, body, config);

        console.log("Respuesta de espacios:", response.data); // Debugging
        return response.data.espacios;
    } catch (error) {
        // Si no es 401, loguear el error
        console.error("Error al filtrar reservas:", error.response || error.message);
        throw error;
    }
};
