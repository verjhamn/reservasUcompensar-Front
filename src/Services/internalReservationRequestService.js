import { axiosInstance } from "./authService";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export const crearSolicitudInterna = async (payload) => {
    try {
        const response = await axiosInstance.post(`${API_BASE_URL}/solicitudes/crear`, payload);
        return response.data;
    } catch (error) {
        console.error("Error en crearSolicitudInterna:", error.response || error);

        throw {
            message: error.response?.data?.message || error.message || "Error al enviar la solicitud interna.",
            errors: error.response?.data?.errors || {}
        };
    }
};
