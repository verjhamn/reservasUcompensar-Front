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

        // Preparar los filtros eliminando valores vacíos
        const filtrosLimpios = Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
        );

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        console.log("Filtros procesados:", filtrosLimpios); // Debug

        console.log('Enviando filtros al backend:', filtrosLimpios); // Debug log
        
        try {
            const response = await axios.post(
                `${API_BASE_URL}/reservas/filtrar`,
                filtrosLimpios,
                config
            );

            return response.data;
        } catch (error) {
            // Si el error es 401 (Unauthorized), intentamos renovar el token
            if (error.response && error.response.status === 401) {
                console.log("Token expirado. Solicitando uno nuevo...");
                const newToken = await fetchAuthToken();
                if (!newToken) {
                    throw new Error("No se pudo renovar el token.");
                }

                // Reintentamos la petición con el nuevo token
                const newConfig = {
                    ...config,
                    headers: {
                        ...config.headers,
                        Authorization: `Bearer ${newToken}`,
                    },
                };

                const retryResponse = await axios.post(
                    `${API_BASE_URL}/reservas/filtrar`,
                    filtrosLimpios,
                    newConfig
                );

                return retryResponse.data;
            }
            throw error;
        }
    } catch (error) {
        console.error("Error completo:", error); // Debug log más detallado
        throw error;
    }
};
