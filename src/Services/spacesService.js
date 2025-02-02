/* import axios from "axios";
import { getAuthToken } from "./authService";

const API_BASE_URL = "/api";

const fetchSpaces = async () => {
  const token = getAuthToken();

  if (!token) {
    throw new Error("Token no disponible. Por favor, inicie sesión nuevamente.");
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get(`${API_BASE_URL}/spaces`, config);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los espacios:", error);
    throw error;
  }
};
 */