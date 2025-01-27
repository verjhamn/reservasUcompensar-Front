import axios from "axios";
import { getAuthToken } from "./authService";

export const createReservation = async (reservationData) => {
    try {
        const token = await getAuthToken();
        if (!token) {
            throw new Error('No se pudo obtener el token de autorización');
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const response = await axios.post(
            'https://backreservas.ucompensar.edu.co/api/reservas/crear',
            reservationData,
            config
        );

        if (response.data.status === "success") {
            return response.data;
        } else {
            throw new Error(response.data.message || 'Error al crear la reserva');
        }
    } catch (error) {
        console.error('Error en createReservation:', error.response || error);
        throw new Error(error.response?.data?.message || error.message || 'Error al crear la reserva');
    }
}; 