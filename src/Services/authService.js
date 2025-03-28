import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Obtener y almacenar token e ID del usuario
export const getAuthToken = () => localStorage.getItem("authToken");
export const setAuthToken = (token) => localStorage.setItem("authToken", token);
export const getUserId = () => localStorage.getItem("userId");
export const setUserId = (userId) => localStorage.setItem("userId", userId);
export const clearAuth = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
};

// Obtener usuario desde localStorage
const getUserData = () => {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
};

// Solicitar un nuevo token o registrar al usuario si no está autenticado
export const fetchAuthToken = async () => {
    const userData = getUserData();

    if (!userData) {
        console.error("[authService] No hay datos de usuario en localStorage.");
        return null;
    }

    const loginData = {
        email: userData.mail,
        password: userData.id, // Usamos el ID de Microsoft como password
    };

    try {
        console.log("[authService] Intentando autenticación en el backend...");
        const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        const { token, data: { id: userId } } = response.data;

        if (token && userId) {
            setAuthToken(token);
            setUserId(userId);
            console.log("[authService] Nuevo token generado y guardado:", token);
            return token;
        } else {
            throw new Error("No se recibió un token o ID de usuario válido.");
        }
    } catch (error) {
        if (error.response?.data?.status === "No autorizado") {
            console.warn("[authService] Usuario no registrado, registrándolo...");

            try {
                const registerData = {
                    displayName: userData.displayName,
                    givenName: userData.givenName,
                    surname: userData.surname,
                    jobTitle: userData.jobTitle,
                    email: userData.mail,
                    id: userData.id,
                };

                const registerResponse = await axios.post(`${API_BASE_URL}/auth/register`, registerData);
                
                if (registerResponse.data.token) {
                    console.log("[authService] Usuario registrado exitosamente.");
                    setAuthToken(registerResponse.data.token);
                    setUserId(userData.id);
                    return registerResponse.data.token;
                }
            } catch (registerError) {
                console.error("[authService] Error al registrar usuario:", registerError.response?.data || registerError);
                return null;
            }
        } else {
            console.error("[authService] Error en la autenticación:", error.response?.data || error);
            return null;
        }
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
        console.log("[axiosInstance] Token no encontrado. Solicitando uno nuevo...");
        token = await fetchAuthToken();
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Interceptor para renovar token si expira
axiosInstance.interceptors.response.use(
    response => response,
    async (error) => {
        if (error.response?.status === 401) {
            console.warn("[axiosInstance] Token expirado. Intentando renovar...");

            try {
                const newToken = await fetchAuthToken();
                if (newToken) {
                    error.config.headers.Authorization = `Bearer ${newToken}`;
                    return axiosInstance.request(error.config);
                }
            } catch (refreshError) {
                console.error("[axiosInstance] No se pudo renovar el token:", refreshError);
                clearAuth();
                throw refreshError;
            }
        }
        return Promise.reject(error);
    }
);
