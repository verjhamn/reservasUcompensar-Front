import axios from "axios";
 
const API_BASE_URL = "https://backreservas.ucompensar.edu.co/api";
const API_BASE_URL_2 = "/api"

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
 
// Obtener el ID del usuario del localStorage
export const getUserId = () => {
    const userId = localStorage.getItem("userId");
    console.log("User ID retrieved:", userId); // Debug
    return userId;
};
 
// Guardar el ID del usuario en el localStorage
export const setUserId = (userId) => {
    localStorage.setItem("userId", userId);
    console.log("User ID guardado:", userId); // Debug
};
 
// Solicitar un nuevo token
export const fetchAuthToken = async () => {
    const data = {
        email: "afurianv@ucompensar.edu.co",
        password: "123456789",
    };
 
    try {
        console.log("Solicitando nuevo token..."); // Debug
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        const token = response.data.token;
        const userId = response.data.data.id;
        if (token && userId) {
            setAuthToken(token);
            setUserId(userId);
            console.log("Nuevo token y User ID recibidos y guardados:", token, userId); // Debug
            return token;
        } else {
            throw new Error("No se recibió un token o ID de usuario válido.");
        }
    } catch (error) {
        console.error("Error al obtener el token de autenticación:", error);
        throw error;
    }
};