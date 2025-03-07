import React from 'react';

const CancelButton = ({ onClick, className = '', disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`text-sm text-white bg-fucsia px-4 py-2 rounded hover:bg-fucsia/90 transition 
                ${disabled ? 'opacity-50 cursor-not-allowed' : ''} 
                ${className}`}
        >
            Cancelar
        </button>
    );
};

export default CancelButton;
