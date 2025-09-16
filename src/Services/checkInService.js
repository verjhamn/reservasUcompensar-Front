import { axiosInstance } from "./authService";

const API_URL = import.meta.env.VITE_API_URL;

export const realizarCheckIn = async (reservaId) => {
  try {

    const response = await axiosInstance.post(`${API_URL}/reservas/check-in`, {
      "reserva_id": reservaId,
      "check-in": true
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Error al realizar el check-in");
    }
  } catch (error) {
    console.error("[realizarCheckIn] Error:", error);
    throw error;
  }
};

export const realizarCheckInAdmin = async (reservaId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/reservas/check-in-admin`, {
      "reserva_id": reservaId,
      "check-in": true
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Error al realizar el check-in");
    }
  } catch (error) {
    console.error("[realizarCheckInAdmin] Error:", error);
    throw error;
  }
};

export const realizarCheckOut = async (reservaId) => {
  try {
    const response = await axiosInstance.post(`${API_URL}/reservas/check-out`, {
      "reserva_id": reservaId,
      "check-out": true
    });

    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || "Error al realizar el check-out");
    }
  } catch (error) {
    console.error("[realizarCheckOut] Error:", error);
    throw error;
  }
}; 