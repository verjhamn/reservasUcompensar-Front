import { axiosInstance } from "./authService";

const API_URL = "https://backreservas.ucompensar.edu.co/api";
const API_URL2 = "https://qareservas.ucompensar.edu.co/api";

export const getMisReservas = async () => {
  try {
    console.log("[getMisReservas] Iniciando solicitud al endpoint...");

    // Realizar la solicitud usando axiosInstance, que maneja la autenticación automáticamente
    const response = await axiosInstance.get(`${API_URL}/mis-reservas`);

    console.log("[getMisReservas] Respuesta del servidor:", response.data);

    // Verificar si la respuesta es exitosa
    if (response.data.success) {
      console.log("[getMisReservas] Reservas obtenidas:", response.data.data);
      return response.data.data; // Retornar las reservas del usuario
    } else {
      console.error("[getMisReservas] Error en la respuesta:", response.data);
      throw new Error(response.data.message || "Error al obtener las reservas.");
    }
  } catch (error) {
    console.error("[getMisReservas] Error al obtener las reservas:", error);
    throw error;
  }
};
