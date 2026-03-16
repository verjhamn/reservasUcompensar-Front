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
            <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-bold text-gray-800">
                    {isCoworking ? "Seleccionar período" : "Seleccionar horario"}
                </h3>
                <div className="group relative mt-1">
                    <button className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-100 text-purple-600 hover:bg-purple-200 transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </button>
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-48 p-2 bg-gray-800 text-white text-xs rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 pointer-events-none text-center">
                        Selecciona la fecha y hora de tu interés. En el siguiente paso podrás ingresar tus datos de contacto para la cotización.
                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-gray-800 transform rotate-45"></div>
                    </div>
                </div>
            </div>
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
