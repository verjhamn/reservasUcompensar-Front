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

export const getExternalQuotes = async (filters = {}) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/solicitudes/externas/show`, {
            id: filters.id || "",
            id_usuario: filters.id_usuario || "",
            espacio_id: filters.espacio_id || "",
            palabra: filters.palabra || "",
            email: filters.email || "",
            fecha: filters.fecha || "",
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || "",
            tipo: filters.tipo || "",
            piso: filters.piso || "",
            estado: filters.estado || "",
            fecha_creacion: filters.fecha_creacion || "",
            page: filters.page || 1,
            per_page: filters.per_page || 10
        });

        if (response.data.success) {
            return response.data;
        }
        throw new Error("Error al obtener las solicitudes externas");
    } catch (error) {
        console.error("Error en getExternalQuotes:", error);
        throw error;
    }
};

export const updateExternalQuoteState = async (id, payload) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/solicitudes/externas/${id}/estado`, payload);
        if (response.data.success || response.status === 200 || response.status === 201) {
            // Algunas APIs no devuelven success: true pero si un 200.
            return response.data;
        }
        throw new Error("Error al actualizar el estado de la solicitud");
    } catch (error) {
        console.error("Error en updateExternalQuoteState:", error);
        throw error;
    }
};
