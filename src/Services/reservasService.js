import axios from "axios";
import { getAuthToken, fetchAuthToken, setAuthToken } from "./authService";

const API_BASE_URL = "https://qareservas.ucompensar.edu.co/api";

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

        // Realizar solicitud al endpoint de coworking
        const response = await axios.get(`${API_BASE_URL}/reservas/coworking`, config);

        console.log("Respuesta de espacios de coworking:", response.data); // Debugging
        return response.data.espacios_coworking;
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

            const retryResponse = await axios.get(`${API_BASE_URL}/reservas/coworking`, retryConfig);
            console.log("Respuesta de espacios de coworking (reintento):", retryResponse.data); // Debugging
            return retryResponse.data.espacios_coworking;
        }

        // Si no es 401, loguear el error
        console.error("Error al filtrar reservas:", error.response || error.message);
        throw error;
    }
};
