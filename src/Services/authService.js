import axios from "axios";
import { STORAGE_KEYS, EVENTS } from "../config/events";

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Obtener y almacenar token e ID del usuario
export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
export const setAuthToken = (token) => localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
export const getUserId = () => localStorage.getItem(STORAGE_KEYS.USER_ID);
export const setUserId = (userId) => localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
export const getUserRoles = () => {
    const roles = localStorage.getItem(STORAGE_KEYS.USER_ROLES);
    
    if (!roles) return [];
    
    try {
        let parsedRoles = JSON.parse(roles);
        
        // Si el resultado es un string, parsearlo de nuevo (doble serialización)
        if (typeof parsedRoles === 'string') {
            parsedRoles = JSON.parse(parsedRoles);
        }
        
        return Array.isArray(parsedRoles) ? parsedRoles : [];
    } catch (error) {
        console.error("Error parsing user roles:", error);
        return [];
    }
};
export const setUserRoles = (roles) => {
    localStorage.setItem(STORAGE_KEYS.USER_ROLES, JSON.stringify(roles));
    
    // Disparar evento personalizado para notificar que los roles cambiaron
    window.dispatchEvent(new CustomEvent(EVENTS.USER_ROLES_UPDATED, { detail: roles }));
};
export const clearAuth = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_ROLES);
};

// Obtener usuario desde localStorage
const getUserData = () => {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
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
        const response = await axios.post(`${API_BASE_URL}/auth/login`, loginData);
        const { token, data, roles: roleNames } = response.data;
        const userId = data?.id;
        const userRoles = data?.roles;

        if (token && userId) {
            setAuthToken(token);
            setUserId(userId);
            
            // Guardar roles del backend - usar data.roles que contiene los objetos completos
            if (userRoles && Array.isArray(userRoles)) {
                setUserRoles(userRoles);
            } else {
                // Si no hay roles en data.roles, verificar si hay roles en el nivel superior
                if (roleNames && Array.isArray(roleNames)) {
                    // Convertir nombres de roles a objetos con id
                    const roleObjects = roleNames.map(name => {
                        let id = null;
                        switch(name) {
                            case 'Superadministrador':
                                id = 1;
                                break;
                            case 'Administrador':
                                id = 2;
                                break;
                            case 'Reportes':
                                id = 3;
                                break;
                            default:
                                id = null;
                        }
                        return { id, name };
                    }).filter(role => role.id !== null);
                    
                    if (roleObjects.length > 0) {
                        setUserRoles(roleObjects);
                    }
                }
            }
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
                    // Guardar roles del registro (por defecto será usuario estándar)
                    if (registerResponse.data.roles && Array.isArray(registerResponse.data.roles)) {
                        setUserRoles(registerResponse.data.roles);
                        console.log("[authService] Roles guardados en registro:", registerResponse.data.roles);
                    } else {
                        // Si no hay roles, establecer como usuario estándar
                        setUserRoles([]);
                    }
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
