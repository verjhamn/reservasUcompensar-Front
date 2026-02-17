/**
 * Servicio para manejar las solicitudes de cotización
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Envía una solicitud de cotización al backend
 * @param {Object} quoteData - El objeto JSON con la estructura definida
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export const sendQuoteRequest = async (quoteData) => {
    try {
        console.log(" Enviando solicitud al backend (Simulado):", quoteData);

        // TODO: Descomentar cuando el endpoint esté listo
        /*
        const response = await fetch(`${API_BASE_URL}/quotes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': `Bearer ${token}` // Si requiere auth
            },
            body: JSON.stringify(quoteData)
        });

        if (!response.ok) {
            throw new Error('Error al enviar la solicitud');
        }

        return await response.json();
        */

        // Simulación de respuesta exitosa
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    success: true,
                    message: "Cotización enviada correctamente",
                    id: "QT-" + Math.floor(Math.random() * 10000)
                });
            }, 1000);
        });

    } catch (error) {
        console.error("Error en sendQuoteRequest:", error);
        throw error;
    }
};
