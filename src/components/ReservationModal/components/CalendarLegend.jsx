import React from 'react';

const CalendarLegend = () => {
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Leyenda del calendario:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#722070] rounded shadow-sm ring-1 ring-purple-300 ring-offset-1"></div>
                    <span>Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-purple-300 rounded hover:bg-purple-50"></div>
                    <span>Disponible</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-transparent rounded opacity-60"></div>
                    <span>No disponible</span>
                </div>
                {/* Días calendario específicos */}
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#ffebee] border-2 border-[#f44336] rounded"></div>
                    <span>Día sin cupo</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarLegend;
