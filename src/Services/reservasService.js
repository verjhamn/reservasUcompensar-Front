import axios from "axios";
import { getAuthToken, fetchAuthToken } from "./authService";

const API_BASE_URL = "https://qareservas.ucompensar.edu.co/api";

// Función para filtrar reservas
export const fetchFilteredReservations = async (filters) => {
    try {
        let token = getAuthToken();
        if (!token) {
            console.log("Token no encontrado. Solicitando uno nuevo...");
            token = await fetchAuthToken();
            if (!token) {
                throw new Error("No se pudo obtener un token válido.");
            }
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        console.log("Token usado:", token); // Debug
        console.log("Enviando filtros:", filters); // Debug

        // Aquí enviamos los filtros directamente en el body sin envolverlos en un objeto.
        const response = await axios.post(
            `${API_BASE_URL}/reservas/filtrar`,
            filters, // Enviar los filtros directamente
            config
        );

        console.log("Respuesta del backend:", response.data); // Debug
        if (response.data && response.data.success) {
            return response.data.espacios; // Datos de las reservas
        } else {
            throw new Error(response.data.message || "No se pudo filtrar las reservas.");
        }
    } catch (error) {
        if (error.response && error.response.status === 401) {
            console.error("Error 401: Token no autorizado o expirado.");
            // Intenta obtener un nuevo token y reintentar
            const newToken = await fetchAuthToken();
            if (newToken) {
                return fetchFilteredReservations(filters); // Reintentar la solicitud
            }
        }

        console.error("Error al filtrar reservas:", error);
        throw error;
    }
};
