import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AdminSearchFilters from '../AdminFilters/AdminSearchFilters';
import ReservationCalendar from '../Calendar/ReservationCalendar';
import ReservationStats from '../Stats/ReservationStats';
import { getAllReservations } from '../../Services/adminReservasService';
import { deleteReserva } from '../../Services/deleteReservaService';
import { realizarCheckInAdmin } from '../../Services/checkInService';
import { showConfirmation, showSuccessToast, showErrorToast } from '../UtilComponents/Confirmation';
import ReservationList from '../Calendar/ReservationList';
import { format } from 'date-fns';
import es from 'date-fns/locale/es';

const AdminReservationsView = () => {
    const [filters, setFilters] = useState({
        palabra: "",
        email: "",
        tipo: "",
        estado: "",
        piso: ""
    });
    const [reservations, setReservations] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [viewMode, setViewMode] = useState('day');

    // Cambiar la dependencia del useEffect para que solo se ejecute con filters
    useEffect(() => {
        fetchReservations();
    }, [filters]); // Remover selectedDate de las dependencias

    const fetchReservations = async () => {
        try {
            const data = await getAllReservations(filters); // No incluir fecha en los filtros
            
            const formattedReservations = data.map(reservation => {
                const startDate = new Date(reservation.hora_inicio);
                const endDate = new Date(reservation.hora_fin);
                
                
                // Determinar el tipo de espacio
                let espacioKey = reservation.espacio?.key;
                let espacioType = reservation.espacio?.tipo_espacio;
                
                // Para espacios de coworking, usar el tipo específico o 'Coworking' como fallback
                if (reservation.espacio_type === "App\\\\Models\\\\basics\\\\EspacioCoworking" || 
                    reservation.espacio?.tipo?.toLowerCase().includes("coworking") ||
                    reservation.espacio?.tipo?.toLowerCase().includes("puesto")) {
                    espacioKey = 'Coworking';
                }

                return {
                    id: reservation.id,
                    titulo: reservation.titulo,
                    descripcion: reservation.descripcion,
                    observaciones: reservation.observaciones,
                    estado: reservation.estado,
                    usuario: reservation.usuario,
                    type: espacioKey || 'Coworking',
                    idEspacio: reservation.espacio?.codigo,
                    espacio_type: reservation.espacio_type, // ✅ Incluir espacio_type en el objeto transformado
                    espacio: {
                        codigo: reservation.espacio?.codigo,
                        key: espacioKey,
                        tipo: espacioType || reservation.espacio?.tipo,
                        nombre: reservation.espacio?.nombre
                    },
                    start: startDate,
                    end: endDate,
                    hora_inicio: startDate,
                    hora_fin: endDate
                };
            });

            setReservations(formattedReservations);
        } catch (error) {
            console.error('Error al cargar reservas:', error);
            showErrorToast('Error al cargar las reservas');
        }
    };

    const handleCancelReservation = async (reservationId) => {
        try {
            const confirmed = await showConfirmation(
                () => { },
                "¿Estás seguro de que deseas cancelar esta reserva?"
            );

            if (confirmed) {
                await deleteReserva(reservationId);
                await fetchReservations();
                showSuccessToast('Reserva cancelada con éxito');
            }
        } catch (error) {
            showErrorToast('Error al cancelar la reserva');
        }
    };

    const handleCheckIn = async (reservationId) => {
        try {
            const confirmed = await showConfirmation(
                () => { },
                "¿Estás seguro de que deseas realizar el check-in de esta reserva?"
            );

            if (confirmed) {
                await realizarCheckInAdmin(reservationId);
                await fetchReservations();
                showSuccessToast('Check-in realizado con éxito');
            }
        } catch (error) {
            console.error('Error al realizar check-in:', error);
            showErrorToast('Error al realizar el check-in');
        }
    };

    // Las reservas filtradas ahora se calculan en ReservationStats
    // Solo necesitamos pasar las reservas base sin filtros de estado
    const getBaseReservations = () => {
        let baseReservations = reservations;

        // Aplicar filtros del panel de búsqueda (SIN filtro de estado)
        if (filters.palabra) {
            baseReservations = baseReservations.filter(reservation => 
                reservation.titulo?.toLowerCase().includes(filters.palabra.toLowerCase()) ||
                reservation.id?.toString().includes(filters.palabra) ||
                reservation.espacio?.codigo?.toLowerCase().includes(filters.palabra.toLowerCase())
            );
        }

        if (filters.email) {
            baseReservations = baseReservations.filter(reservation => 
                reservation.usuario?.email?.toLowerCase().includes(filters.email.toLowerCase())
            );
        }

        if (filters.tipo) {
            baseReservations = baseReservations.filter(reservation => {
                // Para coworking, verificar si es espacio de coworking
                if (filters.tipo === "Coworking") {
                    return reservation.espacio_type === "App\\\\Models\\\\basics\\\\EspacioCoworking" ||
                           reservation.espacio?.tipo?.toLowerCase().includes("coworking") ||
                           reservation.espacio?.tipo?.toLowerCase().includes("puesto");
                }
                // Para otros tipos, usar la lógica original
                return reservation.espacio?.key === filters.tipo;
            });
        }

        if (filters.piso) {
            baseReservations = baseReservations.filter(reservation => 
                reservation.espacio?.piso?.toString() === filters.piso
            );
        }

        return baseReservations;
    };

    const baseReservations = getBaseReservations();
    const [statFilter, setStatFilter] = useState(''); // Filtro interno de las tarjetas

    return (
        <div className="container mx-auto">
            <Toaster />
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Columna izquierda: Calendario y Filtros */}
                <div className="w-full lg:w-1/4 flex flex-col gap-4">
                    <div className="w-full">
                        <ReservationCalendar
                            events={reservations}
                            selectedDate={selectedDate}
                            onSelectDate={(newDate) => {
                                setSelectedDate(newDate);
                                // Siempre cambiar a modo "day" cuando se selecciona una fecha
                                setViewMode('day');
                            }}
                        />
                    </div>
                    <div className="w-full">
                        <AdminSearchFilters
                            filters={filters}
                            setFilters={setFilters}
                        />
                    </div>
                </div>
                
                {/* Columna derecha: Estadísticas y Listado */}
                <div className="w-full lg:flex-1 flex flex-col gap-4">
                    {/* Dashboard de estadísticas generales */}
                    <ReservationStats 
                        allReservations={baseReservations}
                        dayReservations={baseReservations.filter(event =>
                            format(new Date(event.start), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")
                        )}
                        selectedDate={selectedDate}
                        filters={filters}
                        setFilters={setFilters}
                        onViewModeChange={(newMode) => {
                            setViewMode(newMode);
                        }}
                        onStatFilterChange={(filter) => {
                            setStatFilter(filter);
                        }}
                        viewMode={viewMode}
                    />
                    
                    <div className="w-full">
                        {(() => {
                            const finalEvents = baseReservations.filter(event => {
                                // Aplicar filtro de estado del panel si está activo
                                if (filters.estado && event.estado !== filters.estado) {
                                    return false;
                                }
                                
                                // Aplicar filtro de estado de las tarjetas si está activo
                                if (statFilter && event.estado !== statFilter) {
                                    return false;
                                }
                                
                                // Aplicar filtro de fecha según el modo de vista
                                switch (viewMode) {
                                    case 'day':
                                        return format(new Date(event.start), "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
                                    case 'month':
                                        const selectedMonth = selectedDate.getMonth();
                                        const selectedYear = selectedDate.getFullYear();
                                        const eventDate = new Date(event.start);
                                        return eventDate.getMonth() === selectedMonth && 
                                               eventDate.getFullYear() === selectedYear;
                                    case 'all':
                                    default:
                                        return true;
                                }
                            });


                            // Mostrar mensaje informativo si hay filtros de tipo pero no hay resultados por fecha
                            const hasTypeFilter = filters.tipo && filters.tipo !== "";
                            const hasDateFilter = viewMode !== 'all';
                            const noResults = finalEvents.length === 0;
                            
                            return (
                                <>
                                    {hasTypeFilter && hasDateFilter && noResults && (
                                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0">
                                                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div className="ml-3">
                                                    <h3 className="text-sm font-medium text-yellow-800">
                                                        No hay {filters.tipo} en la fecha seleccionada
                                                    </h3>
                                                    <div className="mt-2 text-sm text-yellow-700">
                                                        <p>
                                                            Estás filtrando por <strong>{filters.tipo}</strong> y fecha <strong>
                                                                {viewMode === 'day' ? format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) :
                                                                 viewMode === 'month' ? format(selectedDate, "MMMM 'de' yyyy", { locale: es }) : ''}
                                                            </strong>, pero no hay resultados.
                                                        </p>
                                                        <p className="mt-1">
                                                            💡 <strong>Sugerencia:</strong> Cambia el toggle a <strong>"Todas"</strong> para ver todos los {filters.tipo} sin filtro de fecha.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    
                                    <ReservationList
                                        selectedDate={selectedDate}
                                        events={finalEvents}
                                        onCancelReservation={handleCancelReservation}
                                        onCheckIn={handleCheckIn}
                                        showStatus={true}
                                        isAdminView={true}
                                    />
                                </>
                            );
                        })()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminReservationsView;
