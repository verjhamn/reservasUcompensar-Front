import React from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const ReservationList = ({ selectedDate, events, onCancelReservation, showStatus = false }) => {
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-turquesa mb-3">
                Reservas del {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>

            {events.length > 0 ? (
                <ul className="space-y-4">
                    {events.map((event) => {
                        const espacio = !isEmpty(event.espacio) ? event.espacio : {
                            codigo: 'No disponible',
                            key: 'No disponible'
                        };
                        const usuario = !isEmpty(event.usuario) ? event.usuario : {
                            displayName: 'No disponible',
                            email: 'No disponible',
                            jobTitle: 'No disponible'
                        };

                        return (
                            <li key={event.id} className="border-b pb-4">
                                <div className="flex gap-4">
                                    {/* Sección de Usuario - Izquierda */}
                                    <div className="w-1/3 ">
                                        <h5 className="font-medium text-gray-700 mb-2">Usuario</h5>
                                        <div className="space-y-1">
                                            <p className="text-sm text-gray-600">{usuario.displayName}</p>
                                            <p className="text-sm text-gray-600">{usuario.email}</p>
                                            <p className="text-sm text-gray-600">{usuario.jobTitle}</p>
                                        </div>
                                    </div>

                                    {/* Sección de Espacio y Reserva - Centro */}
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="text-base font-semibold text-gris-700">
                                                Espacio: {espacio.codigo}
                                            </h4>
                                            {showStatus && event.estado && (
                                                <span className={`px-2 text-xs rounded-full ${
                                                    event.estado === 'Creada' 
                                                        ? 'bg-green-100 text-green-800' 
                                                        : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {event.estado}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gris-medio">ID Reserva: {event.id}</p>
                                        <p className="text-sm text-gris-medio">Tipo: {espacio.key}</p>
                                        <p className="text-sm text-gris-medio">
                                            Horario: {format(new Date(event.hora_inicio), "HH:mm")} - {format(new Date(event.hora_fin), "HH:mm")}
                                        </p>
                                        <p className="text-sm text-gris-medio">Título: {event.titulo || 'Sin título'}</p>
                                        <p className="text-sm text-gris-medio">Descripción: {event.descripcion || 'Sin descripción'}</p>
                                    </div>

                                    {/* Sección de Botón - Derecha */}
                                    <div className="flex items-start">
                                        <button
                                            onClick={() => onCancelReservation(event.id)}
                                            className="text-sm text-white bg-fucsia px-4 py-2 rounded hover:bg-fucsia/90 transition"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-sm text-gris-medio">No hay reservas para este día.</p>
            )}
        </div>
    );
};

export default ReservationList;
