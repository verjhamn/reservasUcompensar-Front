import { useState, useEffect } from "react";
import { format, addHours, startOfDay, isBefore } from "date-fns";
import { getDisponibilidad, processOccupiedHours, getDisponibilidadMes } from "../../../Services/getDisponibilidadService";

export const useAvailability = (spaceData) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [monthAvailability, setMonthAvailability] = useState({});
    const [reservedHours, setReservedHours] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [loadingAvailability, setLoadingAvailability] = useState(false);

    // Process events from spaceData
    useEffect(() => {
        if (spaceData && spaceData.reservas) {
            const eventsForSpace = spaceData.reservas.map(reserva => ({
                id: reserva.id,
                title: reserva.titulo,
                start: new Date(reserva.inicio.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
                end: new Date(reserva.fin.replace(/(\d{2})\/(\d{2})\/(\d{4}) (\d{2}:\d{2})/, '$3-$2-$1 $4')),
                desc: `Reservado por: ${reserva.usuario.nombre}`,
                usuario: reserva.usuario,
                estado: reserva.estado
            }));
            setFilteredEvents(eventsForSpace);
        }
    }, [spaceData]);

    // Fetch month availability
    useEffect(() => {
        const fetchMonthAvailability = async () => {
            if (selectedDate && spaceData?.id) {
                setLoadingAvailability(true);
                try {
                    const month = selectedDate.getMonth() + 1;
                    const year = selectedDate.getFullYear();

                    const disponibilidadMes = await getDisponibilidadMes(spaceData.id, month, year);

                    const availabilityData = {};

                    const daysInMonth = new Date(year, month, 0).getDate();
                    for (let day = 1; day <= daysInMonth; day++) {
                        const currentDate = new Date(year, month - 1, day);
                        const dateKey = format(currentDate, "yyyy-MM-dd");

                        const dayReservas = disponibilidadMes.reservas.filter(reserva => {
                            const reservaDate = new Date(reserva.hora_inicio);
                            return format(reservaDate, "yyyy-MM-dd") === dateKey;
                        });

                        const horasOcupadas = new Set();
                        dayReservas.forEach(reserva => {
                            if (reserva.estado !== "Completada" && reserva.estado !== "Cancelada") {
                                const inicio = new Date(reserva.hora_inicio);
                                const fin = new Date(reserva.hora_fin);

                                let horaActual = new Date(inicio);
                                while (horaActual < fin) {
                                    horasOcupadas.add(format(horaActual, "HH:00"));
                                    horaActual = addHours(horaActual, 1);
                                }
                            }
                        });

                        availabilityData[dateKey] = Array.from(horasOcupadas).sort();
                    }

                    setMonthAvailability(availabilityData);
                } catch (error) {
                    console.error("Error al cargar disponibilidad del mes:", error);
                } finally {
                    setLoadingAvailability(false);
                }
            }
        };

        fetchMonthAvailability();
    }, [spaceData?.id, selectedDate.getMonth(), selectedDate.getFullYear()]);

    // Fetch day availability
    useEffect(() => {
        const fetchDisponibilidad = async () => {
            if (selectedDate && spaceData?.id) {
                try {
                    const formattedDate = format(selectedDate, "dd/MM/yyyy");
                    const disponibilidad = await getDisponibilidad(spaceData.id, formattedDate);
                    const horasArray = processOccupiedHours(disponibilidad, selectedDate);
                    setReservedHours(horasArray);
                } catch (error) {
                    console.error("Error al obtener disponibilidad:", error);
                }
            }
        };

        fetchDisponibilidad();
    }, [selectedDate, spaceData?.id]);

    const generateTimeSlots = () => {
        const slots = [];
        for (let hour = 7; hour <= 21; hour++) {
            const timeSlot = `${hour.toString().padStart(2, '0')}:00`;
            slots.push(timeSlot);
        }
        return slots;
    };

    const hasAvailabilityForDate = (date) => {
        if (isBefore(startOfDay(date), startOfDay(new Date()))) {
            return false;
        }

        const dateKey = format(date, "yyyy-MM-dd");
        const dayReservedHours = monthAvailability[dateKey] || reservedHours;

        if (dayReservedHours.length === 0) {
            return true;
        }

        const timeSlots = generateTimeSlots();
        return timeSlots.some(timeSlot => !dayReservedHours.includes(timeSlot));
    };

    const isTimeSlotAvailable = (timeSlot) => {
        return !reservedHours.includes(timeSlot);
    };

    return {
        selectedDate,
        setSelectedDate,
        monthAvailability,
        reservedHours,
        filteredEvents,
        hasAvailabilityForDate,
        isTimeSlotAvailable,
        loadingAvailability,
        generateTimeSlots
    };
};
