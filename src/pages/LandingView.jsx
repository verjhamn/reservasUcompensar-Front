import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMsal } from "@azure/msal-react";
import { GraduationCap, CalendarDays, ArrowRight } from 'lucide-react';
import { loginRequest } from "../Services/SSOServices/authConfig";
import campusBg from '../assets/campus_av68.webp';

const LandingView = ({ isLoggedIn }) => {
    const navigate = useNavigate();
    const { instance, accounts } = useMsal();

    // Redireccionar si ya está logueado
    useEffect(() => {
        if (isLoggedIn || accounts.length > 0) {
            navigate('/catalogo');
        }
    }, [isLoggedIn, accounts, navigate]);

    const handleLogin = async () => {
        try {
            await instance.loginPopup(loginRequest);
            // El componente App/Header manejará el éxito del login
        } catch (error) {
            console.error("Error en login:", error);
        }
    };

    const handleGuestAccess = () => {
        navigate('/catalogo', { state: { guestMode: true } });
    };

    return (
        <div className="relative min-h-[calc(100vh-200px)] flex flex-col justify-center items-center p-6 bg-gray-900 overflow-hidden mb-8">
            {/* Background Image with Improved Overlay */}
            <div className="absolute inset-0 z-0">
                <img
                    src={campusBg}
                    alt="Campus Background"
                    className="w-full h-full object-cover opacity-20"
                />
                {/* Gradient Overlay - Adjusted for better visibility of building */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/85 via-purple-900/80 to-primary-900/85 mix-blend-multiply" />
                {/* Decorative Pattern Overlay (Optional, for texture) */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
            </div>

            <div className="relative z-10 max-w-4xl w-full text-center space-y-12 animate-fade-in-up">

                <div className="space-y-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight drop-shadow-lg">
                        Bienvenido a la gestión y reserva de espacios
                    </h1>
                    <p className="text-xl text-purple-100 max-w-2xl mx-auto font-medium drop-shadow-md">
                        Selecciona tu perfil para continuar y encontrar el espacio perfecto.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 px-4">
                    {/* Opción A: Comunidad UCompensar */}
                    <div
                        onClick={handleLogin}
                        className="group relative bg-white rounded-2xl p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ring-1 ring-transparent hover:ring-primary-100"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary-500 to-purple-600 opacity-80 group-hover:opacity-100 transition-opacity" />

                        <div className="h-20 w-20 bg-primary-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <GraduationCap className="h-10 w-10 text-primary-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-800 mb-3 group-hover:text-primary-600 transition-colors">
                            Comunidad UCompensar
                        </h3>
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Estudiantes, docentes y administrativos. Ingresa con tu cuenta institucional para acceder a todos los espacios.
                        </p>

                        <div className="flex items-center justify-center text-primary-600 font-semibold group-hover:gap-2 transition-all">
                            <span>Iniciar Sesión</span>
                            <ArrowRight className="h-5 w-5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </div>
                    </div>

                    {/* Opción B: Externos / Eventos */}
                    <div
                        onClick={handleGuestAccess}
                        className="group relative bg-white rounded-2xl p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden ring-1 ring-transparent hover:ring-purple-100"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 to-blue-500 opacity-80 group-hover:opacity-100 transition-opacity" />

                        <div className="h-20 w-20 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                            <CalendarDays className="h-10 w-10 text-purple-600" />
                        </div>

                        <h3 className="text-2xl font-bold text-neutral-800 mb-3 group-hover:text-purple-600 transition-colors">
                            Externos y Empresas
                        </h3>
                        <p className="text-neutral-500 mb-8 leading-relaxed">
                            Solicita cotizaciones para eventos, auditorios y espacios especiales sin necesidad de tener una cuenta.
                        </p>

                        <div className="flex items-center justify-center text-purple-600 font-semibold group-hover:gap-2 transition-all">
                            <span>Ver Espacios de Eventos</span>
                            <ArrowRight className="h-5 w-5 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingView;
