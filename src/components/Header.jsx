import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faSignOutAlt, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import SignInButton from "./SSOComponents/SignInButton";
import SignOutButton from "./SSOComponents/SignOutButton";
import { getUserData } from "../Services/SSOServices/graphService";
import { fetchAuthToken } from "../Services/authService";

const Header = () => {
    const { accounts } = useMsal();
    const [user, setUser] = useState(null);

    // Función para actualizar el estado del usuario
    const updateUser = () => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    };

    // Escuchar cambios en localStorage
    useEffect(() => {
        updateUser(); // Se ejecuta al montar el componente
        window.addEventListener("storage", updateUser); // Se ejecuta si cambia el localStorage
        return () => {
            window.removeEventListener("storage", updateUser);
        };
    }, []);

    const handleLoginSuccess = async (accessToken) => {
        try {
            const userData = await getUserData(accessToken);
            console.log("[Header] Usuario autenticado con SSO:", userData);
    
            localStorage.setItem("userData", JSON.stringify(userData));
            setUser(userData);
    
            console.log("[Header] Registrando usuario en el backend si es necesario...");
            await fetchAuthToken(); // Llamamos de inmediato para autenticar o registrar al usuario en el backend.
        } catch (error) {
            console.error("[Header] Error al obtener datos del usuario:", error);
        }
    };

    return (
        <header className="bg-white text-gray-800 py-4 flex justify-between items-center px-4 md:px-6 shadow-md">
            <div className="flex items-center">
                <img src="https://ucompensar.edu.co/wp-content/uploads/2021/04/main-logo.svg" alt="Logo" className="h-10 md:h-12 mr-2" />
            </div>

            <div className="flex items-center space-x-4">
                {user ? (
                    <div className="flex items-center space-x-2 md:space-x-4">
                        <FontAwesomeIcon icon={faUser} className="hidden md:inline text-gray-600" />
                        <div className="flex items-center justify-end px-2 py-4">
                            <span className="lg:inline text-stone-900 text-xxs md:text-ms">{user.givenName} {user.surname} </span>
                            <span className="hidden text-xxs lg:text-ms lg:inline">({user.mail})</span>
                        </div>
                        <SignOutButton onLogout={() => {
                            localStorage.removeItem("userData");
                            setUser(null);
                        }} />
                    </div>
                ) : (
                    <SignInButton onLoginSuccess={handleLoginSuccess} />
                )}
            </div>
        </header>
    );
};

export default Header;
