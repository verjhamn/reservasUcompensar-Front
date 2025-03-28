import React from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import CancelButton from '../UtilComponents/CancelButton';

const MyReservationList = ({ selectedDate, events, onCancelReservation }) => {
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
                                <div className="space-y-1">
                                    <h4 className="text-base font-semibold text-gris-700">
                                        Espacio: {event.idEspacio}
                                    </h4>
                                    <p className="text-sm text-gris-medio">ID Reserva: {event.id}</p>
                                    <p className="text-sm text-gris-medio">Tipo: {event.type}</p>
                                    <p className="text-sm text-gris-medio">
                                        Horario: {format(new Date(event.start), "HH:mm")} - {format(new Date(event.end), "HH:mm")}
                                    </p>
                                    <p className="text-sm text-gris-medio">Título: {event.title}</p>
                                    <p className="text-sm text-gris-medio">Descripción: {event.descripcion}</p>
                                </div>
                                {event.estado !== "Cancelada" && (
                                    <CancelButton onClick={() => onCancelReservation(event.id)} />
                                )}
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
