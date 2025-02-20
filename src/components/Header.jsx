import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Menu, X, User } from "lucide-react";
import SignInButton from "./SSOComponents/SignInButton";
import SignOutButton from "./SSOComponents/SignOutButton";
import { getUserData } from "../Services/SSOServices/graphService";
import { getUserRole } from "../utils/userHelper";
import { ADMIN_ROLES } from "../config/adminRoles";

const Header = ({ onLoginSuccess, onLogout }) => {
  const { accounts } = useMsal();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const updateUser = () => {
    const storedUser = localStorage.getItem("userData");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    updateUser();
    window.addEventListener("storage", updateUser);
    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleLoginSuccess = async (accessToken) => {
    try {
      const userData = await getUserData(accessToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      onLoginSuccess(userData);
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const getUserRoleLabel = (email) => {
    const role = getUserRole(email);
    switch(role) {
      case ADMIN_ROLES.SUPER_ADMIN:
        return 'Super Admin';
      case ADMIN_ROLES.ADMIN:
        return 'Administrador';
      case ADMIN_ROLES.REPORTS_VIEWER:
        return 'Reportes';
      default:
        return 'Usuario';
    }
  };

  const getRoleColor = (email) => {
    const role = getUserRole(email);
    switch(role) {
      case ADMIN_ROLES.SUPER_ADMIN:
        return 'text-pink-600';
      case ADMIN_ROLES.ADMIN:
        return 'text-teal-600';
      case ADMIN_ROLES.REPORTS_VIEWER:
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex-shrink-0 flex items-center">
            <img
              className="h-8 w-auto"
              src="https://ucompensar.edu.co/wp-content/uploads/2021/04/main-logo.svg"
              alt="Compensar Logo"
            />
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user.givenName} {user.surname}
                    </span>
                    <span className="text-xs text-gray-500">{user.mail}</span>
                    <span className={`text-xs font-medium ${getRoleColor(user.mail)}`}>
                      {getUserRoleLabel(user.mail)}
                    </span>
                  </div>
                </div>
                <SignOutButton 
                  onLogout={() => {
                    localStorage.removeItem("userData");
                    setUser(null);
                    onLogout();
                  }}
                />
              </div>
            ) : (
              <SignInButton onLoginSuccess={handleLoginSuccess} />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-4 pb-3 border-t border-gray-200">
            {user ? (
              <div className="space-y-3 px-4">
                <div className="flex items-center space-x-3 bg-gray-50 rounded-lg px-4 py-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900">
                      {user.givenName} {user.surname}
                    </span>
                    <span className="text-xs text-gray-500">{user.mail}</span>
                    <span className={`text-xs font-medium ${getRoleColor(user.mail)}`}>
                      {getUserRoleLabel(user.mail)}
                    </span>
                  </div>
                </div>
                <div onClick={() => setIsMenuOpen(false)}>
                  <SignOutButton 
                    onLogout={() => {
                      localStorage.removeItem("userData");
                      setUser(null);
                      onLogout();
                    }}
                  />
                </div>
              </div>
            ) : (
              <div className="px-4" onClick={() => setIsMenuOpen(false)}>
                <SignInButton onLoginSuccess={handleLoginSuccess} />
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;