import axios from "axios";

const API_BASE_URL = "https://backreservas.ucompensar.edu.co/api";
const API_BASE_URL_2 = "https://qareservas.ucompensar.edu.co/api";

// Obtener el token del localStorage
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Guardar el token en el localStorage
export const setAuthToken = (token) => {
    localStorage.setItem("authToken", token);
};

// Obtener el ID del usuario del localStorage
export const getUserId = () => {
    return localStorage.getItem("userId");
};

// Guardar el ID del usuario en el localStorage
export const setUserId = (userId) => {
    localStorage.setItem("userId", userId);
};

// Eliminar token e ID de usuario (Logout / Expiración)
export const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
};

// Solicitar un nuevo token
export const fetchAuthToken = async () => {
    const data = {
        email: "afurianv@ucompensar.edu.co",
        password: "123456789",
    };

    try {
        console.log("Solicitando nuevo token...");
        const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
        const { token, data: { id: userId } } = response.data;

        if (token && userId) {
            setAuthToken(token);
            setUserId(userId);
            console.log("Nuevo token generado y guardado:", token);
            return token;
        } else {
            throw new Error("No se recibió un token o ID de usuario válido.");
        }
    } catch (error) {
        console.error("Error al obtener el token:", error.response?.data || error.message);
        throw error;
    }
};

// Middleware para validar token en cada petición
export const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: { "Content-Type": "application/json", Accept: "application/json" }
});

// Interceptor para manejar tokens caducados
axiosInstance.interceptors.request.use(async (config) => {
    let token = getAuthToken();

    if (!token) {
        console.log("Token no encontrado. Solicitando uno nuevo...");
        token = await fetchAuthToken();
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.log("Token expirado. Intentando renovar...");

            try {
                const newToken = await fetchAuthToken();
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance.request(error.config);
            } catch (refreshError) {
                console.error("Error al renovar el token:", refreshError);
                clearAuth();
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);
