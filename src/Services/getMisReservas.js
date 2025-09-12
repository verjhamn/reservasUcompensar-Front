import { axiosInstance } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export const getMisReservas = async () => {
  try {
    console.log("[getMisReservas] Iniciando solicitud al endpoint...");

    // Realizar la solicitud usando axiosInstance, que maneja la autenticación automáticamente
    const response = await axiosInstance.get(`${API_URL}/mis-reservas`);

    console.log("[getMisReservas] Respuesta del servidor:", response.data);

    // Verificar si la respuesta es exitosa
    if (response.data.success) {
      console.log("[getMisReservas] Reservas obtenidas:", response.data.data);
      
      // Validar que los datos estén completos y filtrar reservas inválidas
      const reservasValidas = response.data.data.filter(reserva => {
        return reserva && 
               reserva.id && 
               reserva.hora_inicio && 
               reserva.hora_fin && 
               reserva.estado;
      });
      
      console.log("[getMisReservas] Reservas válidas filtradas:", reservasValidas);
      return reservasValidas;
    } else {
      console.error("[getMisReservas] Error en la respuesta:", response.data);
      throw new Error(response.data.message || "Error al obtener las reservas.");
    }
  } catch (error) {
    console.error("[getMisReservas] Error al obtener las reservas:", error);
    throw error;
  }
};
