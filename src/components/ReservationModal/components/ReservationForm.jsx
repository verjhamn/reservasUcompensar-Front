/* eslint-disable react/prop-types */

const ReservationForm = ({
    isCoworking,
    title,
    setTitle,
    description,
    setDescription,
    onSubmit,
    isGuestMode,
    requestFlowLabel = "Cotizacion",
    submitDisabled = false
}) => {
    return (
        <div className="flex flex-col flex-1 h-full max-h-min relative">
            <div className="bg-transparent flex-1">
                {isGuestMode ? null : (
                    isCoworking ? (
                        <>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">Observaciones (opcional)</h3>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ingrese observaciones adicionales"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm resize-none"
                                rows="2"
                            />
                        </>
                    ) : (
                        <>
                            <h3 className="text-sm font-bold text-gray-700 mb-2">Título de la reserva</h3>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Ingrese el título de la reserva"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm mb-4"
                            />

                            <h3 className="text-sm font-bold text-gray-700 mb-2">Descripción de la reserva</h3>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Ingrese la descripción de la reserva"
                                className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all text-sm resize-none"
                                rows="2"
                            />
                        </>
                    )
                )}
            </div>
            <div className="mt-4 flex justify-end shrink-0">
                <button
                    onClick={onSubmit}
                    disabled={submitDisabled}
                    className={`px-6 py-3 rounded-xl text-white font-medium transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${isGuestMode
                        ? "bg-purple-600 hover:bg-purple-700"
                        : "bg-purple-600 hover:bg-purple-700"
                        }`}
                >
                    {isGuestMode ? `Continuar ${requestFlowLabel}` : "Confirmar Reserva"}
                </button>
            </div>
        </div>
    );
};

export default ReservationForm;
