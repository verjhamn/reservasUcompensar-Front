import React from "react";

const ConfirmButton = ({ onClick }) => (
  <div className="flex justify-end mt-4">
    <button
      onClick={onClick}
      className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition"
    >
      Confirmar Reserva
    </button>
  </div>
);

export default ConfirmButton;