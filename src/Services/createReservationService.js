import axios from "axios";
import { getAuthToken, fetchAuthToken } from "./authService";

const API_BASE_URL = "https://qareservas.ucompensar.edu.co/api";

export const createReservation = async (reservationData) => {
    try {
        let token = getAuthToken();
        if (!token) {
            console.log("Token no encontrado. Solicitando uno nuevo...");
            token = await fetchAuthToken();
            if (!token) {
                throw new Error("No se pudo obtener un token válido.");
            }
        }

        console.log("Datos enviados al servidor:", reservationData);

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        };

        const response = await axios.post(
            `${API_BASE_URL}/reservas/crear`,
            reservationData,
            config
        );

        console.log("Respuesta completa del servidor:", {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data
        });
        
        if (response.data && response.data.status === "success") {
            return response.data;
        } else {
            throw new Error(response.data.message || "Error al crear la reserva");
        }
    } catch (error) {
        console.error("Error detallado:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status
        });
        throw error;
    }
}; 