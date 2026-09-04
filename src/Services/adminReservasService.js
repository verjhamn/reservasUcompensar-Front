import { axiosInstance } from "./authService";
import { buildSpaceFilterPayload } from "../utils/filterPayload";

const API_URL = import.meta.env.VITE_API_URL;

const formatFilterDate = (value) => {
    if (!value) return "";

    const isoDate = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!isoDate) return value;

    const [, year, month, day] = isoDate;
    return `${day}/${month}/${year}`;
};

const getRequestBaseEndpoint = (origin = "") => (
    origin === 'interna'
        ? `${API_URL}/solicitudes`
        : `${API_URL}/solicitudes/externas`
);

export const getAllReservations = async (filters = {}) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/reservas/filtrar`, buildSpaceFilterPayload(filters));

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
        const response = await axiosInstance.post(`${API_URL}/solicitudes/show`, {
            id: filters.id || "",
            usuario_id: filters.usuario_id || "",
            id_usuario: filters.id_usuario || "",
            espacio_id: filters.espacio_id || "",
            palabra: filters.palabra || "",
            email: filters.email || "",
            fecha: formatFilterDate(filters.fecha),
            horaInicio: filters.horaInicio || "",
            horaFin: filters.horaFin || "",
            tipo: filters.tipo || "",
            piso: filters.piso || "",
            estado: filters.estado || "",
            origen: filters.origen || "",
            sede_id: filters.sede_id || "",
            fecha_creacion: formatFilterDate(filters.fecha_creacion),
            page: filters.page || 1,
            per_page: filters.per_page || 10,
            include_timeline: true
        });

        if (response.data.success) {
            return response.data;
        }
        throw new Error("Error al obtener las solicitudes");
    } catch (error) {
        console.error("Error en getExternalQuotes:", error);
        throw error;
    }
};

export const updateExternalQuoteState = async (id, payload, origin = "") => {
    try {
        const response = await axiosInstance.post(`${getRequestBaseEndpoint(origin)}/${id}/estado`, payload);
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

export const addExternalQuoteComment = async (id, commentPayload, origin = "") => {
    try {
        const response = await axiosInstance.post(`${getRequestBaseEndpoint(origin)}/${id}/comentarios`, commentPayload);
        if (response.data.success || response.status === 200 || response.status === 201) {
            return response.data;
        }
        throw new Error("Error al agregar el comentario a la solicitud");
    } catch (error) {
        console.error("Error en addExternalQuoteComment:", error);
        throw error;
    }
};
