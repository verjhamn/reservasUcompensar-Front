/**
 * Calcula las estadísticas de reservas por estado
 * @param {Array} reservations - Array de reservas
 * @returns {Object} Objeto con el conteo de cada estado
 */
export const calculateReservationStats = (reservations) => {
    const stats = {
        total: reservations.length,
        creadas: 0,
        confirmadas: 0,
        completadas: 0,
        canceladas: 0
    };

    reservations.forEach(reservation => {
        const estado = reservation.estado?.toLowerCase();
        
        if (estado === 'creada') {
            stats.creadas++;
        } else if (estado === 'confirmada') {
            stats.confirmadas++;
        } else if (estado === 'completada') {
            stats.completadas++;
        } else if (estado === 'cancelada') {
            stats.canceladas++;
        }
    });

    return stats;
};

/**
 * Calcula el porcentaje de un valor respecto al total
 * @param {number} value - Valor a calcular porcentaje
 * @param {number} total - Total de referencia
 * @returns {number} Porcentaje con 1 decimal
 */
export const calculatePercentage = (value, total) => {
    if (total === 0) return 0;
    return ((value / total) * 100).toFixed(1);
};

/**
 * Filtra reservas del mes de una fecha específica
 * @param {Array} reservations - Array de todas las reservas
 * @param {Date} selectedDate - Fecha seleccionada
 * @returns {Array} Reservas del mismo mes y año
 */
export const filterReservationsByMonth = (reservations, selectedDate) => {
    if (!selectedDate || !reservations) return [];
    
    const selectedMonth = selectedDate.getMonth();
    const selectedYear = selectedDate.getFullYear();
    
    return reservations.filter(reservation => {
        const reservationDate = new Date(reservation.start || reservation.hora_inicio);
        return reservationDate.getMonth() === selectedMonth && 
               reservationDate.getFullYear() === selectedYear;
    });
};

