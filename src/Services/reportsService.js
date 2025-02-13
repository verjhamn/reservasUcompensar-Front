import { axiosInstance } from "./authService";

export const getGeneralReport = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/reportes/general", { 
      params: filters 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching reports:", error);
    throw error;
  }
};