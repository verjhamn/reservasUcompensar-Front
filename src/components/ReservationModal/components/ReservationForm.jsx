import React from 'react';

const ReservationForm = ({
    isCoworking,
    title,
    setTitle,
    description,
    setDescription,
    onSubmit
}) => {
    return (
        <>
            <div className="bg-white p-4 mt-1">
                {isCoworking ? (
                    <>
                        <h3 className="text-lg font-semibold text-turquesa mb-3">Observaciones (opcional)</h3>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ingrese observaciones adicionales (opcional)"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
                            rows="3"
                        />
                    </>
                ) : (
                    <>
                        <h3 className="text-lg font-semibold text-turquesa mb-1">Título de la reserva</h3>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ingrese el título de la reserva"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa mb-4"
                        />

                        <h3 className="text-lg font-semibold text-turquesa mb-3">Descripción de la reserva</h3>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ingrese la descripción de la reserva"
                            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa"
                            rows="3"
                        />
                    </>
                )}
            </div>
            <div className="mt-4 flex justify-end">
                <button
                    onClick={onSubmit}
                    className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition"
                >
                    Confirmar Reserva
                </button>
            </div>
        </>
    );
};

export default ReservationForm;
