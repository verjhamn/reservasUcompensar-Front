import axios from "axios";

const API_URL = "https://backreservas.ucompensar.edu.co/api/mis-reservas";

export const getMisReservas = async () => {
  try {
    console.log("[getMisReservas] Iniciando solicitud al endpoint...");

    // Recuperar el token de autenticación del usuario
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("[getMisReservas] Token no encontrado.");
      throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
    }

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
