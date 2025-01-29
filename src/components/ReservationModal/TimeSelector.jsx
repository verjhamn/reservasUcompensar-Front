import React from "react";

const TimeSelector = ({ timeSlots, handleTimeSelect }) => (
  <div className="bg-white p-4 mt-4">
    <h3 className="text-lg font-semibold text-turquesa mb-3">Seleccionar período</h3>
    <div className="grid grid-cols-3 gap-4">
      {timeSlots.map((slot) => (
        <button key={slot.id} onClick={() => handleTimeSelect(slot)} className="p-4 bg-gray-100 rounded-md">
          {slot.name} ({slot.start} - {slot.end})
        </button>
      ))}
    </div>
  </div>
);

export default TimeSelector;