import React from 'react';

const CalendarLegend = () => {
    return (
        <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-xl shadow-sm">
            <h4 className="text-sm font-bold text-gray-800 mb-3">Guía de colores (Calendario):</h4>
            <div className="flex flex-wrap gap-4 text-xs">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-purple-600 rounded flex items-center justify-center shadow-sm">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span className="font-semibold text-gray-700">Día Seleccionado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-50 border-2 border-red-400 rounded flex items-center justify-center">
                        <svg className="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    </div>
                    <span className="font-semibold text-gray-700">Sin Cupo</span>
                </div>
            </div>
        </div>
    );
};

export default CalendarLegend;
