import axios from "axios";

const API_BASE_URL = "https://qareservas.ucompensar.edu.co/api";

// Obtener el token del localStorage
export const getAuthToken = () => {
    const token = localStorage.getItem("authToken");
    console.log("Token retrieved:", token); // Debug
    return token;
};

// Guardar el token en el localStorage
export const setAuthToken = (token) => {
    localStorage.setItem("authToken", token);
    console.log("Token guardado:", token); // Debug
};

// Solicitar un nuevo token
export const fetchAuthToken = async () => {
    const data = {
        email: "jhmendezb@ucompensar.edu.co",
        password: "123456789",
    };

    try {
        console.log("Solicitando nuevo token..."); // Debug
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        const token = response.data.token;
        if (token) {
            setAuthToken(token);
            return token;
        } else {
            throw new Error("No se recibió un token válido.");
        }
    } catch (error) {
        console.error("Error al obtener el token de autenticación:", error);
        throw error;
    }
};
