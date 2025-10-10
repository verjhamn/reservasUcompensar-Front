import React, { useState } from 'react';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';
import Pagination from '../UtilComponents/Pagination';
import CancelButton from '../UtilComponents/CancelButton';
import CheckInButton from '../UtilComponents/CheckInButton';
import SimpleReservationCounter from '../Stats/SimpleReservationCounter';
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
    const [expandedItems, setExpandedItems] = useState({});
    const itemsPerPage = 5;
    const isEmpty = (obj) => !obj || Object.keys(obj).length === 0;

    // Función para alternar expansión de texto
    const toggleExpanded = (itemId, field) => {
        setExpandedItems(prev => ({
            ...prev,
            [`${itemId}-${field}`]: !prev[`${itemId}-${field}`]
        }));
    };

    // Función para truncar texto
    const truncateText = (text, maxLength = 80) => {
        if (!text || text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };


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

            {/* Contador simple de reservas del día */}
            {isAdminView && <SimpleReservationCounter reservations={events} selectedDate={selectedDate} />}

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

                            const isTituloExpanded = expandedItems[`${event.id}-titulo`];
                            const isDescripcionExpanded = expandedItems[`${event.id}-descripcion`];
                            const isObservacionesExpanded = expandedItems[`${event.id}-observaciones`];

                            return (
                                <li key={event.id} className="bg-white rounded-lg border border-gray-200 mb-3 overflow-hidden">
                                    {/* Versión compacta para móvil */}
                                    <div className="block md:hidden">
                                        <div className="p-3">
                                            {/* Header compacto */}
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-base font-semibold text-gray-800">
                                                        📍 {espacio.codigo}
                                                    </h4>
                                                    {showStatus && event.estado && (
                                                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${estadoStyles[event.estado] || ''}`}>
                                                            {event.estado}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-1">
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

                                            {/* Información básica compacta */}
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">👤 {usuario.displayName}</span>
                                                    <span className="text-gray-500">{format(new Date(event.hora_inicio), "HH:mm")}-{format(new Date(event.hora_fin), "HH:mm")}</span>
                                                </div>
                                                <div className="flex items-center justify-between text-sm">
                                                    <span className="text-gray-600">🏢 {espacio.key}</span>
                                                    <span className="text-gray-500">#{event.id}</span>
                                                </div>
                                                {event.titulo && (
                                                    <div className="text-sm text-gray-600">
                                                        <span className="font-medium">📝</span> 
                                                        {event.titulo.length > 50 ? (
                                                            <span>
                                                                {isTituloExpanded ? event.titulo : truncateText(event.titulo, 50)}
                                                                <button
                                                                    onClick={() => toggleExpanded(event.id, 'titulo')}
                                                                    className="ml-1 text-blue-600 font-medium"
                                                                >
                                                                    {isTituloExpanded ? '▼' : '▶'}
                                                                </button>
                                                            </span>
                                                        ) : (
                                                            ` ${event.titulo}`
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Versión expandida para desktop */}
                                    <div className="hidden md:block">
                                        <div className="bg-gray-50 p-4">
                                            {/* Header con espacio y estado */}
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-semibold text-gray-800">
                                                        📍 {espacio.codigo}
                                                    </h4>
                                                    {showStatus && event.estado && (
                                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${estadoStyles[event.estado] || ''}`}>
                                                            {event.estado}
                                                        </span>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
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

                                            {/* Grid de información */}
                                            <div className="grid grid-cols-2 gap-4">
                                                {/* Información básica */}
                                                <div className="space-y-3">
                                                    <div className="bg-white rounded-lg p-3">
                                                        <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            👤 Usuario
                                                        </h5>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-800 font-medium">{usuario.displayName}</p>
                                                            <p className="text-sm text-gray-600 break-words">{usuario.email}</p>
                                                            <p className="text-sm text-gray-600">{usuario.jobTitle}</p>
                                                        </div>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-3">
                                                        <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                            📋 Detalles
                                                        </h5>
                                                        <div className="space-y-1">
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">ID:</span> {event.id}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Tipo:</span> {espacio.key}
                                                            </p>
                                                            <p className="text-sm text-gray-600">
                                                                <span className="font-medium">Horario:</span> {format(new Date(event.hora_inicio), "HH:mm")} - {format(new Date(event.hora_fin), "HH:mm")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Información extendida */}
                                                <div className="space-y-3">
                                                    {espacio.key === 'Coworking' ? (
                                                        <div className="bg-white rounded-lg p-3">
                                                            <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                                💬 Observaciones
                                                            </h5>
                                                            <div className="text-sm text-gray-600">
                                                                {event.observaciones && event.observaciones.length > 80 ? (
                                                                    <div>
                                                                        {isObservacionesExpanded ? event.observaciones : truncateText(event.observaciones)}
                                                                        <button
                                                                            onClick={() => toggleExpanded(event.id, 'observaciones')}
                                                                            className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                                        >
                                                                            {isObservacionesExpanded ? 'Ver menos' : 'Ver más'}
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    event.observaciones || 'Sin observaciones'
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            {event.titulo && (
                                                                <div className="bg-white rounded-lg p-3">
                                                                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                                        📝 Título
                                                                    </h5>
                                                                    <div className="text-sm text-gray-600">
                                                                        {event.titulo.length > 80 ? (
                                                                            <div>
                                                                                {isTituloExpanded ? event.titulo : truncateText(event.titulo)}
                                                                                <button
                                                                                    onClick={() => toggleExpanded(event.id, 'titulo')}
                                                                                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                                                >
                                                                                    {isTituloExpanded ? 'Ver menos' : 'Ver más'}
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            event.titulo
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {event.descripcion && (
                                                                <div className="bg-white rounded-lg p-3">
                                                                    <h5 className="font-medium text-gray-700 mb-2 flex items-center gap-2">
                                                                        📄 Descripción
                                                                    </h5>
                                                                    <div className="text-sm text-gray-600">
                                                                        {event.descripcion.length > 80 ? (
                                                                            <div>
                                                                                {isDescripcionExpanded ? event.descripcion : truncateText(event.descripcion)}
                                                                                <button
                                                                                    onClick={() => toggleExpanded(event.id, 'descripcion')}
                                                                                    className="ml-2 text-blue-600 hover:text-blue-800 font-medium text-xs"
                                                                                >
                                                                                    {isDescripcionExpanded ? 'Ver menos' : 'Ver más'}
                                                                                </button>
                                                                            </div>
                                                                        ) : (
                                                                            event.descripcion
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            </div>
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
