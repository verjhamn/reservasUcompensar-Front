import axios from "axios";
import { getAuthToken, fetchAuthToken, setAuthToken } from "./authService";

const API_BASE_URL = "https://backreservas.ucompensar.edu.co/api";
const API_BASE_URL2 = "https://qareservas.ucompensar.edu.co/api";

// Función para filtrar reservas (Coworking)
export const fetchFilteredReservations = async (filters) => {
    try {
        // Obtener el token desde localStorage
        let token = getAuthToken();

        // Si no hay token, solicitar uno nuevo
        if (!token) {
            console.log("Token no encontrado. Solicitando uno nuevo...");
            token = await fetchAuthToken();
            if (!token) {
                throw new Error("No se pudo obtener un token válido.");
            }
        }

        // Configurar encabezados con el token
        const config = {
            headers: {
                Authorization: `Bearer ${token}`, // Incluir token
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        console.log("Token usado:", token); // Debugging
        console.log("Filtros procesados:", filters); // Debugging

        // Realizar solicitud al nuevo endpoint con el body adecuado
        const body = {
            palabra: filters.palabra || "",
            tipo: "coworking",
            sede: filters.sede || "",
            piso: filters.piso || "",
            agrupable: filters.agrupable || "",
            espaciofisico: filters.espaciofisico || "",
            tiporecurso: filters.tiporecurso || "",
            capacidad: filters.capacidad || "",
            fecha: filters.fecha || "",
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || ""
        };
        console.log("Body de la solicitud:", body); // Debugging
        

        const response = await axios.post(`${API_BASE_URL2}/espacios/filtrar`, body, config);

        console.log("Respuesta de espacios:", response.data); // Debugging
        return response.data.espacios;
    } catch (error) {
        // Si el error es 401, renovar el token y reintentar
        if (error.response && error.response.status === 401) {
            console.log("Token expirado. Solicitando uno nuevo...");
            const newToken = await fetchAuthToken();
            if (!newToken) {
                throw new Error("No se pudo renovar el token.");
            }
            setAuthToken(newToken); // Guardar el nuevo token

            // Reintentar con el nuevo token
            const retryConfig = {
                headers: {
                    Authorization: `Bearer ${newToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            };

            const retryResponse = await axios.post(`${API_BASE_URL}/espacios/filtrar`, body, retryConfig);
            console.log("Respuesta de espacios (reintento):", retryResponse.data); // Debugging
            return retryResponse.data.espacios;
        }

        // Si no es 401, loguear el error
        console.error("Error al filtrar reservas:", error.response || error.message);
        throw error;
    }
};
