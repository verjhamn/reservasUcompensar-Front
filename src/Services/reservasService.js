import axios from "axios";
import { getAuthToken, fetchAuthToken } from "./authService";

const API_BASE_URL = "/api";

// Función para filtrar reservas
export const fetchFilteredReservations = async (filters) => {
    let token = getAuthToken(); // Obtener el token del localStorage
    if (!token) {
        console.warn("Token no encontrado. Solicitando uno nuevo.");
        token = await fetchAuthToken(); // Solicitar un nuevo token si no existe
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };

    try {
        console.log("Enviando filtros:", filters); // Debug
        const response = await axios.post(
            `${API_BASE_URL}/reservas/filtrar`,
            filters,
            config
        );
        if (response.data && response.data.success) {
            return response.data.espacios; // Datos de las reservas
        } else {
            throw new Error(response.data.message || "No se pudo filtrar las reservas.");
        }
    } catch (error) {
        console.error("Error al filtrar reservas:", error);
        throw error;
    }
};
