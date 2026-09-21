import { useState, useEffect, useCallback } from "react";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Services/SSOServices/authConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { hasAdminAccess, canAccessReports } from './utils/userHelper';
import { EVENTS, STORAGE_KEYS } from './config/events';
import roleSyncService from './Services/roleSyncService';
import AppRoutes from './components/AppRoutes';
import { EventType } from "@azure/msal-browser";
import { getUserData } from "./Services/SSOServices/graphService";
import { fetchAuthToken, getUserId } from "./Services/authService";
import { clearAuthFlowState } from "./Services/SSOServices/loginFlowService";
import { ensureLocalAuthBypassSession, isLocalAuthBypassEnabled } from "#local-auth";

const msalInstance = new PublicClientApplication(msalConfig);
const AUTH_BOOTSTRAP_TIMEOUT_MS = 4000;

const hasStoredUserSession = () => {
    if (typeof window === "undefined") return false;

    try {
        ensureLocalAuthBypassSession();
        const storedUser = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return !!storedUser && storedUser !== "null";
    } catch (error) {
        console.error("Error leyendo la sesion almacenada:", error);
        return false;
    }
};

const getStoredAuthState = () => {
    const hasSession = hasStoredUserSession();

    return {
        isLoggedIn: hasSession,
        isAdmin: hasSession ? hasAdminAccess() : false,
        canViewReports: hasSession ? canAccessReports() : false,
    };
};

const waitWithTimeout = (promise, timeoutMs) => (
    Promise.race([
        promise,
        new Promise((resolve) => setTimeout(resolve, timeoutMs)),
    ])
);

function App() {
    const [authState, setAuthState] = useState(getStoredAuthState);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const { isLoggedIn, isAdmin, canViewReports } = authState;

    const refreshAuthState = useCallback(() => {
        const nextAuthState = getStoredAuthState();
        setAuthState(nextAuthState);
        return nextAuthState;
    }, []);

    // Hidratar la sesion antes de montar rutas para evitar redirects prematuros.
    useEffect(() => {
        let isMounted = true;

        const hydrateInitialAuthState = async () => {
            const storedAuthState = getStoredAuthState();

            if (isMounted) {
                setAuthState(storedAuthState);
            }

            if (storedAuthState.isLoggedIn && !isLocalAuthBypassEnabled()) {
                const hasUserId = !!getUserId();
                const hasCachedRoles = localStorage.getItem(STORAGE_KEYS.USER_ROLES) !== null;

                if (!hasUserId || !hasCachedRoles) {
                    try {
                        await waitWithTimeout(fetchAuthToken(), AUTH_BOOTSTRAP_TIMEOUT_MS);
                    } catch (error) {
                        console.error("Error hidratando la sesion inicial:", error);
                    }
                }
            }

            if (isMounted) {
                refreshAuthState();
                setIsAuthReady(true);
            }
        };

        hydrateInitialAuthState();

        return () => {
            isMounted = false;
        };
    }, [refreshAuthState]);

    // Iniciar/detener sincronización de roles según el estado de login
    useEffect(() => {
        if (isLocalAuthBypassEnabled()) {
            roleSyncService.stopAutoSync();
            return;
        }

        if (isLoggedIn) {
            roleSyncService.startAutoSync();
        } else {
            roleSyncService.stopAutoSync();
        }

        // Cleanup al desmontar componente
        return () => {
            roleSyncService.stopAutoSync();
        };
    }, [isLoggedIn]);

    useEffect(() => {
        if (isAuthReady) {
            refreshAuthState();
        }
    }, [isLoggedIn, isAuthReady, refreshAuthState]);

    // Escuchar cambios en los roles del usuario
    useEffect(() => {
        const handleRolesUpdate = () => {
            refreshAuthState();
        };

        window.addEventListener(EVENTS.USER_ROLES_UPDATED, handleRolesUpdate);

        return () => {
            window.removeEventListener(EVENTS.USER_ROLES_UPDATED, handleRolesUpdate);
        };
    }, [refreshAuthState]);

    // Escuchar el éxito de login a nivel global (útil para redirects móviles y LandingView)
    useEffect(() => {
        const callbackId = msalInstance.addEventCallback(async (message) => {
            if (message.eventType === EventType.LOGIN_SUCCESS && message.payload) {
                const payload = message.payload;
                const accessToken = payload.accessToken;
                
                try {
                    // Marcar sesión como activa de inmediato al volver del redirect.
                    setAuthState((currentState) => ({ ...currentState, isLoggedIn: true }));

                    const currentData = localStorage.getItem("userData");
                    let hasValidUserData = !!currentData && currentData !== "null";

                    if (!hasValidUserData) {
                        console.log("Global login success intercepted. Fetching user and roles...");
                        const userData = await getUserData(accessToken);
                        localStorage.setItem("userData", JSON.stringify(userData));
                        hasValidUserData = true;
                        
                        // Disparar evento para que Header.jsx actualice el `user`
                        window.dispatchEvent(new Event("storage"));
                    }

                    // Si falta userId de backend, terminar hidratación de sesión interna.
                    if (hasValidUserData && !getUserId()) {
                        await fetchAuthToken();
                    }

                    refreshAuthState();
                    setIsAuthReady(true);
                } catch (error) {
                    console.error("Error manejando el login global:", error);
                } finally {
                    clearAuthFlowState();
                }
            }

            if (message.eventType === EventType.LOGIN_FAILURE) {
                clearAuthFlowState();
            }
        });

        return () => {
            if (callbackId) {
                msalInstance.removeEventCallback(callbackId);
            }
        };
    }, [refreshAuthState]);

    const handleLogout = () => {
        setAuthState({
            isLoggedIn: false,
            isAdmin: false,
            canViewReports: false,
        });
        setIsAuthReady(true);
    };

    return (
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                    <Header
                        onLogout={handleLogout}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        canViewReports={canViewReports}
                        useRouter={true}
                    />
                    <main className="flex-grow bg-gray-100">
                        {isAuthReady ? (
                            <AppRoutes
                                isLoggedIn={isLoggedIn}
                                isAdmin={isAdmin}
                                canViewReports={canViewReports}
                            />
                        ) : (
                            <div className="flex min-h-[calc(100vh-200px)] items-center justify-center">
                                <div className="h-10 w-10 animate-spin rounded-full border-4 border-purple-100 border-t-purple-600" />
                            </div>
                        )}
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </MsalProvider>
    );
}

export default App;
