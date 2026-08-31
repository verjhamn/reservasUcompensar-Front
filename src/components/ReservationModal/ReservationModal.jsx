/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Toaster, toast } from 'react-hot-toast';
import { addHours, startOfDay, isBefore, format } from "date-fns";

import LoadingSpinner from '../UtilComponents/LoadingSpinner';
import { useAvailability } from "./hooks/useAvailability";
import { useReservation } from "./hooks/useReservation";
import { getDisponibilidad, processOccupiedHours } from "../../Services/getDisponibilidadService";
import { canReserveAnySpace } from "../../utils/userHelper";

import SpaceInformation from "./components/SpaceInformation";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import CalendarLegend from "./components/CalendarLegend";
import TimeSlotSelector from "./components/TimeSlotSelector";
import ReservationForm from "./components/ReservationForm";
import QuoteForm from './components/QuoteForm';
import ConflictWarningPanel from './components/ConflictWarningPanel';

const ReservationModal = ({ isOpen, onClose, spaceData, goToMyReservations, isGuestMode }) => {
    const [activeTab, setActiveTab] = useState("info");
    const [selectedHours, setSelectedHours] = useState([]);
    const [quoteData, setQuoteData] = useState(null);
    const [guestRange, setGuestRange] = useState({ startDate: null, endDate: null });
    const [guestAvailabilityByDate, setGuestAvailabilityByDate] = useState({});
    const [guestAvailabilityLoading, setGuestAvailabilityLoading] = useState(false);
    const [dateSelectionMode, setDateSelectionMode] = useState('single');
    const [conflictWarning, setConflictWarning] = useState(null);

    const isCoworking = spaceData?.coworking_contenedor === "SI";
    const isInternalRequestMode = !isGuestMode && !isCoworking && !canReserveAnySpace();
    const usesRequestFlow = isGuestMode || isInternalRequestMode;
    const requestFlowLabel = isInternalRequestMode ? "Solicitud" : "Cotizacion";
    const requestMode = isInternalRequestMode ? "internal" : "external";

    const {
        selectedDate,
        setSelectedDate,
        monthAvailability,
        reservedHours,
        filteredEvents,
        hasAvailabilityForDate,
        isTimeSlotAvailable,
        loadingAvailability,
        generateTimeSlots
    } = useAvailability(spaceData);

    const {
        reservationTitle,
        setReservationTitle,
        reservationDescription,
        setReservationDescription,
        loading: reservationLoading,
        handleConfirmReservation
    } = useReservation({
        spaceData,
        selectedDate,
        selectedHours,
        onClose,
        goToMyReservations,
        isCoworking
    });

    const handleSlotSelect = (slotInfo) => {
        const selectedStart = startOfDay(slotInfo.start);
        const selectedEnd = addHours(selectedStart, 23);

        if (isBefore(selectedStart, startOfDay(new Date()))) {
            toast.error('No se puede reservar en días anteriores al actual.', {
                duration: 4000,
                position: 'top-right',
                style: { background: '#fee2e2', color: '#dc2626' },
            });
            return;
        }

        if (usesRequestFlow) {
            setConflictWarning(null);
            setSelectedHours([]);

            if (dateSelectionMode === 'single') {
                setSelectedDate(selectedStart);
                setGuestRange({ startDate: selectedStart, endDate: selectedStart });
                return;
            }

            if (!guestRange.startDate || guestRange.endDate) {
                setSelectedDate(selectedStart);
                setGuestRange({ startDate: selectedStart, endDate: null });
                return;
            }

            if (isBefore(selectedStart, guestRange.startDate) || isSameCalendarDay(selectedStart, guestRange.startDate)) {
                setSelectedDate(selectedStart);
                setGuestRange({ startDate: selectedStart, endDate: null });
                return;
            }

            setSelectedDate(selectedStart);
            setGuestRange(prev => ({ ...prev, endDate: selectedStart }));
            return;
        }

        if (!hasAvailabilityForDate(selectedStart)) {
            toast.error('Este día no tiene disponibilidad. Por favor seleccione otro día.', {
                duration: 4000,
                position: 'top-right',
                style: { background: '#fee2e2', color: '#dc2626' },
            });
            return;
        }

        const isSlotOccupied = filteredEvents.some(
            (event) =>
                new Date(selectedStart) < new Date(event.end) &&
                new Date(selectedEnd) > new Date(event.start)
        );

        if (!isSlotOccupied) {
            setSelectedDate(selectedStart);
            setSelectedHours([]);
        } else {
            toast.error('Este horario ya está ocupado. Por favor seleccione otro.', {
                duration: 4000,
                position: 'top-right',
                style: { background: '#fee2e2', color: '#dc2626' },
            });
        }
    };

    const handleNavigate = (date) => {
        if (isBefore(startOfDay(date), startOfDay(new Date()))) {
            toast.error('No se puede reservar en días anteriores al actual.', {
                duration: 4000,
                position: 'top-right',
                style: { background: '#fee2e2', color: '#dc2626' },
            });
            return;
        }
        setSelectedDate(date);
    };

    const handleTimeSelect = (time) => {
        const timeValue = parseInt(time.split(':')[0]);

        if (selectedHours.includes(time)) {
            const sortedHours = selectedHours.map(h => parseInt(h.split(':')[0])).sort((a, b) => a - b);
            const minHour = Math.min(...sortedHours);
            const maxHour = Math.max(...sortedHours);

            if (timeValue === minHour || timeValue === maxHour) {
                if (timeValue === minHour) {
                    const nextHour = sortedHours.find(h => h > timeValue);
                    if (nextHour) {
                        setSelectedHours(prev => prev.filter(h => parseInt(h.split(':')[0]) >= nextHour));
                    } else {
                        setSelectedHours(prev => prev.filter(h => h !== time));
                    }
                } else {
                    const prevHour = [...sortedHours].reverse().find(h => h < timeValue);
                    if (prevHour !== undefined) {
                        setSelectedHours(prev => prev.filter(h => parseInt(h.split(':')[0]) <= prevHour));
                    } else {
                        setSelectedHours(prev => prev.filter(h => h !== time));
                    }
                }
            } else {
                toast.error('No puedes desmarcar horas intermedias. Solo puedes desmarcar las horas de los extremos.', {
                    duration: 4000,
                    position: 'top-right',
                    style: { background: '#fee2e2', color: '#dc2626' },
                });
            }
            return;
        }

        const currentHours = selectedHours.map(h => parseInt(h.split(':')[0]));
        const allHours = [...currentHours, timeValue].sort((a, b) => a - b);
        const min = Math.min(...allHours);
        const max = Math.max(...allHours);

        const rangeHours = [];
        for (let i = min; i <= max; i++) {
            rangeHours.push(`${i.toString().padStart(2, '0')}:00`);
        }

        setSelectedHours(rangeHours);
    };

    const dayPropGetter = (date) => {
        if (isBefore(startOfDay(date), startOfDay(new Date()))) {
            return {
                style: {
                    backgroundColor: "#f0f0f0",
                    color: "#d3d3d3",
                    pointerEvents: "none",
                },
                className: "rbc-off-range-bg",
            };
        }

        if (usesRequestFlow) {
            const day = startOfDay(date);
            const start = guestRange.startDate ? startOfDay(guestRange.startDate) : null;
            const end = guestRange.endDate ? startOfDay(guestRange.endDate) : null;
            const isStart = isSameCalendarDay(day, start);
            const isEnd = isSameCalendarDay(day, end);
            const isBetween = start && end && day > start && day < end;

            if (isStart || isEnd) {
                return {
                    style: {
                        backgroundColor: "#722070",
                        color: "#fff",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    },
                };
            }

            if (isBetween) {
                return {
                    style: {
                        backgroundColor: "#a855f7",
                        color: "#fff",
                        borderRadius: "2px",
                    },
                };
            }
        }

        if (!hasAvailabilityForDate(date)) {
            if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
                return {
                    style: {
                        backgroundColor: "#d32f2f",
                        color: "#fff",
                        border: "2px solid #b71c1c",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    },
                    className: "rbc-day-no-availability-selected",
                };
            }
            return {
                style: {
                    backgroundColor: "#ffebee",
                    color: "#d32f2f",
                    border: "2px solid #f44336",
                    borderRadius: "4px",
                },
                className: "rbc-day-no-availability",
            };
        }

        if (!usesRequestFlow && format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
            return {
                style: {
                    backgroundColor: "#722070",
                    color: "#fff",
                },
            };
        }

        return {};
    };

    const slotPropGetter = (date) => {
        if (isBefore(startOfDay(date), startOfDay(new Date()))) {
            return {
                style: {
                    backgroundColor: "#f0f0f0",
                    color: "#d3d3d3",
                    pointerEvents: "none",
                    cursor: "not-allowed",
                },
                className: "rbc-off-range-bg",
            };
        }
        return {};
    };

    const isSameCalendarDay = (a, b) => {
        if (!a || !b) return false;
        return format(a, "yyyy-MM-dd") === format(b, "yyyy-MM-dd");
    };

    const buildDateTime = (date, time) => {
        if (!date || !time) return null;
        return new Date(`${format(date, "yyyy-MM-dd")}T${time}`);
    };

    const getDateKey = (date) => format(date, "yyyy-MM-dd");

    const getDatesInRange = (start, end) => {
        if (!start || !end) return [];
        const dates = [];
        let cursor = startOfDay(start);
        const last = startOfDay(end);
        while (cursor <= last && dates.length < 90) {
            dates.push(cursor);
            cursor = addHours(cursor, 24);
        }
        return dates;
    };

    const getReservedHoursForDate = (date) => {
        if (!date) return [];
        const key = getDateKey(date);
        if (guestAvailabilityByDate[key]) return guestAvailabilityByDate[key];
        if (monthAvailability[key]) return monthAvailability[key];
        if (isSameCalendarDay(date, selectedDate)) return reservedHours;
        return [];
    };

    // Availability check for the TimeSlotSelector in request mode — uses the start date
    const isRequestTimeSlotAvailable = (time) => {
        if (!guestRange.startDate) return true;
        return !getReservedHoursForDate(guestRange.startDate).includes(time);
    };

    const handleModeChange = (mode) => {
        setDateSelectionMode(mode);
        setConflictWarning(null);
        setSelectedHours([]);
        setGuestRange(prev => ({
            startDate: prev.startDate,
            endDate: mode === 'single' ? prev.startDate : null,
        }));
    };

    const getConflictDetails = () => {
        if (!guestRange.startDate || !guestRange.endDate || selectedHours.length === 0) return [];

        const startHour = parseInt(selectedHours[0].split(':')[0], 10);
        const endHour = parseInt(selectedHours[selectedHours.length - 1].split(':')[0], 10) + 1;

        const startTime = selectedHours[0];
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        const rangeStart = buildDateTime(guestRange.startDate, startTime);
        const rangeEnd = buildDateTime(guestRange.endDate, endTime);

        if (!rangeStart || !rangeEnd || rangeEnd <= rangeStart) return [];

        return getDatesInRange(guestRange.startDate, guestRange.endDate)
            .map(date => {
                const reservedForDay = getReservedHoursForDate(date);
                const conflictingHours = reservedForDay.filter(time => {
                    const h = parseInt(time.split(':')[0], 10);
                    return h >= startHour && h < endHour;
                });
                return conflictingHours.length > 0 ? { date, hours: conflictingHours } : null;
            })
            .filter(Boolean);
    };

    const proceedToQuote = () => {
        const endHour = parseInt(selectedHours[selectedHours.length - 1].split(':')[0], 10) + 1;
        const data = {
            date: guestRange.startDate,
            startDate: guestRange.startDate,
            endDate: guestRange.endDate,
            startTime: selectedHours[0],
            endTime: `${endHour.toString().padStart(2, '0')}:00`,
            hours: selectedHours,
        };
        setQuoteData(data);
        setConflictWarning(null);
        setActiveTab("quote");
    };

    useEffect(() => {
        const fetchGuestAvailability = async () => {
            if (!usesRequestFlow || !spaceData?.id) return;

            const datesToFetch = guestRange.startDate && guestRange.endDate
                ? getDatesInRange(guestRange.startDate, guestRange.endDate)
                : [guestRange.startDate, guestRange.endDate].filter(Boolean);

            const uniqueDates = [...new Map(datesToFetch.map(date => [getDateKey(date), date])).values()]
                .filter(date => !guestAvailabilityByDate[getDateKey(date)]);

            if (uniqueDates.length === 0) return;

            setGuestAvailabilityLoading(true);
            try {
                const entries = await Promise.all(uniqueDates.map(async (date) => {
                    const disponibilidad = await getDisponibilidad(spaceData.id, format(date, "dd/MM/yyyy"));
                    return [getDateKey(date), processOccupiedHours(disponibilidad)];
                }));

                setGuestAvailabilityByDate(prev => ({
                    ...prev,
                    ...Object.fromEntries(entries)
                }));
            } catch (error) {
                console.error("Error al cargar disponibilidad del rango seleccionado:", error);
                toast.error('No se pudo validar la disponibilidad del rango seleccionado.');
            } finally {
                setGuestAvailabilityLoading(false);
            }
        };

        fetchGuestAvailability();
    }, [usesRequestFlow, spaceData?.id, guestRange.startDate, guestRange.endDate, guestAvailabilityByDate]);

    // Clear conflict warning whenever the selection changes
    useEffect(() => {
        setConflictWarning(null);
    }, [guestRange.startDate, guestRange.endDate, selectedHours.length]);

    if (!isOpen || !spaceData) return null;

    const handleGuestSubmit = () => {
        if (!guestRange.startDate || !guestRange.endDate) {
            toast.error(
                dateSelectionMode === 'single'
                    ? 'Por favor selecciona el día de la reserva en el calendario.'
                    : 'Por favor selecciona la fecha de inicio y la fecha de fin.',
                { duration: 3000 }
            );
            return;
        }

        if (selectedHours.length === 0) {
            toast.error('Por favor selecciona al menos una hora.', { duration: 3000 });
            return;
        }

        if (guestAvailabilityLoading) {
            toast.error('Espera un momento mientras validamos la disponibilidad.', { duration: 3000 });
            return;
        }

        const endHour = parseInt(selectedHours[selectedHours.length - 1].split(':')[0], 10) + 1;
        const startTime = selectedHours[0];
        const endTime = `${endHour.toString().padStart(2, '0')}:00`;
        const rangeStart = buildDateTime(guestRange.startDate, startTime);
        const rangeEnd = buildDateTime(guestRange.endDate, endTime);

        if (!rangeStart || !rangeEnd || rangeEnd <= rangeStart) {
            toast.error('Por favor selecciona un horario válido.', { duration: 4000 });
            return;
        }

        if (rangeStart < new Date()) {
            toast.error('No se puede solicitar para una fecha u hora anterior a la actual.', { duration: 4000 });
            return;
        }

        const conflicts = getConflictDetails();
        if (conflicts.length > 0) {
            setConflictWarning({ conflicts });
            return;
        }

        proceedToQuote();
    };

    const liveConflicts = (
        !guestAvailabilityLoading &&
        guestRange.startDate && guestRange.endDate &&
        selectedHours.length > 0
    ) ? getConflictDetails() : null;

    // Instruction label for the calendar based on current mode and selection state
    const calendarInstruction = (() => {
        if (dateSelectionMode === 'single') {
            return guestRange.startDate
                ? 'Puedes hacer clic en otro día para cambiar la fecha.'
                : 'Haz clic en un día del calendario para seleccionarlo.';
        }
        if (!guestRange.startDate) return 'Haz clic en el día de inicio del evento.';
        if (!guestRange.endDate) return 'Ahora haz clic en el día de fin del evento.';
        return 'Puedes hacer clic para reiniciar la selección del rango.';
    })();

    const calendarInstructionDisplay = dateSelectionMode === 'range'
        ? (!guestRange.startDate
            ? 'Haz clic en el dia de inicio del evento.'
            : !guestRange.endDate
                ? 'Ahora haz clic en un dia posterior para definir el fin del evento.'
                : 'Puedes hacer clic en otro dia para reiniciar la seleccion del rango.')
        : calendarInstruction;

    const timeSlotHelperText = usesRequestFlow
        ? `Selecciona la fecha y hora de tu interes. En el siguiente paso podras ingresar tus datos de contacto para la ${requestFlowLabel.toLowerCase()}.`
        : 'Selecciona la fecha y hora de tu interes. Luego podras completar los datos de la reserva.';

    return createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Toaster />
            <div className="bg-white rounded-2xl p-6 lg:p-8 max-w-7xl w-full max-h-[95vh] flex flex-col shadow-2xl overflow-hidden">
                <div className="flex justify-between items-start mb-4 shrink-0">
                    <h2 className="text-2xl font-bold text-gray-800">{spaceData.tipo}: {spaceData.codigo}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
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

                <div className="border-b mb-6 shrink-0 flex gap-4 overflow-x-auto no-scrollbar">
                    <button
                        onClick={() => setActiveTab("info")}
                        className={`py-2 px-4 transition-colors whitespace-nowrap ${activeTab === "info"
                            ? "border-b-2 border-purple-600 font-bold text-purple-600"
                            : "text-gray-600 hover:text-gray-800 font-medium"
                            }`}
                    >
                        Información
                    </button>
                    <button
                        onClick={() => setActiveTab("availability")}
                        className={`py-2 px-4 transition-colors whitespace-nowrap ${activeTab === "availability"
                            ? "border-b-2 border-purple-600 font-bold text-purple-600"
                            : "text-gray-600 hover:text-gray-800 font-medium"
                            }`}
                    >
                        Disponibilidad
                    </button>
                    {usesRequestFlow && quoteData && (
                        <button
                            onClick={() => setActiveTab("quote")}
                            className={`py-2 px-4 transition-colors whitespace-nowrap ${activeTab === "quote"
                                ? "border-b-2 border-purple-600 font-bold text-purple-600"
                                : "text-gray-600 hover:text-gray-800 font-medium"
                                }`}
                        >
                            {requestFlowLabel}
                        </button>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pr-2 relative">
                    <div className={activeTab === "info" ? "block h-full" : "hidden"}>
                        <SpaceInformation spaceData={spaceData} onNext={() => setActiveTab("availability")} />
                    </div>

                    <div className={activeTab === "availability" ? "block h-full" : "hidden"}>

                        {/* ── Step 1: mode + date selection (only for request flow) ── */}
                        {usesRequestFlow && (
                            <div className="mb-5 bg-gray-50 border border-gray-100 rounded-2xl p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold shrink-0">1</span>
                                    <h3 className="text-sm font-bold text-gray-800">
                                        {dateSelectionMode === 'single' ? '¿Cuándo quieres reservar?' : '¿Qué periodo quieres reservar?'}
                                    </h3>
                                </div>

                                {/* Mode toggle */}
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('single')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${dateSelectionMode === 'single'
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'
                                            }`}
                                    >
                                        Un solo día
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleModeChange('range')}
                                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all border ${dateSelectionMode === 'range'
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                            : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300 hover:text-purple-700'
                                            }`}
                                    >
                                        Rango de fechas
                                    </button>
                                </div>

                                {/* Date summary cards */}
                                {dateSelectionMode === 'single' ? (
                                    <div className="bg-white border border-purple-100 rounded-xl px-4 py-2.5 flex items-center justify-between">
                                        <span className="text-xs font-bold text-purple-700 uppercase tracking-wide">Día seleccionado</span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {guestRange.startDate
                                                ? guestRange.startDate.toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
                                                : '—'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className={`rounded-xl px-3 py-2 border ${guestRange.startDate ? 'bg-purple-50 border-purple-200' : 'bg-white border-dashed border-gray-300'}`}>
                                            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Inicio</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {guestRange.startDate ? guestRange.startDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'}
                                            </p>
                                        </div>
                                        <div className={`rounded-xl px-3 py-2 border ${guestRange.endDate && !isSameCalendarDay(guestRange.startDate, guestRange.endDate) ? 'bg-purple-50 border-purple-200' : 'bg-white border-dashed border-gray-300'}`}>
                                            <p className="text-xs font-bold text-purple-700 uppercase tracking-wide">Fin</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">
                                                {guestRange.endDate && !isSameCalendarDay(guestRange.startDate, guestRange.endDate) ? guestRange.endDate.toLocaleDateString('es-CO', { weekday: 'short', day: 'numeric', month: 'short' }) : '—'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Contextual calendar instruction */}
                                <p className="text-xs text-gray-500 flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {calendarInstructionDisplay}
                                </p>
                            </div>
                        )}

                        {/* ── Calendar + Time/Form columns ── */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                            {/* Left: Calendar */}
                            <div className="flex flex-col">
                                <CalendarLegend />
                                <div className="flex-1 min-h-[350px]">
                                    <AvailabilityCalendar
                                        events={filteredEvents}
                                        date={selectedDate}
                                        onNavigate={handleNavigate}
                                        onSelectSlot={handleSlotSelect}
                                        dayPropGetter={dayPropGetter}
                                        slotPropGetter={slotPropGetter}
                                    />
                                </div>
                            </div>

                            {/* Right: Time selection + form */}
                            <div className="flex flex-col bg-gray-50/50 rounded-2xl p-4 md:p-6 border border-gray-100">
                                {/* Step label for request flow */}
                                {usesRequestFlow && (
                                    <div className="flex items-center gap-2 mb-3 shrink-0">
                                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold shrink-0">2</span>
                                        <h3 className="text-sm font-bold text-gray-800">Selecciona el horario</h3>
                                    </div>
                                )}

                                {/* Assembly-time notice */}
                                <div className="mb-4 bg-purple-50 text-purple-800 p-3.5 rounded-xl border border-purple-100/60 shadow-sm flex items-start gap-2 shrink-0">
                                    <svg className="w-5 h-5 shrink-0 mt-0.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-sm leading-relaxed">
                                        <strong>¡Ten en cuenta!</strong> Si tu espacio requiere tiempo de montaje previo, este <strong>debe estar incluido</strong> dentro de las horas que selecciones.
                                    </p>
                                </div>

                                {/* Time slot selector — same component for all flows */}
                                <TimeSlotSelector
                                    timeSlots={generateTimeSlots()}
                                    selectedHours={selectedHours}
                                    onTimeSelect={handleTimeSelect}
                                    isAvailable={usesRequestFlow ? isRequestTimeSlotAvailable : isTimeSlotAvailable}
                                    isCoworking={isCoworking}
                                    helperText={timeSlotHelperText}
                                />

                                {/* Availability status (request flow only) */}
                                {usesRequestFlow && (
                                    guestAvailabilityLoading ? (
                                        <p className="mb-3 text-sm text-purple-700 font-medium bg-purple-50 border border-purple-100 rounded-lg p-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Validando disponibilidad...
                                        </p>
                                    ) : liveConflicts !== null && liveConflicts.length === 0 ? (
                                        <div className="mb-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
                                            <svg className="w-4 h-4 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <p className="text-xs text-green-800 font-medium">
                                                El horario seleccionado está disponible para {dateSelectionMode === 'single' ? 'el día seleccionado' : 'todos los días del rango'}.
                                            </p>
                                        </div>
                                    ) : liveConflicts !== null && liveConflicts.length > 0 && !conflictWarning ? (
                                        <div className="mb-3">
                                            <ConflictWarningPanel
                                                conflicts={liveConflicts}
                                                isSingleDay={dateSelectionMode === 'single'}
                                                showActions={false}
                                            />
                                        </div>
                                    ) : null
                                )}

                                {/* Conflict confirmation panel (shown after submit attempt) */}
                                {conflictWarning && (
                                    <div className="mb-3">
                                        <ConflictWarningPanel
                                            conflicts={conflictWarning.conflicts}
                                            isSingleDay={dateSelectionMode === 'single'}
                                            showActions={true}
                                            onContinue={proceedToQuote}
                                            onBack={() => setConflictWarning(null)}
                                        />
                                    </div>
                                )}

                                <ReservationForm
                                    isCoworking={isCoworking}
                                    title={reservationTitle}
                                    setTitle={setReservationTitle}
                                    description={reservationDescription}
                                    setDescription={setReservationDescription}
                                    onSubmit={usesRequestFlow ? handleGuestSubmit : handleConfirmReservation}
                                    isGuestMode={usesRequestFlow}
                                    requestFlowLabel={requestFlowLabel}
                                    submitDisabled={!!conflictWarning}
                                />
                            </div>
                        </div>
                    </div>

                    {usesRequestFlow && quoteData && (
                        <div className={activeTab === "quote" ? "block h-full" : "hidden"}>
                            <QuoteForm
                                spaceData={spaceData}
                                quoteData={quoteData}
                                onBack={() => setActiveTab("availability")}
                                onSuccess={onClose}
                                requestMode={requestMode}
                            />
                        </div>
                    )}
                </div>
            </div>

            <LoadingSpinner loading={loadingAvailability || reservationLoading} />
        </div>,
        document.body
    );
};

export default ReservationModal;
