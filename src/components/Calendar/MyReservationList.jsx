import React from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import CancelButton from '../UtilComponents/CancelButton';

const MyReservationList = ({ selectedDate, events, onCancelReservation, onCheckOut }) => {
    const getEstadoColor = (estado) => {
        switch (estado) {
            case "Creada":
                return "text-yellow-600 bg-yellow-100";
            case "Confirmada":
                return "text-green-600 bg-green-100";
            case "Completada":
                return "text-blue-600 bg-blue-100";
            case "Cancelada":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
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
        <div className="bg-white p-4 rounded-lg shadow-md h-full">
            <h3 className="text-lg font-semibold text-turquesa mb-3 border-b">
                Reservas del {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>

            {events.length > 0 ? (
                <ul className="space-y-4">
                    {events.map((event) => (
                        <li key={event.id} className="border-b pb-4">
                            <div className="flex justify-between items-start">
                                <div className="space-y-1 flex-1">
                                    <h4 className="text-base font-semibold text-gris-700">
                                        Espacio: {event.idEspacio}
                                    </h4>
                                    <p className="text-sm text-gris-medio">ID Reserva: {event.id}</p>
                                    <p className="text-sm text-gris-medio"> {event.type}</p>
                                    <p className="text-sm text-gris-medio">
                                        Horario: {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                                    </p>
                                    {event.type === 'Coworking' ? (
                                        <p className="text-sm text-gris-medio">Observaciones: {event.observaciones || 'Sin observaciones'}</p>
                                    ) : (
                                        <>
                                            <p className="text-sm text-gris-medio">Título: {event.title || 'Sin título'}</p>
                                            <p className="text-sm text-gris-medio">Descripción: {event.descripcion || 'Sin descripción'}</p>
                                        </>
                                    )}
                                    
                                    {/* Estado de la reserva */}
                                    <div className="mt-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getEstadoColor(event.estado)}`}>
                                            {event.estado}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="flex flex-col space-y-2 ml-4">
                                    {/* Botón de Check-out */}
                                    {puedeHacerCheckOut(event) && (
                                        <button
                                            onClick={() => onCheckOut(event)}
                                            className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                                            title="Hacer Check-out"
                                        >
                                            Check-out
                                        </button>
                                    )}
                                    
                                    {/* Botón de Cancelar - solo si NO puede hacer check-out y no está cancelada/completada */}
                                    {!puedeHacerCheckOut(event) && event.estado !== "Cancelada" && event.estado !== "Completada" && (
                                        <CancelButton onClick={() => onCancelReservation(event.id)} />
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-sm text-gris-medio">No hay reservas para este día.</p>
            )}
        </div>
    );
};

export default MyReservationList;
