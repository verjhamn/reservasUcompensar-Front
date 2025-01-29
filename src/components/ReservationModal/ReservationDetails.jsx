import React from "react";

const ReservationDetails = ({ title, description, setTitle, setDescription }) => (
  <div className="bg-white p-4 mt-4">
    <h3 className="text-lg font-semibold text-turquesa mb-1">Título</h3>
    <input
      value={title}
      onChange={(e) => setTitle(e.target.value)}
      className="w-full border p-2 rounded-md"
    />
    <h3 className="text-lg font-semibold text-turquesa mt-4">Descripción</h3>
    <textarea
      value={description}
      onChange={(e) => setDescription(e.target.value)}
      className="w-full border p-2 rounded-md"
    />
  </div>
);

export default ReservationDetails;