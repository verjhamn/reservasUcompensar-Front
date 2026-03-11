import React, { useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import { addHours, startOfDay, isBefore, format } from "date-fns";

import LoadingSpinner from '../UtilComponents/LoadingSpinner';
import { useAvailability } from "./hooks/useAvailability";
import { useReservation } from "./hooks/useReservation";

import SpaceInformation from "./components/SpaceInformation";
import AvailabilityCalendar from "./components/AvailabilityCalendar";
import CalendarLegend from "./components/CalendarLegend";
import TimeSlotSelector from "./components/TimeSlotSelector";
import ReservationForm from "./components/ReservationForm";
import QuoteForm from './components/QuoteForm';

// Helper function to calculate end time
const getEndTime = (lastSelectedHour) => {
    const hour = parseInt(lastSelectedHour.split(':')[0]);
    return `${(hour + 1).toString().padStart(2, '0')}:00`;
};

const ReservationModal = ({ isOpen, onClose, spaceData, goToMyReservations, isGuestMode, onQuoteRequest }) => {
    const [activeTab, setActiveTab] = useState("info");
    const [selectedHours, setSelectedHours] = useState([]);
    const [viewMode, setViewMode] = useState('reservation'); // 'reservation' or 'quote'
    const [quoteData, setQuoteData] = useState(null);

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

    if (!isOpen || !spaceData) return null;

    const handleGuestSubmit = () => {
        if (!selectedDate) {
            toast.error('Por favor seleccione una fecha', { duration: 3000 });
            return;
        }
        if (selectedHours.length === 0) {
            toast.error('Por favor seleccione al menos una hora', { duration: 3000 });
            return;
        }

        // Move to quote tab for Guest Users
        const sortedHours = [...selectedHours].sort();
        const data = {
            date: selectedDate,
            startTime: sortedHours[0],
            endTime: getEndTime(sortedHours[sortedHours.length - 1]),
            hours: sortedHours,
        };
        setQuoteData(data);
        setActiveTab("quote");
    };

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
                                    <TimeSlotSelector
                                        timeSlots={generateTimeSlots()}
                                        selectedHours={selectedHours}
                                        onTimeSelect={handleTimeSelect}
                                        isAvailable={isTimeSlotAvailable}
                                        isCoworking={isCoworking}
                                    />

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
