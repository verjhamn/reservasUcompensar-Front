import React from 'react';

const CalendarLegend = () => {
    return (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Leyenda del calendario:</h4>
            <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#00aab7] rounded"></div>
                    <span>Día seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#d32f2f] border-2 border-[#b71c1c] rounded"></div>
                    <span>Día seleccionado sin disponibilidad</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#f0f0f0] rounded"></div>
                    <span>Días anteriores (no disponibles)</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-[#ffebee] border-2 border-[#f44336] rounded"></div>
                    <span>Sin disponibilidad</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
                    <span>Con disponibilidad</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarLegend;
