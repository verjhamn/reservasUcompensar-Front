import React from 'react';
import Tooltip from './Tooltip';

const CancelButton = ({ onClick, className = '', disabled = false, tooltip }) => {
    const getTooltipContent = () => {
        if (tooltip) return tooltip;
        if (disabled) return "No se puede cancelar esta reserva";
        return "Cancelar la reserva";
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
                className={`text-sm text-white bg-fucsia px-4 py-2 rounded hover:bg-fucsia/90 transition 
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                    ${className}`}
            >
                Cancelar
            </button>
        </Tooltip>
    );
};

export default CancelButton;
