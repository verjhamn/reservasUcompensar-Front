import { axiosInstance } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export const getAllReservations = async (filters = {}) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/reservas/filtrar`, {
            palabra: filters.palabra || "",
            fecha: filters.fecha || "",
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || "",
            tipo: filters.tipo || "",
            piso: filters.piso || "",
            email: filters.email || "",
            estado: filters.estado || ""
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
