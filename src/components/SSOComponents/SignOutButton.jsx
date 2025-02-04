import React from "react";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const SignOutButton = ({ onLogout }) => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup();
        localStorage.removeItem("userData");
        onLogout();
    };

    return (
        <button onClick={handleLogout} className="bg-fucsia text-xs md:text-md text-white p-2 md:px-4 md:py-2 rounded flex items-center space-x-2">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar sesión</span>
        </button>
    );
};

export default SignOutButton;
