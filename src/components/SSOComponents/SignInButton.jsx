import React from "react";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { startMicrosoftLogin } from "../../Services/SSOServices/loginFlowService";

const SignInButton = () => {
    const { instance } = useMsal();

    const handleLogin = async () => {
        try {
            await startMicrosoftLogin(instance, {
                redirectStartPage: window.location.href,
            });
            // La lógica de inicio de sesión se maneja globalmente en App.jsx.
        } catch (error) {
            console.error("Error en el inicio de sesión con Microsoft:", error);
        }
    };

    return (
        <button onClick={handleLogin} className="bg-primary-600 hover:bg-primary-700 transition-colors text-xs md:text-md text-white p-2 md:px-4 md:py-2 rounded-lg shadow-sm flex items-center space-x-1 md:space-x-3 font-medium">
            <FontAwesomeIcon icon={faSignInAlt} />
            <span>Iniciar sesión</span>
        </button>
    );
};

export default SignInButton;
