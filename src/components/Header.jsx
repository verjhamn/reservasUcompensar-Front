import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import SignInButton from "./SSOComponents/SignInButton";
import SignOutButton from "./SSOComponents/SignOutButton";
import { getUserData } from "../Services/SSOServices/graphService";


const Header = () => {
    const { accounts } = useMsal();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem("userData");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const handleLoginSuccess = async (accessToken) => {
        try {
            const userData = await getUserData(accessToken);
            console.log("Usuario autenticado:", userData);

            localStorage.setItem("userData", JSON.stringify(userData));
            setUser(userData);
        } catch (error) {
            console.error("Error al obtener datos del usuario:", error);
        }
    };

    return (
        <header className="bg-white text-gray-800 py-4 flex justify-between items-center px-6">
            <div className="flex items-center">
                <img src="https://ucompensar.edu.co/wp-content/uploads/2021/04/main-logo.svg" alt="Logo" className="h-12" />
            </div>

            <div>
                {user ? (
                    <div className="flex items-center space-x-4">
                        <span>{user.displayName} ({user.mail})</span>
                        <SignOutButton onLogout={() => setUser(null)} />
                    </div>
                ) : (
                    <SignInButton onLoginSuccess={handleLoginSuccess} />
                )}
            </div>
        </header>
    );
};

export default Header;
