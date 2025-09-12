import { CHECKIN_EARLY_MS, RESERVATION_STATES } from './constants';

// Regla: usuario regular puede hacer check-in desde 15 min antes del inicio hasta la hora fin
export const canUserCheckIn = (reserva) => {
    const ahora = new Date();
    const horaInicio = new Date(reserva.hora_inicio);
    const horaFin = new Date(reserva.hora_fin);
    const horaCheckInPermitida = new Date(horaInicio.getTime() - CHECKIN_EARLY_MS);

    return reserva.estado === RESERVATION_STATES.CREADA && ahora >= horaCheckInPermitida && ahora <= horaFin;
};

// Regla: admin puede hacer check-in sin restricción temporal si la reserva está "Creada"
export const canAdminCheckIn = (reserva) => {
    return reserva.estado === RESERVATION_STATES.CREADA;
};


