import React from "react";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { loginRequest } from "../../Services/SSOServices/authConfig";

const SignInButton = ({ onLoginSuccess }) => {
    const { instance } = useMsal();

    const handleLogin = async () => {
        try {
            const response = await instance.loginPopup(loginRequest);
            const accessToken = response.accessToken;

            onLoginSuccess(accessToken);
        } catch (error) {
            console.error("Error en el inicio de sesión con Microsoft:", error);
        }
    };

    return (
        <button onClick={handleLogin} className="bg-turquesa text-xs md:text-md text-white p-2 md:px-4 md:py-2 rounded flex items-center space-x-1 md:space-x-3">
            <FontAwesomeIcon icon={faSignInAlt} />
            <span>Iniciar sesión</span>
        </button>
    );
};

export default SignInButton;
