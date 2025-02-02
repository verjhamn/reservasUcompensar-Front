import React from "react";


const coworkingPeriods = [
    { id: 0, name: "Mañana", start: "07:00", end: "12:00" },
    { id: 1, name: "Tarde", start: "13:00", end: "17:00" },
    { id: 2, name: "Mañana-Tarde", start: "07:00", end: "17:00" },
    { id: 3, name: "Tarde-Noche", start: "17:00", end: "22:00" },
  ];

const TimeSelector = ({ timeSlots, handleTimeSelect }) => (
  <div className="bg-white p-4 mt-4">
    <h3 className="text-lg font-semibold text-turquesa mb-3">Seleccionar período</h3>
    <div className="grid grid-cols-3 gap-4">
      {coworkingPeriods.map((slot) => (
        <button key={slot.id} onClick={() => handleTimeSelect(slot)} className="p-4 bg-gray-100 rounded-md">
          {slot.name} ({slot.start} - {slot.end})
        </button>
      ))}
    </div>
  </div>
);

export default TimeSelector;