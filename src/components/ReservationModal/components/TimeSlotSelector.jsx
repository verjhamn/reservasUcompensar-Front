import React from 'react';

const TimeSlotSelector = ({
    timeSlots,
    selectedHours,
    onTimeSelect,
    isAvailable,
    isCoworking
}) => {
    return (
        <div className="bg-white p-4 mt-4">
            <h3 className="text-lg font-semibold text-turquesa mb-3">
                {isCoworking ? "Seleccionar período" : "Seleccionar horario"}
            </h3>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                {timeSlots.map((time) => {
                    const available = isAvailable(time);
                    return (
                        <button
                            key={time}
                            onClick={() => available && onTimeSelect(time)}
                            disabled={!available}
                            className={`
                p-2 rounded-md text-sm
                ${selectedHours.includes(time)
                                    ? 'bg-turquesa text-white'
                                    : available
                                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }
              `}
                        >
                            {time}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default TimeSlotSelector;
