import React from 'react';

/**
 * Componente de tarjeta para mostrar una estadística individual
 * @param {string} title - Título de la estadística
 * @param {number} value - Valor numérico a mostrar
 * @param {string} bgColor - Color de fondo (clase Tailwind)
 * @param {string} textColor - Color del texto (clase Tailwind)
 * @param {string} ringColor - Color del anillo de selección (clase Tailwind)
 * @param {React.ReactNode} icon - Icono opcional para mostrar
 * @param {Function} onClick - Función a ejecutar al hacer clic
 * @param {boolean} isSelected - Indica si la tarjeta está seleccionada
 * @param {boolean} isClickable - Indica si la tarjeta es clickeable
 */
const StatCard = ({ 
    title, 
    value, 
    bgColor = "bg-gray-100", 
    textColor = "text-gray-800",
    ringColor = "ring-blue-500",
    icon,
    onClick,
    isSelected = false,
    isClickable = false
}) => {
    const baseClasses = `${bgColor} rounded-lg p-4 shadow-sm transition-all duration-200`;
    const hoverClasses = isClickable ? 'hover:shadow-lg hover:scale-105 cursor-pointer' : 'hover:shadow-md';
    const selectedClasses = isSelected ? `ring-4 ring-offset-2 ${ringColor} shadow-lg scale-105` : '';
    
    return (
        <div 
            className={`${baseClasses} ${hoverClasses} ${selectedClasses}`}
            onClick={isClickable ? onClick : undefined}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            onKeyDown={isClickable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.();
                }
            } : undefined}
        >
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className={`text-sm font-medium ${textColor} opacity-80`}>
                        {title}
                    </p>
                    <p className={`text-2xl font-bold ${textColor} mt-1`}>
                        {value}
                    </p>
                </div>
                {icon && (
                    <div className={`${textColor} opacity-60`}>
                        {icon}
                    </div>
                )}
            </div>
            {isClickable && (
                <p className="text-xs text-gray-500 mt-2 italic">
                    {isSelected ? '✓ Filtro activo' : 'Clic para filtrar'}
                </p>
            )}
        </div>
    );
};

export default StatCard;

