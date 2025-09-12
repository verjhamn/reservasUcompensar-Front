import React from 'react';
import Tooltip from './Tooltip';

const CheckInButton = ({ onClick, disabled = false, tooltip }) => {
    const getTooltipContent = () => {
        if (tooltip) return tooltip;
        if (disabled) return "Check-in no disponible en este momento";
        return "Realizar check-in de la reserva";
    };

    return (
        <Tooltip 
            content={getTooltipContent()}
            disabled={!getTooltipContent()}
            position="top"
        >
            <button
                onClick={onClick}
                disabled={disabled}
                aria-disabled={disabled}
                className={`
                    px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200
                    ${disabled 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-green-600 hover:bg-green-700 text-white hover:shadow-md'
                    }
                    focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                `}
            >
                Check-In
            </button>
        </Tooltip>
    );
};

export default CheckInButton;
