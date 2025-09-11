import React from 'react';

const CheckInButton = ({ onClick, disabled = false }) => {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
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
    );
};

export default CheckInButton;
