import React, { useState } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Pagination from '../UtilComponents/Pagination';
import CancelButton from '../UtilComponents/CancelButton';
import CheckInButton from '../UtilComponents/CheckInButton';
import { RESERVATION_STATES } from '../../utils/constants';
import { canAdminCheckIn, canUserCheckIn } from '../../utils/checkinRules';

const estadoStyles = {
    'Creada': 'bg-gray-300 text-gray-800',
    'Cancelada': 'bg-red-100 text-red-800',
    'Confirmada': 'bg-green-100 text-green-800',
    // Puedes agregar más estados aquí
};

const ReservationList = ({ selectedDate, events, onCancelReservation, onCheckIn, showStatus = false, isAdminView = false }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

    // Función para validar si se puede hacer check-in (usa reglas centralizadas)
    const puedeHacerCheckIn = (event) => {
        return isAdminView ? canAdminCheckIn(event) : canUserCheckIn(event);
    };

    // Calcular eventos paginados
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = events.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(events.length / itemsPerPage);

    return (
        <div className="bg-white p-4 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-turquesa mb-3 border-b">
                Reservas del {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es })}
            </h3>

            {events.length > 0 ? (
                <>
                    <ul className="space-y-4 mb-4">
                        {currentEvents.map((event) => {
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
                                                    <span className={`px-2 text-xs rounded-full ${estadoStyles[event.estado] || ''}`}>
                                                        {event.estado}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gris-medio">ID Reserva: {event.id}</p>
                                            <p className="text-sm text-gris-medio">Tipo: {espacio.key}</p>
                                            <p className="text-sm text-gris-medio">
                                                Horario: {format(new Date(event.hora_inicio), "HH:mm")} - {format(new Date(event.hora_fin), "HH:mm")}
                                            </p>
                                            {espacio.key === 'Coworking' ? (
                                                <p className="text-sm text-gris-medio">Observaciones: {event.observaciones || 'Sin observaciones'}</p>
                                            ) : (
                                                <>
                                                    <p className="text-sm text-gris-medio">Título: {event.titulo || 'Sin título'}</p>
                                                    <p className="text-sm text-gris-medio">Descripción: {event.descripcion || 'Sin descripción'}</p>
                                                </>
                                            )}
                                        </div>

                                        {/* Sección de Botones - Derecha */}
                                        <div className="flex items-center gap-2">
                                            <CheckInButton 
                                                onClick={() => onCheckIn(event.id)}
                                                disabled={!puedeHacerCheckIn(event)}
                                                tooltip={!puedeHacerCheckIn(event) 
                                                    ? (isAdminView 
                                                        ? "La reserva debe estar en estado 'Creada' para hacer check-in" 
                                                        : "Check-in solo disponible desde 15 minutos antes del inicio hasta el final de la reserva")
                                                    : "Realizar check-in de la reserva"
                                                }
                                            />
                                            <CancelButton 
                                                onClick={() => onCancelReservation(event.id)}
                                                disabled={event.estado === RESERVATION_STATES.CANCELADA}
                                                tooltip={event.estado === RESERVATION_STATES.CANCELADA 
                                                    ? "Esta reserva ya está cancelada" 
                                                    : "Cancelar la reserva"
                                                }
                                            />
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>

                    {totalPages > 1 && (
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={events.length}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setCurrentPage}
                        />
                    )}
                </>
            ) : (
                <p className="text-sm text-gris-medio">No hay reservas para este día.</p>
            )}
        </div>
    );
};

export default ReservationList;
