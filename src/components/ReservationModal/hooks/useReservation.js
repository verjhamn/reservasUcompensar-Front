import { useState } from "react";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { createReservation } from "../../../Services/createReservationService";
import { getUserId } from "../../../Services/authService";
import { canReserveAnySpace } from "../../../utils/userHelper";

export const useReservation = ({
    spaceData,
    selectedDate,
    selectedHours,
    onClose,
    goToMyReservations,
    isCoworking
}) => {
    const [reservationTitle, setReservationTitle] = useState("");
    const [reservationDescription, setReservationDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleConfirmReservation = async () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const isAdmin = canReserveAnySpace(userData?.mail);

        if (!isAdmin && spaceData.coworking_contenedor !== "SI") {
            toast.error(
                'Por favor, para reservar este espacio escribir al correo reservas.campus@ucompensar.edu.co',
                {
                    duration: 5000,
                    position: 'top-right',
                }
            );
            return;
        }

        setLoading(true);
        try {
            if (!isCoworking) {
                if (!reservationTitle.trim()) {
                    toast.error('Por favor ingrese un título para la reserva', {
                        duration: 4000,
                        position: 'top-right',
                    });
                    setLoading(false);
                    return;
                }

                if (!reservationDescription.trim()) {
                    toast.error('Por favor ingrese una descripción para la reserva', {
                        duration: 4000,
                        position: 'top-right',
                    });
                    setLoading(false);
                    return;
                }
            }

            let startDateTime, endDateTime;

            if (!selectedHours.length) {
                toast.error('Por favor seleccione al menos una hora', {
                    duration: 4000,
                    position: 'top-right',
                });
                setLoading(false);
                return;
            }

            startDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedHours[0]}`);
            endDateTime = new Date(`${format(selectedDate, "yyyy-MM-dd")}T${selectedHours[selectedHours.length - 1]}`);
            endDateTime.setHours(endDateTime.getHours() + 1);

            const formattedDate = format(selectedDate, "dd/MM/yyyy");
            const formattedStartTime = format(startDateTime, "HH:mm");
            const formattedEndTime = format(endDateTime, "HH:mm");

            const reservationData = {
                espacio_id: spaceData.id,
                espacio_type: spaceData.coworking_contenedor === "SI"
                    ? "App\\Models\\basics\\EspacioCoworking"
                    : "App\\Models\\basics\\Espacio",
                user_id: getUserId() || "3816a79a-78e1-4dc1-ae3b-3c5e4533ff8f",
                titulo: isCoworking ? `Reserva ${spaceData.codigo} - ${formattedDate}` : reservationTitle,
                descripcion: isCoworking ? "" : reservationDescription,
                fecha_reserva: formattedDate,
                hora_inicio: formattedStartTime,
                hora_fin: formattedEndTime,
                observaciones: isCoworking ? reservationDescription : ""
            };

            try {
                const response = await createReservation(reservationData);

                if (response.status === "success") {
                    toast.success(
                        `Reserva confirmada con éxito para el día ${formattedDate} de ${formattedStartTime} a ${formattedEndTime}`,
                        {
                            duration: 4000,
                            position: 'top-right',
                            style: {
                                background: '#dcfce7',
                                color: '#16a34a',
                            },
                        }
                    );
                    onClose();
                    goToMyReservations();
                } else {
                    throw new Error(response.message || 'Error al crear la reserva');
                }
            } catch (error) {
                toast.error(
                    `Error al crear la reserva: ${error.message || 'Por favor, intente nuevamente.'}`,
                    {
                        duration: 4000,
                        position: 'top-right',
                        style: {
                            background: '#fee2e2',
                            color: '#dc2626',
                        },
                    }
                );
            }
        } catch (error) {
            toast.error('Error al confirmar la reserva', {
                duration: 4000,
                position: 'top-right',
            });
        } finally {
            setLoading(false);
        }
    };

    return {
        reservationTitle,
        setReservationTitle,
        reservationDescription,
        setReservationDescription,
        loading,
        handleConfirmReservation
    };
};
