import React from "react";
import { useMsal } from "@azure/msal-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const SignOutButton = ({ onLogout }) => {
    const { instance } = useMsal();

    const handleLogout = () => {
        instance.logoutPopup({
            postLogoutRedirectUri: "/",
            mainWindowRedirectUri: "/"
        });
        localStorage.removeItem("userData");
        modalShown.removeItem("modalShown");
        onLogout();
    };

    return (
        <button onClick={handleLogout} className="text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-all text-xs md:text-md p-2 md:px-4 md:py-2 rounded-lg flex items-center space-x-2 font-medium">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span>Cerrar sesión</span>
        </button>
    );
};

export default SignOutButton;
