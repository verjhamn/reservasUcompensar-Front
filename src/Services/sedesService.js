import { axiosInstance } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export const getSedesEstado = async () => {
    const response = await axiosInstance.get(`${API_URL}/sedes/estado`);
    return response.data;
};

export const toggleSedeEstado = async (sedeId, activo) => {
    const response = await axiosInstance.put(`${API_URL}/sedes/${sedeId}/estado`, { activo });
    return response.data;
};
