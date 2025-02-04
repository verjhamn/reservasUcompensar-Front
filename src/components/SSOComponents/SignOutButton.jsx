import React from "react";
import { useMsal } from "@azure/msal-react";

const SignOutButton = ({ onLogout }) => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup();
        localStorage.removeItem("userData");
        onLogout();
    };

    return (
        <button onClick={handleLogout} className="bg-fucsia text-sm md:text-md text-white px-4 py-2 rounded">
            Cerrar sesión
        </button>
    );
};

export default SignOutButton;
