import { axiosInstance } from "./authService";

export const getDisponibilidad = async (espacio_id, fecha) => {
    try {
        const response = await axiosInstance.post("/reservas/disponibilidad", {
            espacio_id,
            fecha
        });

        if (response.data.success) {
            return response.data.espacio.reservas; // Retorna las reservas existentes
        } else {
            throw new Error("No se pudo obtener la disponibilidad del espacio.");
        }
    } catch (error) {
        console.error("Error al consultar disponibilidad:", error.response?.data || error.message);
        throw error;
    }
};
