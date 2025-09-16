import React, { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { realizarCheckOut } from '../Services/checkInService';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const CheckOutModal = ({ isOpen, onClose, reservaData }) => {
  const [loading, setLoading] = useState(false);

  const handleCheckOut = async () => {
    try {
      setLoading(true);
      const response = await realizarCheckOut(reservaData.id);
      toast.success('Check-out realizado con éxito');
      onClose(true); // true indica que el check-out fue exitoso
    } catch (error) {
      toast.error(error.message || 'Error al realizar el check-out');
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
          <h2 className="text-2xl font-bold text-gray-800">Check-out de Reserva</h2>
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
            {reservaData.type === 'Coworking' ? (
                <p className="text-gray-600">Observaciones: {reservaData.observaciones || 'Sin observaciones'}</p>
            ) : (
                <>
                    <p className="text-gray-600">Título: {reservaData.titulo || 'Sin título'}</p>
                    <p className="text-gray-600">Descripción: {reservaData.descripcion || 'Sin descripción'}</p>
                </>
            )}
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Al confirmar el check-out, marcarás esta reserva como completada y no podrás volver a usarla.
                </p>
              </div>
            </div>
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
              onClick={handleCheckOut}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Procesando...' : 'Confirmar check-out'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckOutModal; 