import React, { useEffect } from "react";

const InfoModal = ({ onClose }) => {
  useEffect(() => {
    // Mostrar el modal al cargar la app
    const timer = setTimeout(() => {
      onClose();
    }, 100000); // Cerrar el modal después de 10 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-8 md:p-12 max-w-2xl lg:max-w-5xl w-full max-h-[95vh] overflow-auto shadow-lg">
        {/* Header del Modal */}
        <div className="flex justify-between items-center mb-6 relative">
          <h2 className="text-3xl font-bold text-turquesa text-center w-full">¡Aviso Importante!</h2>
          <button
            onClick={onClose}
            className="absolute top-0 right-0 text-gray-500 hover:text-gray-700 transition-colors"
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

        {/* Imagen del Modal */}
        <div className="mb-6">
          <img
            src="https://reservas.ucompensar.edu.co/img/imgModal.webp"
            alt="Imagen Informativa"
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Contenido del Modal */}
        <div className="space-y-4 text-center">
          <p className="text-gray-600 text-base md:text-xl leading-relaxed">
            Esta aplicación permite reservar exclusivamente espacios de coworking en la sede Campus Av. 68.
          </p>
          <p className="text-gray-600 text-base md:text-xl leading-relaxed">
            Para reservar espacios en la sede Teusaquillo, por favor realiza la solicitud a través de la MIS dando clic <a href="https://mis.ucompensar.edu.co" target="_blank" className="text-turquesa underline">aquí</a>.
          </p>
          <p className="text-gray-600 text-base md:text-2xl leading-relaxed">
            ¡Gracias por tu comprensión!
          </p>
        </div>
      </div>
    </div>
  );
};

export default InfoModal;
