import React from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import CancelButton from '../UtilComponents/CancelButton';

const MyReservationList = ({ selectedDate, events, onCancelReservation, onCheckOut }) => {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Creada":
                return "text-amber-600 bg-amber-50 border border-amber-200";
            case "Confirmada":
                return "text-emerald-600 bg-emerald-50 border border-emerald-200";
            case "Completada":
                return "text-blue-600 bg-blue-50 border border-blue-200";
            case "Cancelada":
                return "text-red-500 bg-red-50 border border-red-200";
            default:
                return "text-gray-500 bg-gray-50 border border-gray-200";
        }
    };

    const puedeHacerCheckOut = (event) => {
        const ahora = new Date();
        const inicioReserva = new Date(event.hora_inicio);
        const finReserva = new Date(event.hora_fin);

        return event.estado === "Confirmada" &&
            inicioReserva <= ahora &&
            finReserva >= ahora;
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-xl border border-neutral-100 h-full">
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
                <div className="p-2 bg-purple-50 rounded-lg">
                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
                <h3 className="text-base font-bold text-gray-800 capitalize">
                    {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
                </h3>
            </div>

            {events.length > 0 ? (
                <ul className="space-y-3">
                    {events.map((event) => (
                        <li key={event.id} className="bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-xl p-4 transition-all duration-200">
                            <div className="flex justify-between items-start gap-4">
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h4 className="text-sm font-bold text-gray-800">
                                            {event.idEspacio || 'N/A'}
                                        </h4>
                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${getEstadoColor(event.estado)}`}>
                                            {event.estado}
                                        </span>
                                    </div>

                                    <p className="text-xs text-neutral-400 font-mono">
                                        #{event.id}
                                    </p>

                                    <p className="text-sm text-neutral-500">
                                        <span className="font-medium text-neutral-400 mr-1">Tipo:</span>
                                        {event.type || 'Sin tipo'}
                                    </p>
                                    <p className="text-sm text-neutral-500 font-medium">
                                        🕐 {format(new Date(event.start), "HH:mm")} – {format(new Date(event.end), "HH:mm")}
                                    </p>

                                    {event.type === 'Coworking' ? (
                                        <p className="text-sm text-neutral-500">
                                            <span className="font-medium text-neutral-400 mr-1">Obs:</span>
                                            {event.observaciones || 'Sin observaciones'}
                                        </p>
                                    ) : (
                                        <div className="space-y-0.5">
                                            <p className="text-sm text-neutral-500">
                                                <span className="font-medium text-neutral-400 mr-1">Título:</span>
                                                {event.title || 'Sin título'}
                                            </p>
                                            <p className="text-sm text-neutral-500">
                                                <span className="font-medium text-neutral-400 mr-1">Desc:</span>
                                                {event.descripcion || 'Sin descripción'}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-2 shrink-0">
                                    {puedeHacerCheckOut(event) && (
                                        <button
                                            onClick={() => onCheckOut(event)}
                                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
                                            title="Hacer Check-out"
                                        >
                                            Check-out
                                        </button>
                                    )}

                                    {!puedeHacerCheckOut(event) && event.estado !== "Cancelada" && event.estado !== "Completada" && (
                                        <CancelButton onClick={() => onCancelReservation(event.id)} />
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="p-4 bg-purple-50 rounded-full mb-3">
                        <svg className="w-8 h-8 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-medium text-neutral-500">Sin reservas este día</p>
                    <p className="text-xs text-neutral-400 mt-1">Selecciona otra fecha en el calendario</p>
                </div>
            )}
        </div>
    );
};

export default MyReservationList;
