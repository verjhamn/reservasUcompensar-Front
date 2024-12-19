import React from 'react';

const ReservationModal = ({ isOpen, onClose, spaceData }) => {
  if (!isOpen || !spaceData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 max-w-4xl w-full">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Confirmar Reserva</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="space-y-6">
          <div className="flex gap-8">
            <div className="w-2/3">
              <img
                src={spaceData.image}
                alt={spaceData.espaciofisico}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
            </div>
            <div className="w-1/3 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">Sede</h3>
                <p className="text-gray-600 text-base">{spaceData.sede}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">Ubicación</h3>
                <p className="text-gray-600 text-base">{spaceData.localidad}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">Espacio</h3>
                <p className="text-gray-600 text-base">{spaceData.espaciofisico}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">Recurso</h3>
                <p className="text-gray-600 text-base">{spaceData.recurso}</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 text-lg">Horario</h3>
                <p className="text-gray-600 text-base">
                  {spaceData.horainicio} - {spaceData.horafinal}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-gris-sutil p-6 rounded-lg">
            <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
            <p className="text-gray-600 text-base">
              <em>Descripción gen��rica del espacio disponible.</em>
            </p>
          </div>
        </div>

        <div className="mt-10 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-3 text-base border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              alert('Reserva confirmada con éxito');
              onClose();
            }}
            className="px-6 py-3 text-base bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition-colors"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReservationModal; 