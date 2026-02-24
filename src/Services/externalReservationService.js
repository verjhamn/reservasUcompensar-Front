const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Crea una reserva para usuarios externos (invitados sin cuenta MSAL).
 * No requiere token de autenticación.
 * 
 * @param {Object} payload Estructura requerida: { solicitante, empresa, reserva, evento }
 * @returns {Promise<Object>} Respuesta estructurada del backend con { status, message, user_created, data }
 */
export const crearReservaExterna = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/reservas/externas/crear`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json();

        // Validar respuesta del backend
        if (!response.ok) {
            // El API responde con status 422 y un array de errors o un message
            const errorObj = {
                message: data.message || "Error al procesar la reserva externa.",
                errors: data.errors || {}
            };
            throw errorObj;
        }

        return data;
    } catch (error) {
        console.error("Error en crearReservaExterna:", error);
        throw error;
    }
};
