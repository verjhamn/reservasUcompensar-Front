import React from 'react';

const TimeSlotSelector = ({
    timeSlots,
    selectedHours,
    onTimeSelect,
    isAvailable,
    isCoworking
}) => {
    return (
        <div className="bg-transparent mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
                {isCoworking ? "Seleccionar período" : "Seleccionar horario"}
            </h3>
            <div className="mb-4 p-3 bg-white border border-gray-100 rounded-lg shadow-sm text-xs">
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-600 rounded flex items-center justify-center">
                            <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                        </div>
                        <span className="font-semibold text-gray-700">Hora Seleccionada</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border-2 border-purple-400 rounded"></div>
                        <span className="font-semibold text-gray-700">Disponible</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 border border-gray-300 rounded flex items-center justify-center overflow-hidden">
                            <div className="w-[120%] h-[1.5px] bg-gray-400 rotate-45"></div>
                        </div>
                        <span className="font-semibold text-gray-500">No disponible</span>
                    </div>
                </div>
            </div>
            <div className="max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                    {timeSlots.map((time) => {
                        const available = isAvailable(time);
                        return (
                            <button
                                key={time}
                                onClick={() => available && onTimeSelect(time)}
                                disabled={!available}
                                className={`
                                p-2 rounded-md text-sm transition-all duration-200 font-semibold
                                ${selectedHours.includes(time)
                                        ? 'bg-purple-600 text-white shadow-md shadow-purple-200 transform scale-105 border-2 border-purple-600'
                                        : available
                                            ? 'bg-white text-gray-800 border-2 border-purple-400 hover:border-purple-600 hover:bg-purple-50 hover:shadow-sm hover:text-purple-800'
                                            : 'bg-gray-200 text-gray-500 cursor-not-allowed border border-gray-300 line-through decoration-gray-400 decoration-2'
                                    }
                            `}
                            >
                                {time}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TimeSlotSelector;
