import { axiosInstance } from "./authService";

export const getAllReservations = async (filters = {}) => {
    try {
        const response = await axiosInstance.post("/reservas/filtrar", {
            palabra: filters.palabra || "",
            fecha: filters.fecha || "",
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || "",
            tipo: filters.tipo || "",
            fecha_creacion: filters.fecha_creacion || "",
            email: filters.email || "",
            // No incluimos id_usuario ya que no se usará
        });

        if (response.data.success) {
            return response.data.data;
        }
        throw new Error("Error al obtener las reservas");
    } catch (error) {
        console.error("Error en getAllReservations:", error);
        throw error;
    }
};
