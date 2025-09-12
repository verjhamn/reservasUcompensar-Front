import { axiosInstance } from "./authService";
import { format, addHours } from 'date-fns';

const API_URL = import.meta.env.VITE_API_URL;

// Para el modal de reservas (sin user_id)
export const getDisponibilidad = async (espacio_id, fecha) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/reservas/disponibilidad`, {
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

// Nueva función para consultar disponibilidad por mes
export const getDisponibilidadMes = async (espacio_id, mes, año) => {
    try {
        // Formatear la fecha como DD/MM/AAAA (usando el primer día del mes)
        const fecha = `01/${mes.toString().padStart(2, '0')}/${año}`;
        
        const response = await axiosInstance.post(`${API_URL}/reservas/disponibilidad`, {
            espacio_id,
            fecha,
            mes: true
        });

        if (response.data.success) {
            return {
                reservas: response.data.espacio.reservas || [],
                horarioSIAF: response.data.horarioSIAF || []
            };
        } else {
            throw new Error("No se pudo obtener la disponibilidad del mes.");
        }
    } catch (error) {
        console.error("Error al consultar disponibilidad del mes:", error.response?.data || error.message);
        throw error;
    }
};

// Para el check-in (con user_id)
export const getDisponibilidadCheckIn = async (espacio_id, fecha, userId) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/reservas/disponibilidad`, {
            user_id: userId,
            espacio_id: espacio_id,
            fecha: fecha
        });

        if (response.data.success) {
            return {
                reservas: response.data.espacio.reservas || [],
                espacio: response.data.espacio
            };
        } else {
            throw new Error("No se pudo obtener la disponibilidad del espacio.");
        }
    } catch (error) {
        console.error("Error al consultar disponibilidad para check-in:", error.response?.data || error.message);
        throw error;
    }
};

// Para el check-out (con user_id)
export const getDisponibilidadCheckOut = async (espacio_id, fecha, userId) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/reservas/disponibilidad`, {
            user_id: userId,
            espacio_id: espacio_id,
            fecha: fecha
        });

        if (response.data.success) {
            return {
                reservas: response.data.espacio.reservas || [],
                espacio: response.data.espacio
            };
        } else {
            throw new Error("No se pudo obtener la disponibilidad del espacio.");
        }
    } catch (error) {
        console.error("Error al consultar disponibilidad para check-out:", error.response?.data || error.message);
        throw error;
    }
};

export const processOccupiedHours = (disponibilidad) => {
    const horasOcupadas = new Set();
    const { reservas, horarioSIAF } = disponibilidad;

    // Procesar reservas (excluir "Completada" y "Cancelada")
    if (Array.isArray(reservas)) {
        reservas.forEach(reserva => {
            // Solo considerar reservas activas (no completadas ni canceladas)
            if (reserva.estado !== "Completada" && reserva.estado !== "Cancelada") {
                const inicio = new Date(reserva.hora_inicio);
                const fin = new Date(reserva.hora_fin);
                
                let horaActual = new Date(inicio);
                while (horaActual < fin) {
                    horasOcupadas.add(format(horaActual, "HH:00"));
                    horaActual = addHours(horaActual, 1);
                }
            }
        });
    }

    // Procesar horarioSIAF - puede venir como array o como objeto
    if (Array.isArray(horarioSIAF)) {
        // Formato antiguo: array de horarios
        horarioSIAF.forEach(horario => {
            const [horasInicio] = horario.horainicio.split(':');
            const [horasFin] = horario.horafinal.split(':');
            
            for (let hora = parseInt(horasInicio); hora <= parseInt(horasFin); hora++) {
                horasOcupadas.add(`${hora.toString().padStart(2, '0')}:00`);
            }
        });
    } else if (horarioSIAF && typeof horarioSIAF === 'object') {
        // Formato nuevo: objeto con fechas como claves
        // En este caso, horarioSIAF ya viene procesado por el backend
        // No necesitamos agregar horas adicionales
        console.log('horarioSIAF recibido como objeto:', horarioSIAF);
    }

    return Array.from(horasOcupadas).sort();
};

// Nueva función para procesar disponibilidad del mes
export const processOccupiedHoursMes = (disponibilidadMes) => {
    const availabilityData = {};
    const { dias, horarioSIAF } = disponibilidadMes;

    if (Array.isArray(dias)) {
        dias.forEach(dia => {
            const horasOcupadas = new Set();
            
            // Procesar reservas del día
            if (Array.isArray(dia.reservas)) {
                dia.reservas.forEach(reserva => {
                    if (reserva.estado !== "Completada" && reserva.estado !== "Cancelada") {
                        const inicio = new Date(reserva.hora_inicio);
                        const fin = new Date(reserva.hora_fin);
                        
                        let horaActual = new Date(inicio);
                        while (horaActual < fin) {
                            horasOcupadas.add(format(horaActual, "HH:00"));
                            horaActual = addHours(horaActual, 1);
                        }
                    }
                });
            }

            // Procesar horarioSIAF del día
            if (Array.isArray(horarioSIAF)) {
                horarioSIAF.forEach(horario => {
                    const [horasInicio] = horario.horainicio.split(':');
                    const [horasFin] = horario.horafinal.split(':');
                    
                    for (let hora = parseInt(horasInicio); hora <= parseInt(horasFin); hora++) {
                        horasOcupadas.add(`${hora.toString().padStart(2, '0')}:00`);
                    }
                });
            }

            availabilityData[dia.fecha] = Array.from(horasOcupadas).sort();
        });
    }

    return availabilityData;
};

import { canUserCheckIn } from '../utils/checkinRules';
import { RESERVATION_STATES } from '../utils/constants';

export const verificarReservaUsuario = (reservas, userId) => {
    const ahora = new Date();
    return reservas.find(reserva => {
        // El usuario debe ser dueño de la reserva y cumplir regla de check-in centralizada
        if (reserva.user_id !== userId) return false;
        return canUserCheckIn(reserva);
    });
};

export const verificarReservaConCheckIn = (reservas, userId) => {
    const ahora = new Date();
    return reservas.find(reserva => {
        const horaInicio = new Date(reserva.hora_inicio);
        const horaFin = new Date(reserva.hora_fin);
        
        return reserva.user_id === userId && 
               reserva.estado === "Confirmada" &&
               ahora >= horaInicio && 
               ahora <= horaFin;
    });
};
