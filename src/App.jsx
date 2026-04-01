import React, { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { MsalProvider } from "@azure/msal-react";
import { PublicClientApplication } from "@azure/msal-browser";
import { msalConfig } from "./Services/SSOServices/authConfig";
import Header from "./components/Header";
import Footer from "./components/Footer";
import InfoModal from "./components/InfoModal";
import { hasAdminAccess, canAccessReports } from './utils/userHelper';
import { EVENTS } from './config/events';
import roleSyncService from './Services/roleSyncService';
import AppRoutes from './components/AppRoutes';
import { EventType } from "@azure/msal-browser";
import { getUserData } from "./Services/SSOServices/graphService";
import { fetchAuthToken } from "./Services/authService";

const msalInstance = new PublicClientApplication(msalConfig);

function App() {
    const [showModal, setShowModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [canViewReports, setCanViewReports] = useState(false);

    // Verificar si hay un usuario autenticado en localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        setIsLoggedIn(!!storedUser);
    }, []);

    // Iniciar/detener sincronización de roles según el estado de login
    useEffect(() => {
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

    // Verificar si el modal ya se ha mostrado
    useEffect(() => {
        const modalShown = localStorage.getItem("modalShown");
        if (!modalShown) {
            setShowModal(true);
            localStorage.setItem("modalShown", "true");
        }
    }, []);

    useEffect(() => {
        const checkUserPermissions = () => {
            const isAdminUser = hasAdminAccess();
            const canViewReportsUser = canAccessReports();

            setIsAdmin(isAdminUser);
            setCanViewReports(canViewReportsUser);
        };

        if (isLoggedIn) {
            checkUserPermissions();
        } else {
            setIsAdmin(false);
            setCanViewReports(false);
        }
    }, [isLoggedIn]);

    // Escuchar cambios en los roles del usuario
    useEffect(() => {
        const handleRolesUpdate = () => {
            const isAdminUser = hasAdminAccess();
            const canViewReportsUser = canAccessReports();

            setIsAdmin(isAdminUser);
            setCanViewReports(canViewReportsUser);
        };

        window.addEventListener(EVENTS.USER_ROLES_UPDATED, handleRolesUpdate);

        return () => {
            window.removeEventListener(EVENTS.USER_ROLES_UPDATED, handleRolesUpdate);
        };
    }, []);

    // Escuchar el éxito de login a nivel global (útil para redirects móviles y LandingView)
    useEffect(() => {
        const callbackId = msalInstance.addEventCallback(async (message) => {
            if (message.eventType === EventType.LOGIN_SUCCESS && message.payload) {
                const payload = message.payload;
                const accessToken = payload.accessToken;
                
                try {
                    // Evitar fetch doble si el componente SignInButton ya lo hizo
                    const currentData = localStorage.getItem("userData");
                    if (!currentData || currentData === "null") {
                        console.log("Global login success intercepted. Fetching user and roles...");
                        const userData = await getUserData(accessToken);
                        localStorage.setItem("userData", JSON.stringify(userData));
                        setIsLoggedIn(true);
                        
                        // Disparar evento para que Header.jsx actualice el `user`
                        window.dispatchEvent(new Event("storage"));

                        // Recuperar roles desde el backend para este nuevo usuario
                        await fetchAuthToken();
                    }
                } catch (error) {
                    console.error("Error manejando el login global:", error);
                }
            }
        });

        return () => {
            if (callbackId) {
                msalInstance.removeEventCallback(callbackId);
            }
        };
    }, []);

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <MsalProvider instance={msalInstance}>
            <BrowserRouter>
                <div className="min-h-screen flex flex-col">
                    {showModal && <InfoModal onClose={handleCloseModal} />}
                    <Header
                        onLogout={handleLogout}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        canViewReports={canViewReports}
                        useRouter={true}
                    />
                    <main className="flex-grow bg-gray-100">
                        <AppRoutes
                            isLoggedIn={isLoggedIn}
                            isAdmin={isAdmin}
                            canViewReports={canViewReports}
                        />
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </MsalProvider>
    );
}

export default App;
