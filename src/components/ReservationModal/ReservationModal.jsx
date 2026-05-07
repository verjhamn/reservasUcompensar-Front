import React, { useEffect, useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { addHours, startOfDay, isBefore, format } from "date-fns";

import LoadingSpinner from '../UtilComponents/LoadingSpinner';
import { useAvailability } from "./hooks/useAvailability";
import { useReservation } from "./hooks/useReservation";
import { getDisponibilidad, processOccupiedHours } from "../../Services/getDisponibilidadService";

import SpaceInformation from "./components/SpaceInformation";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import CalendarLegend from "./components/CalendarLegend";
import TimeSlotSelector from "./components/TimeSlotSelector";
import ReservationForm from "./components/ReservationForm";
import QuoteForm from './components/QuoteForm';

const ReservationModal = ({ isOpen, onClose, spaceData, goToMyReservations, isGuestMode, onQuoteRequest }) => {
    const [activeTab, setActiveTab] = useState("info");
    const [selectedHours, setSelectedHours] = useState([]);
    const [viewMode, setViewMode] = useState('reservation'); // 'reservation' or 'quote'
    const [quoteData, setQuoteData] = useState(null);
    const [guestRange, setGuestRange] = useState({
        startDate: null,
        endDate: null,
        startTime: '',
        endTime: ''
    });
    const [guestAvailabilityByDate, setGuestAvailabilityByDate] = useState({});
    const [guestAvailabilityLoading, setGuestAvailabilityLoading] = useState(false);

    const isCoworking = spaceData?.coworking_contenedor === "SI";

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

        if (isGuestMode) {
            if (!hasAvailabilityForDate(selectedStart)) {
                toast.error('Este día no tiene disponibilidad. Por favor seleccione otro día.', {
                    duration: 4000,
                    position: 'top-right',
                    style: { background: '#fee2e2', color: '#dc2626' },
                });
                return;
            }

            setSelectedDate(selectedStart);
            setGuestRange(prev => {
                if (!prev.startDate || prev.endDate || isBefore(selectedStart, prev.startDate)) {
                    return { ...prev, startDate: selectedStart, endDate: null };
                }

                return { ...prev, endDate: selectedStart };
            });
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
            const sortedHours = selectedHours.map(h => parseInt(h.split(':')[0])).sort();
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
                    const prevHour = sortedHours.find(h => h < timeValue);
                    if (prevHour) {
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
        const allHours = [...currentHours, timeValue].sort();
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

        if (isGuestMode) {
            const day = startOfDay(date);
            const start = guestRange.startDate ? startOfDay(guestRange.startDate) : null;
            const end = guestRange.endDate ? startOfDay(guestRange.endDate) : null;
            const isStart = isSameCalendarDay(day, start);
            const isEnd = isSameCalendarDay(day, end);
            const isBetween = start && end && day > start && day < end;

            if (isBetween && !hasAvailabilityForDate(date)) {
                return {
                    style: {
                        backgroundColor: "#ffebee",
                        color: "#d32f2f",
                        border: "2px solid #f44336",
                        borderRadius: "4px",
                        fontWeight: "bold",
                    },
                    className: "rbc-day-no-availability",
                };
            }

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
                        backgroundColor: "#f3e8ff",
                        color: "#581c87",
                        borderRadius: "4px",
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

        if (format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd")) {
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

    const isActiveReservationEvent = (event) => {
        const estado = event?.estado?.toLowerCase?.() || '';
        return estado !== 'completada' && estado !== 'cancelada';
    };

    const hasReservationOverlap = (rangeStart, rangeEnd) => {
        return filteredEvents.some(event => (
            isActiveReservationEvent(event) &&
            rangeStart < event.end &&
            rangeEnd > event.start
        ));
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

    const isHourAvailableOnDate = (date, time) => {
        if (!date || !time) return true;
        return !getReservedHoursForDate(date).includes(time);
    };

    const isRangeHourReserved = (date, time) => {
        if (!date || !time) return false;
        const rangeEnd = addHours(buildDateTime(date, time), 1);
        const rangeStart = buildDateTime(date, time);
        return filteredEvents.some(event => (
            isActiveReservationEvent(event) &&
            rangeStart < event.end &&
            rangeEnd > event.start
        ));
    };

    const timeOptions = generateTimeSlots();
    const endTimeOptions = [...timeOptions.slice(1), '22:00'];

    const getPreviousSlotFromEndTime = (time) => {
        const hour = parseInt(time.split(':')[0], 10) - 1;
        return `${hour.toString().padStart(2, '0')}:00`;
    };

    const isStartTimeChoiceAvailable = (time) => {
        if (!guestRange.startDate || !time) return true;
        if (!isHourAvailableOnDate(guestRange.startDate, time)) return false;
        if (isRangeHourReserved(guestRange.startDate, time)) return false;

        if (guestRange.endDate && guestRange.endTime && isSameCalendarDay(guestRange.startDate, guestRange.endDate)) {
            return buildDateTime(guestRange.startDate, time) < buildDateTime(guestRange.endDate, guestRange.endTime);
        }

        return true;
    };

    const isEndTimeChoiceAvailable = (time) => {
        if (!guestRange.endDate || !time) return true;

        const previousSlot = getPreviousSlotFromEndTime(time);
        if (!isHourAvailableOnDate(guestRange.endDate, previousSlot)) return false;
        if (isRangeHourReserved(guestRange.endDate, previousSlot)) return false;

        if (guestRange.startDate && guestRange.startTime && isSameCalendarDay(guestRange.startDate, guestRange.endDate)) {
            return buildDateTime(guestRange.endDate, time) > buildDateTime(guestRange.startDate, guestRange.startTime);
        }

        return true;
    };

    const getRangeOccupiedSummary = () => {
        if (!guestRange.startDate || !guestRange.endDate) return [];
        const rangeStart = buildDateTime(guestRange.startDate, guestRange.startTime);
        const rangeEnd = buildDateTime(guestRange.endDate, guestRange.endTime);
        const shouldFilterBySelectedTime = rangeStart && rangeEnd && rangeEnd > rangeStart;

        return getDatesInRange(guestRange.startDate, guestRange.endDate)
            .map(date => ({
                date,
                hours: getReservedHoursForDate(date).filter(time => {
                    if (!shouldFilterBySelectedTime) return true;

                    const slotStart = buildDateTime(date, time);
                    const slotEnd = addHours(slotStart, 1);
                    return slotStart < rangeEnd && slotEnd > rangeStart;
                })
            }))
            .filter(day => day.hours.length > 0);
    };

    const hasAvailabilityOverlap = (rangeStart, rangeEnd) => {
        return getDatesInRange(rangeStart, rangeEnd).some(date => (
            getReservedHoursForDate(date).some(time => {
                const slotStart = buildDateTime(date, time);
                const slotEnd = addHours(slotStart, 1);
                return slotStart < rangeEnd && slotEnd > rangeStart;
            })
        ));
    };

    useEffect(() => {
        const fetchGuestAvailability = async () => {
            if (!isGuestMode || !spaceData?.id) return;

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
                console.error("Error al cargar disponibilidad del rango externo:", error);
                toast.error('No se pudo validar la disponibilidad del rango seleccionado.');
            } finally {
                setGuestAvailabilityLoading(false);
            }
        };

        fetchGuestAvailability();
    }, [isGuestMode, spaceData?.id, guestRange.startDate, guestRange.endDate]);

    if (!isOpen || !spaceData) return null;

    const handleGuestSubmit = () => {
        if (!guestRange.startDate || !guestRange.endDate) {
            toast.error('Por favor seleccione la fecha de inicio y la fecha de fin', { duration: 3000 });
            return;
        }

        if (!guestRange.startTime || !guestRange.endTime) {
            toast.error('Por favor seleccione la hora de inicio y la hora de fin', { duration: 3000 });
            return;
        }

        if (guestAvailabilityLoading) {
            toast.error('Espera un momento mientras validamos la disponibilidad del rango.', { duration: 3000 });
            return;
        }

        if (!isStartTimeChoiceAvailable(guestRange.startTime)) {
            toast.error('La hora de inicio seleccionada no está disponible.', { duration: 4000 });
            return;
        }

        if (!isEndTimeChoiceAvailable(guestRange.endTime)) {
            toast.error('La hora de fin seleccionada no está disponible.', { duration: 4000 });
            return;
        }

        const rangeStart = buildDateTime(guestRange.startDate, guestRange.startTime);
        const rangeEnd = buildDateTime(guestRange.endDate, guestRange.endTime);

        if (!rangeStart || !rangeEnd || rangeEnd <= rangeStart) {
            toast.error('La fecha y hora de fin deben ser posteriores al inicio.', { duration: 4000 });
            return;
        }

        if (rangeStart < new Date()) {
            toast.error('No se puede solicitar una cotizaciÃ³n para una fecha u hora anterior a la actual.', { duration: 4000 });
            return;
        }

        if (hasReservationOverlap(rangeStart, rangeEnd)) {
            toast.error('El rango seleccionado se cruza con una reserva existente. Por favor ajusta fechas u horarios.', { duration: 5000 });
            return;
        }

        if (hasAvailabilityOverlap(rangeStart, rangeEnd)) {
            toast.error('El rango seleccionado contiene horas ocupadas. Por favor ajusta fechas u horarios.', { duration: 5000 });
            return;
        }

        const data = {
            date: guestRange.startDate,
            startDate: guestRange.startDate,
            endDate: guestRange.endDate,
            startTime: guestRange.startTime,
            endTime: guestRange.endTime,
            hours: [],
        };
        setQuoteData(data);
        setActiveTab("quote");
    };

    const rangeOccupiedSummary = getRangeOccupiedSummary();

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Toaster />
            {viewMode === 'reservation' && (
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
                        {isGuestMode && quoteData && (
                            <button
                                onClick={() => setActiveTab("quote")}
                                className={`py-2 px-4 transition-colors whitespace-nowrap ${activeTab === "quote"
                                    ? "border-b-2 border-purple-600 font-bold text-purple-600"
                                    : "text-gray-600 hover:text-gray-800 font-medium"
                                    }`}
                            >
                                Cotización
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto no-scrollbar pb-4 pr-2 relative">
                        <div className={activeTab === "info" ? "block h-full" : "hidden"}>
                            <SpaceInformation spaceData={spaceData} onNext={() => setActiveTab("availability")} />
                        </div>

                        <div className={activeTab === "availability" ? "block h-full" : "hidden"}>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 h-full">
                                {/* Columna Izquierda: Calendario */}
                                <div className="flex flex-col h-full">
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

                                {/* Columna Derecha: Horas y Formulario */}
                                <div className="flex flex-col h-full bg-gray-50/50 rounded-2xl p-4 md:p-6 border border-gray-100">
                                    <div className="mb-4 bg-purple-50 text-purple-800 p-3.5 rounded-xl border border-purple-100/60 shadow-sm flex items-start gap-2 shrink-0">
                                        <svg className="w-5 h-5 shrink-0 mt-0.5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <p className="text-sm leading-relaxed">
                                            <strong>¡Ten en cuenta!</strong> Si tu espacio requiere tiempo de montaje previo, este <strong>debe estar incluido</strong> dentro de las horas que selecciones para tu reserva.
                                        </p>
                                    </div>
                                    {isGuestMode ? (
                                        <div className="bg-transparent mb-4 space-y-4">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-800">Seleccionar rango del evento</h3>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    Haz clic en el calendario para elegir la fecha de inicio y luego la fecha de fin.
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
                                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Fecha inicio</p>
                                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                                        {guestRange.startDate ? guestRange.startDate.toLocaleDateString() : 'Sin seleccionar'}
                                                    </p>
                                                </div>
                                                <div className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm">
                                                    <p className="text-xs font-bold text-purple-800 uppercase tracking-wide">Fecha fin</p>
                                                    <p className="text-sm font-semibold text-gray-800 mt-1">
                                                        {guestRange.endDate ? guestRange.endDate.toLocaleDateString() : 'Sin seleccionar'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                                                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Hora inicio</p>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                        {timeOptions.map((time) => {
                                                            const available = isStartTimeChoiceAvailable(time);
                                                            const selected = guestRange.startTime === time;
                                                            return (
                                                                <button
                                                                    key={`start-${time}`}
                                                                    type="button"
                                                                    disabled={!guestRange.startDate || !available}
                                                                    onClick={() => setGuestRange(prev => ({ ...prev, startTime: time }))}
                                                                    className={`p-2 rounded-md text-xs font-semibold transition-all border ${selected
                                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                                        : available && guestRange.startDate
                                                                            ? 'bg-white text-gray-800 border-purple-300 hover:bg-purple-50'
                                                                            : 'bg-gray-200 text-gray-500 border-gray-300 line-through cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>

                                                <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                                                    <p className="text-sm font-semibold text-gray-700 mb-2">Hora fin</p>
                                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                                                        {endTimeOptions.map((time) => {
                                                            const available = isEndTimeChoiceAvailable(time);
                                                            const selected = guestRange.endTime === time;
                                                            return (
                                                                <button
                                                                    key={`end-${time}`}
                                                                    type="button"
                                                                    disabled={!guestRange.endDate || !available}
                                                                    onClick={() => setGuestRange(prev => ({ ...prev, endTime: time }))}
                                                                    className={`p-2 rounded-md text-xs font-semibold transition-all border ${selected
                                                                        ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                                                                        : available && guestRange.endDate
                                                                            ? 'bg-white text-gray-800 border-purple-300 hover:bg-purple-50'
                                                                            : 'bg-gray-200 text-gray-500 border-gray-300 line-through cursor-not-allowed'
                                                                        }`}
                                                                >
                                                                    {time}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm text-xs">
                                                <div className="flex flex-wrap gap-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-purple-600 rounded"></span>
                                                        <span className="font-semibold text-gray-700">Seleccionada</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-white border-2 border-purple-300 rounded"></span>
                                                        <span className="font-semibold text-gray-700">Disponible</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="w-4 h-4 bg-gray-200 border border-gray-300 rounded"></span>
                                                        <span className="font-semibold text-gray-500">Ocupada</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {guestAvailabilityLoading && (
                                                <p className="text-sm text-purple-700 font-medium bg-purple-50 border border-purple-100 rounded-lg p-3">
                                                    Validando disponibilidad del rango...
                                                </p>
                                            )}

                                            {rangeOccupiedSummary.length > 0 && (
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                                                    <p className="text-sm font-bold text-amber-800 mb-2">Horas ocupadas en el rango</p>
                                                    <div className="space-y-1.5 max-h-24 overflow-y-auto custom-scrollbar">
                                                        {rangeOccupiedSummary.map(day => (
                                                            <p key={getDateKey(day.date)} className="text-xs text-amber-800">
                                                                <span className="font-semibold">{day.date.toLocaleDateString()}:</span> {day.hours.join(', ')}
                                                            </p>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <TimeSlotSelector
                                            timeSlots={generateTimeSlots()}
                                            selectedHours={selectedHours}
                                            onTimeSelect={handleTimeSelect}
                                            isAvailable={isTimeSlotAvailable}
                                            isCoworking={isCoworking}
                                        />
                                    )}

                                    <ReservationForm
                                        isCoworking={isCoworking}
                                        title={reservationTitle}
                                        setTitle={setReservationTitle}
                                        description={reservationDescription}
                                        setDescription={setReservationDescription}
                                        onSubmit={isGuestMode ? handleGuestSubmit : handleConfirmReservation}
                                        isGuestMode={isGuestMode}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Solo destruimos el QuoteForm si literalmente dejaron de existir los Guest/Quote properties */}
                        {isGuestMode && quoteData && (
                            <div className={activeTab === "quote" ? "block h-full" : "hidden"}>
                                <QuoteForm
                                    spaceData={spaceData}
                                    quoteData={quoteData}
                                    onBack={() => setActiveTab("availability")}
                                    onSuccess={onClose}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            <LoadingSpinner loading={loadingAvailability || reservationLoading} />
        </div >
    );
};

export default ReservationModal;
