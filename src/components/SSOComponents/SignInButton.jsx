import React from "react";
import { useMsal } from "@azure/msal-react";
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
        <button onClick={handleLogin} className="bg-turquesa text-white px-4 py-2 rounded">
            Iniciar sesión
        </button>
    );
};

export default SignInButton;
