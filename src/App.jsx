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

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
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
                        onLoginSuccess={handleLoginSuccess}
                        onLogout={handleLogout}
                        isLoggedIn={isLoggedIn}
                        isAdmin={isAdmin}
                        canViewReports={canViewReports}
                        useRouter={true}
                    />
                    <main className="flex-grow bg-gray-100">
                        <div className="container mx-auto py-6">
                            <AppRoutes
                                isLoggedIn={isLoggedIn}
                                isAdmin={isAdmin}
                                canViewReports={canViewReports}
                            />
                        </div>
                    </main>
                    <Footer />
                </div>
            </BrowserRouter>
        </MsalProvider>
    );
}

export default App;
