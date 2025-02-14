import { axiosInstance } from "./authService";

export const downloadReport = async () => {
    try {
        const response = await axiosInstance.get("/reportes/general-excel");
        
        if (response.data.status === "success") {
            // Construir la URL completa
            const downloadURL = `${response.data.url}`;
            
            console.log("Descargando reporte desde:", downloadURL);
            console.log("URL_response:", response.data.url);
            
            
            // Iniciar la descarga
            window.open(downloadURL, '_blank');
            return true;
        } else {
            throw new Error("No se pudo generar el reporte.");
        }
    } catch (error) {
        console.error("Error al descargar reporte:", error.response?.data || error.message);
        throw error;
    }
};