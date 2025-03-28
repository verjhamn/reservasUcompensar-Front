import { axiosInstance } from "./authService";
import { format, addHours } from 'date-fns';

export const getDisponibilidad = async (espacio_id, fecha) => {
    try {
        const response = await axiosInstance.post("/reservas/disponibilidad", {
            espacio_id,
            fecha
        });

        if (response.data.success) {
            return {
                reservas: response.data.espacio.reservas || [],
                horarioSIAF: response.data.horarioSIAF || []
            };
        } else {
            throw new Error("No se pudo obtener la disponibilidad del espacio.");
        }
    } catch (error) {
        console.error("Error al consultar disponibilidad:", error.response?.data || error.message);
        throw error;
    }
};

export const processOccupiedHours = (disponibilidad) => {
    const horasOcupadas = new Set();
    const { reservas, horarioSIAF } = disponibilidad;

    // Procesar reservas
    if (Array.isArray(reservas)) {
        reservas.forEach(reserva => {
            const inicio = new Date(reserva.hora_inicio);
            const fin = new Date(reserva.hora_fin);
            
            let horaActual = new Date(inicio);
            while (horaActual < fin) {
                horasOcupadas.add(format(horaActual, "HH:00"));
                horaActual = addHours(horaActual, 1);
            }
        });
    }

    // Procesar horarioSIAF
    if (Array.isArray(horarioSIAF)) {
        horarioSIAF.forEach(horario => {
            const [horasInicio] = horario.horainicio.split(':');
            const [horasFin] = horario.horafinal.split(':');
            
            for (let hora = parseInt(horasInicio); hora <= parseInt(horasFin); hora++) {
                horasOcupadas.add(`${hora.toString().padStart(2, '0')}:00`);
            }
        });
    }

    return Array.from(horasOcupadas).sort();
};
