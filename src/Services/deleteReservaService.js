import axios from "axios";

const API_URL = "https://backreservas.ucompensar.edu.co/api/reservas";

export const deleteReserva = async (idEspacio) => {
  try {
    console.log("[deleteReserva] Iniciando solicitud al endpoint...");

    // Recuperar el token de autenticación del usuario
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("[deleteReserva] Token no encontrado.");
      throw new Error("Usuario no autenticado. Por favor, inicia sesión.");
    }

    const response = await axios.delete(`${API_URL}/${idEspacio}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("[deleteReserva] Respuesta del servidor:", response.data);

    // Verificar si la respuesta es exitosa
    if (response.data.success || response.data.message === "Reserva eliminada con éxito.") {
      return response.data.data; // Retornar las reservas del usuario
    } else {
      console.error("[deleteReserva] Error en la respuesta:", response.data);
      throw new Error(response.data.message || "Error al obtener las reservas.");
    }
  } catch (error) {
    console.error("[deleteReserva] Error al obtener las reservas:", error);
    throw error;
  }
};
