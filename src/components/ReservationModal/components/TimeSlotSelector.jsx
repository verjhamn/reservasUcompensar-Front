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
            <h3 className="text-lg font-bold text-gray-800 mb-3">
                {isCoworking ? "Seleccionar período" : "Seleccionar horario"}
            </h3>
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
                                p-2 rounded-md text-sm transition-all duration-200 font-medium
                                ${selectedHours.includes(time)
                                        ? 'bg-purple-600 text-white shadow-md transform scale-105 ring-2 ring-purple-300 ring-offset-1'
                                        : available
                                            ? 'bg-white text-gray-800 border border-purple-200 hover:border-purple-400 hover:bg-purple-50 hover:shadow-sm hover:text-purple-700'
                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-60 border border-transparent'
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
