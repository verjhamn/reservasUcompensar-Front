import React, { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { Menu, X, User } from "lucide-react";
import SignInButton from "./SSOComponents/SignInButton";
import SignOutButton from "./SSOComponents/SignOutButton";
import { getUserData } from "../Services/SSOServices/graphService";
import { getUserRoleFromBackend, debugUserRoles } from "../utils/userHelper";
import { fetchAuthToken, getUserRoles } from "../Services/authService";
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

  // Verificar roles cuando el usuario ya está logueado
  useEffect(() => {
    const checkExistingUser = async () => {
      const storedUser = localStorage.getItem("userData");
      const storedRoles = localStorage.getItem("userRoles");
      
      if (storedUser && !storedRoles) {
        console.log("[Header] Usuario existe pero sin roles, obteniendo roles del backend...");
        try {
          await fetchAuthToken();
          debugUserRoles();
        } catch (error) {
          console.error("Error al obtener roles del usuario existente:", error);
        }
      }
    };

    checkExistingUser();
  }, []);

  const handleLoginSuccess = async (accessToken) => {
    try {
      const userData = await getUserData(accessToken);
      localStorage.setItem("userData", JSON.stringify(userData));
      setUser(userData);
      onLoginSuccess(userData);
      
      // IMPORTANTE: Llamar a fetchAuthToken para obtener roles del backend
      console.log("[Header] Obteniendo roles del backend...");
      await fetchAuthToken();
      
      // Debug de roles después del login
      setTimeout(() => {
        console.log("=== DEBUG DESPUÉS DEL LOGIN ===");
        debugUserRoles();
      }, 1000); // Reducir tiempo a 1 segundo
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const getUserRoleLabel = () => {
    const role = getUserRoleFromBackend();
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

  // Función temporal para testing - simular roles
  const simulateRole = (roleId) => {
    const roleMap = {
      1: [{ id: 1, name: 'Superadministrador' }],
      2: [{ id: 2, name: 'Administrador' }],
      3: [{ id: 3, name: 'Reportes' }],
      0: []
    };
    
    const roles = roleMap[roleId] || [];
    localStorage.setItem("userRoles", JSON.stringify(roles));
    console.log(`Simulando rol ${roleId}:`, roles);
    debugUserRoles();
    // Forzar re-render
    setUser(prev => ({ ...prev }));
  };

  // Función para corregir el localStorage actual
  const fixCurrentUserRoles = () => {
    console.log("=== CORRIGIENDO ROLES DEL USUARIO ACTUAL ===");
    
    // Obtener el email del usuario actual
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const email = userData.mail;
    
    console.log("Email del usuario:", email);
    
    // Si es el usuario de tecnología, debería ser Super Admin
    if (email === "tecnologia@ucompensar.edu.co") {
      const correctRoles = [{ id: 1, name: "Superadministrador" }];
      localStorage.setItem("userRoles", JSON.stringify(correctRoles));
      console.log("Roles corregidos para Super Admin:", correctRoles);
    } else {
      console.log("Usuario no reconocido para corrección automática");
    }
    
    debugUserRoles();
    setUser(prev => ({ ...prev }));
  };

  // Función para simular la respuesta exacta del backend
  const simulateBackendResponse = () => {
    const backendResponse = {
      status: true,
      message: "Sesión iniciada correctamente",
      data: {
        id: "3bcca725-11b1-47ca-9996-8a7a6d006f04",
        displayName: "Andres Felipe Verjhamn Urian",
        givenName: "Andres Felipe",
        surname: "Verjhamn Urian",
        email: "afurianv@ucompensar.edu.co",
        jobTitle: "Desarrollador De Aplicaciones E Integraciones",
        email_verified_at: null,
        created_at: "2025-02-04T21:55:49.000000Z",
        updated_at: "2025-02-04T21:55:49.000000Z",
        roles: [
          {
            id: 1,
            name: "Superadministrador",
            guard_name: "web",
            created_at: "2025-09-24T20:56:37.000000Z",
            updated_at: "2025-09-24T20:56:37.000000Z",
            pivot: {
              model_type: "App\\Models\\User",
              model_id: "3bcca725-11b1-47ca-9996-8a7a6d006f04",
              role_id: 1
            }
          }
        ]
      },
      token: "102|6eHy7W3uUh1lLPXmL8BKleTV3FzmnTI0zm3A39eWfb07b33f",
      roles: [
        "Superadministrador"
      ]
    };

    console.log("=== SIMULANDO RESPUESTA DEL BACKEND ===");
    console.log("Respuesta completa:", backendResponse);
    
    // Simular la extracción como lo hace authService
    const { token, data, roles: roleNames } = backendResponse;
    const userId = data?.id;
    const userRoles = data?.roles;
    
    console.log("userId extraído:", userId);
    console.log("userRoles extraídos:", userRoles);
    console.log("roleNames extraídos:", roleNames);
    
    // Guardar los roles como lo haría authService
    if (userRoles && Array.isArray(userRoles)) {
      localStorage.setItem("userRoles", JSON.stringify(userRoles));
      console.log("Roles guardados en localStorage:", userRoles);
    }
    
    debugUserRoles();
    setUser(prev => ({ ...prev }));
  };

  const getRoleColor = () => {
    const role = getUserRoleFromBackend();
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
                    <span className={`text-xs font-medium ${getRoleColor()}`}>
                      {getUserRoleLabel()}
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
                    <span className={`text-xs font-medium ${getRoleColor()}`}>
                      {getUserRoleLabel()}
                    </span>
                  </div>
                </div>
                
                {/* Botones de debug temporales */}
                <div className="px-4">
                  <p className="text-xs text-gray-500 mb-2">Debug Roles:</p>
                  <div className="flex flex-wrap gap-1">
                    <button 
                      onClick={() => simulateRole(1)}
                      className="text-xs bg-pink-500 text-white px-2 py-1 rounded"
                    >
                      Super Admin
                    </button>
                    <button 
                      onClick={() => simulateRole(2)}
                      className="text-xs bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Admin
                    </button>
                    <button 
                      onClick={() => simulateRole(3)}
                      className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                      Reportes
                    </button>
                    <button 
                      onClick={() => simulateRole(0)}
                      className="text-xs bg-gray-500 text-white px-2 py-1 rounded"
                    >
                      Usuario
                    </button>
                  </div>
                  <div className="mt-2 space-y-1">
                    <button 
                      onClick={simulateBackendResponse}
                      className="text-xs bg-purple-500 text-white px-2 py-1 rounded w-full"
                    >
                      Simular Respuesta Backend
                    </button>
                    <button 
                      onClick={fixCurrentUserRoles}
                      className="text-xs bg-orange-500 text-white px-2 py-1 rounded w-full"
                    >
                      Corregir Roles Actuales
                    </button>
                    <button 
                      onClick={() => {
                        console.log("[Header] Forzando actualización de permisos...");
                        window.dispatchEvent(new CustomEvent('userRolesUpdated', { detail: getUserRoles() }));
                      }}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded w-full"
                    >
                      Forzar Actualización UI
                    </button>
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