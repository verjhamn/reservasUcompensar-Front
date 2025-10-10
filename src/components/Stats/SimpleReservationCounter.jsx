import React from 'react';
import { calculateReservationStats } from '../../utils/statsHelper';

/**
 * Contador simple de reservas para mostrar encima del listado
 * Muestra un resumen compacto de las reservas del día seleccionado
 * @param {Array} reservations - Array de reservas del día seleccionado
 * @param {Date} selectedDate - Fecha seleccionada
 */
const SimpleReservationCounter = ({ reservations, selectedDate }) => {
    const stats = calculateReservationStats(reservations);

    if (stats.total === 0) {
        return null; // No mostrar contador si no hay reservas
    }

    return (
        <div className="bg-gradient-to-r from-turquesa/10 to-fucsia/10 rounded-lg px-4 py-3 mb-3 border border-turquesa/20">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-700">
                        {stats.total} {stats.total === 1 ? 'reserva' : 'reservas'} en este día
                    </span>
                </div>
                
                <div className="flex items-center gap-4 text-xs">
                    {stats.confirmadas > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            <span className="text-gray-600">{stats.confirmadas} confirmadas</span>
                        </span>
                    )}
                    {stats.creadas > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
                            <span className="text-gray-600">{stats.creadas} creadas</span>
                        </span>
                    )}
                    {stats.canceladas > 0 && (
                        <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            <span className="text-gray-600">{stats.canceladas} canceladas</span>
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SimpleReservationCounter;

