import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import StatCard from './StatCard';
import { calculateReservationStats, filterReservationsByMonth } from '../../utils/statsHelper';
import { 
    ClipboardDocumentListIcon, 
    CheckCircleIcon, 
    CheckBadgeIcon,
    XCircleIcon,
    CalendarDaysIcon
} from '@heroicons/react/24/outline';

/**
 * Dashboard de estadísticas de reservas
 * Muestra el total y el desglose por estados (Creada, Confirmada, Completada, Cancelada)
 * @param {Array} allReservations - Array de todas las reservas según filtros aplicados
 * @param {Array} dayReservations - Array de reservas del día seleccionado
 * @param {Date} selectedDate - Fecha seleccionada en el calendario
 * @param {Object} filters - Filtros actuales aplicados
 * @param {Function} setFilters - Función para actualizar los filtros
 * @param {Function} onViewModeChange - Callback cuando cambia el modo de vista
 * @param {Function} onStatFilterChange - Callback cuando se cambia el filtro de estadística
 */
const ReservationStats = ({ allReservations, dayReservations, selectedDate, filters, setFilters, onViewModeChange, onStatFilterChange }) => {
    // Estados: 'all' (Todas), 'month' (Mes), 'day' (Del día)
    const [viewMode, setViewMode] = useState('day');
    const [lastFilterType, setLastFilterType] = useState('date'); // 'date' o 'toggle'
    const [activeStatFilter, setActiveStatFilter] = useState(''); // Filtro interno de las tarjetas

    // Cambiar automáticamente a "Del día" cuando se selecciona una fecha en el calendario
    useEffect(() => {
        if (selectedDate) {
            setViewMode('day');
            setLastFilterType('date');
            onViewModeChange?.('day');
        }
    }, [selectedDate]); // Solo depende de selectedDate
    
    // Calcular reservas del mes
    const monthReservations = filterReservationsByMonth(allReservations, selectedDate);
    
    // Reservas para las tarjetas (SIN filtro de estado)
    const getReservationsForCards = () => {
        switch (viewMode) {
            case 'day':
                return dayReservations;
            case 'month':
                return monthReservations;
            case 'all':
            default:
                return allReservations;
        }
    };
    
    // Reservas para el listado (CON filtro de estado del panel + filtro de tarjetas)
    const getReservationsForList = () => {
        let baseReservations = getReservationsForCards();
        
        // Aplicar filtro de estado del panel si está activo
        if (filters.estado) {
            baseReservations = baseReservations.filter(reservation => 
                reservation.estado === filters.estado
            );
        }
        
        // Aplicar filtro de estado de las tarjetas si está activo
        if (activeStatFilter) {
            baseReservations = baseReservations.filter(reservation => 
                reservation.estado === activeStatFilter
            );
        }
        
        return baseReservations;
    };
    
    const reservationsForCards = getReservationsForCards();
    const reservationsForList = getReservationsForList();
    
    // Calcular estadísticas para las tarjetas (sin filtro de estado)
    const cardStats = calculateReservationStats(reservationsForCards);
    
    // Calcular estadísticas para el resumen (con filtro de estado)
    const summaryStats = calculateReservationStats(reservationsForList);

    // Manejar clic en las tarjetas de estadísticas
    const handleStatClick = (estado) => {
        // Si es el total, limpiar el filtro interno de las tarjetas
        if (estado === 'total') {
            setActiveStatFilter('');
            onStatFilterChange?.('');
            return;
        }

        // Si ya está seleccionado el mismo estado, hacer toggle (quitar filtro)
        if (activeStatFilter === estado) {
            setActiveStatFilter('');
            onStatFilterChange?.('');
        } else {
            // Seleccionar el nuevo estado
            setActiveStatFilter(estado);
            onStatFilterChange?.(estado);
        }
    };

    // Manejar cambio de modo de vista
    const handleViewModeChange = (newMode) => {
        setViewMode(newMode);
        setLastFilterType('toggle');
        onViewModeChange?.(newMode);
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-3 md:p-6 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 md:mb-4 gap-3">
                <h3 className="text-base md:text-lg font-semibold text-turquesa flex items-center gap-2">
                    <CalendarDaysIcon className="h-5 w-5 md:h-6 md:w-6" />
                    Estadísticas de reservas
                </h3>
                
                {/* Toggle entre tres modos de visualización */}
                <div className="flex items-center gap-1 md:gap-2 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => handleViewModeChange('all')}
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                            viewMode === 'all' 
                                ? 'bg-turquesa text-white shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title="Ver todas las reservas según filtros aplicados"
                    >
                        Todas
                    </button>
                    <button
                        onClick={() => handleViewModeChange('month')}
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                            viewMode === 'month' 
                                ? 'bg-turquesa text-white shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={`Ver reservas de ${format(selectedDate, "MMMM 'de' yyyy", { locale: es })}`}
                    >
                        Mes
                    </button>
                    <button
                        onClick={() => handleViewModeChange('day')}
                        className={`px-2 md:px-3 py-1 md:py-1.5 text-xs md:text-sm rounded-md transition-all whitespace-nowrap ${
                            viewMode === 'day' 
                                ? 'bg-turquesa text-white shadow-sm' 
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                        title={`Ver reservas del ${format(selectedDate, "dd 'de' MMMM", { locale: es })}`}
                    >
                        Del día
                    </button>
                </div>
            </div>

            {/* Indicador de qué se está mostrando */}
            <p className="text-xs text-gray-500 mb-3">
                {viewMode === 'day' && `📅 Mostrando reservas del ${format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}`}
                {viewMode === 'month' && `📆 Mostrando reservas de ${format(selectedDate, "MMMM 'de' yyyy", { locale: es })}`}
                {viewMode === 'all' && '🗂️ Mostrando todas las reservas según filtros aplicados'}
            </p>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 md:gap-4">
                {/* Total de reservas */}
                <StatCard
                    title="Total de Reservas"
                    value={cardStats.total}
                    bgColor="bg-blue-50"
                    textColor="text-blue-700"
                    ringColor="ring-blue-500"
                    icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
                    isClickable={true}
                    isSelected={activeStatFilter === ""}
                    onClick={() => handleStatClick('total')}
                />

                {/* Reservas Confirmadas */}
                <StatCard
                    title="Confirmadas"
                    value={cardStats.confirmadas}
                    bgColor="bg-green-50"
                    textColor="text-green-700"
                    ringColor="ring-green-500"
                    icon={<CheckCircleIcon className="h-8 w-8" />}
                    isClickable={true}
                    isSelected={activeStatFilter === "Confirmada"}
                    onClick={() => handleStatClick('Confirmada')}
                />

                {/* Reservas Completadas */}
                <StatCard
                    title="Completadas"
                    value={cardStats.completadas}
                    bgColor="bg-emerald-50"
                    textColor="text-emerald-700"
                    ringColor="ring-emerald-500"
                    icon={<CheckBadgeIcon className="h-8 w-8" />}
                    isClickable={true}
                    isSelected={activeStatFilter === "Completada"}
                    onClick={() => handleStatClick('Completada')}
                />

                {/* Reservas Creadas */}
                <StatCard
                    title="Creadas"
                    value={cardStats.creadas}
                    bgColor="bg-yellow-50"
                    textColor="text-yellow-700"
                    ringColor="ring-yellow-500"
                    icon={<ClipboardDocumentListIcon className="h-8 w-8" />}
                    isClickable={true}
                    isSelected={activeStatFilter === "Creada"}
                    onClick={() => handleStatClick('Creada')}
                />

                {/* Reservas Canceladas */}
                <StatCard
                    title="Canceladas"
                    value={cardStats.canceladas}
                    bgColor="bg-red-50"
                    textColor="text-red-700"
                    ringColor="ring-red-500"
                    icon={<XCircleIcon className="h-8 w-8" />}
                    isClickable={true}
                    isSelected={activeStatFilter === "Cancelada"}
                    onClick={() => handleStatClick('Cancelada')}
                />
            </div>

            {/* Resumen textual */}
            {summaryStats.total > 0 && (
                <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
                    <p className="text-xs md:text-sm text-gray-600 text-center">
                        Mostrando <span className="font-semibold text-gray-800">{summaryStats.total}</span> reservas
                        {summaryStats.confirmadas > 0 && (
                            <> · <span className="font-semibold text-green-700">{summaryStats.confirmadas}</span> confirmadas</>
                        )}
                        {summaryStats.completadas > 0 && (
                            <> · <span className="font-semibold text-emerald-700">{summaryStats.completadas}</span> completadas</>
                        )}
                        {summaryStats.creadas > 0 && (
                            <> · <span className="font-semibold text-yellow-700">{summaryStats.creadas}</span> creadas</>
                        )}
                        {summaryStats.canceladas > 0 && (
                            <> · <span className="font-semibold text-red-700">{summaryStats.canceladas}</span> canceladas</>
                        )}
                    </p>
                </div>
            )}

            {/* Ayuda sobre el filtrado */}
            {activeStatFilter && (
                <div className="mt-2 md:mt-3 bg-blue-50 border border-blue-200 rounded-lg p-2">
                    <p className="text-xs text-blue-700 text-center">
                        💡 Filtrado por estado: <span className="font-semibold">{activeStatFilter}</span>
                        {' '}- Haz clic en la misma tarjeta o en "Total" para quitar el filtro
                    </p>
                </div>
            )}
        </div>
    );
};

export default ReservationStats;

