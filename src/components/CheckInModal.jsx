import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { realizarCheckIn } from '../Services/checkInService';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const CheckInModal = ({ isOpen, onClose, reservaData }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckIn = async () => {
    try {
      setLoading(true);
      const response = await realizarCheckIn(reservaData.id);
      toast.success('Check-in realizado con éxito');
      onClose(true); // true indica que el check-in fue exitoso
    } catch (error) {
      toast.error(error.message || 'Error al realizar el check-in');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Toaster />
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Check-in de Reserva</h2>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
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

        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-gray-700">Detalles de la Reserva</h3>
            <p className="text-gray-600">Espacio: {reservaData.espacio?.codigo}</p>
            <p className="text-gray-600">Fecha: {format(new Date(reservaData.hora_inicio), "dd 'de' MMMM 'de' yyyy", { locale: es })}</p>
            <p className="text-gray-600">Hora: {format(new Date(reservaData.hora_inicio), "HH:mm")} - {format(new Date(reservaData.hora_fin), "HH:mm")}</p>
            <p className="text-gray-600">Título: {reservaData.titulo || 'Sin título'}</p>
            <p className="text-gray-600">Descripción: {reservaData.descripcion || 'Sin descripción'}</p>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <button
              onClick={() => onClose(false)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              onClick={handleCheckIn}
              className="px-4 py-2 bg-turquesa text-white rounded hover:bg-turquesa/90 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar Check-in'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckInModal; 