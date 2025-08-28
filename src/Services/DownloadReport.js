import { axiosInstance } from "./authService";

export const downloadReport = async () => {
    try {
        const response = await axiosInstance.get("/reportes/general-excel");
        
        if (response.data.status === "success") {
            // Construir la URL completa
            const downloadURL = `${response.data.url}`;
            
            console.log("Descargando reporte desde:", downloadURL);
            console.log("URL_response:", response.data.url);
            
            // Método 1: Intentar descarga directa
            try {
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = 'reporte_general_reservas.xlsx';
                link.style.display = 'none';
                link.rel = 'noopener noreferrer';
                
                document.body.appendChild(link);
                link.click();
                
                setTimeout(() => {
                    if (document.body.contains(link)) {
                        document.body.removeChild(link);
                    }
                }, 100);
            } catch (error) {
                console.log("Método 1 falló, intentando método 2...");
                
                // Método 2: Usar window.location.href como fallback
                const originalLocation = window.location.href;
                window.location.href = downloadURL;
                
                // Restaurar la ubicación después de un breve delay
                setTimeout(() => {
                    window.location.href = originalLocation;
                }, 1000);
            }
            
            return true;
        } else {
            throw new Error("No se pudo generar el reporte.");
        }
    } catch (error) {
        console.error("Error al descargar reporte:", error.response?.data || error.message);
        throw error;
    }
};