import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
import LandingView from '../pages/LandingView';
import CatalogoView from '../pages/CatalogoView';
import MisReservasView from '../pages/MisReservasView';
import AdminView from '../pages/AdminView';
import ReportesView from '../pages/ReportesView';
import EspacioQRView from '../pages/EspacioQRView';
import ColorPaletteDemo from './ColorPaletteDemo';

const AppRoutes = ({ isLoggedIn, isAdmin, canViewReports }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [filters, setFilters] = useState({
        capacidad: "",
        espacio: "",
        ubicacion: "",
        fecha: "",
        horaInicio: "",
        horaFinal: "",
        palabra: "",
        id: "",
        sede: "",
        tipo: "",
        tiporecurso: "",
        piso: "",
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const goToMyReservations = () => {
        navigate('/mis-reservas');
    };

    // Helper to check if a route is active
    const isActive = (path) => location.pathname === path;

    // Check if we are on landing page
    const isLanding = location.pathname === '/';

    // Strict Landing Redirect: If on /catalogo, not logged in, and not guest mode -> Redirect to Landing
    if (location.pathname === '/catalogo' && !isLoggedIn && !location.state?.guestMode) {
        return <Navigate to="/" replace />;
    }

    return (
        <>
            {/* Navigation Tabs (Hidden on Landing) */}
            {!isLanding && (
                <div className="flex justify-center items-center space-x-2 mb-8 bg-neutral-100 p-1.5 rounded-xl w-fit mx-auto shadow-inner animate-fade-in">
                    {[
                        { path: '/catalogo', label: 'Catálogo' },
                        ...(isLoggedIn ? [
                            { path: '/mis-reservas', label: 'Mis reservas' },
                            ...(isAdmin ? [{ path: '/admin-reservas', label: 'Administrar reservas' }] : []),
                            ...((isAdmin || canViewReports) ? [{ path: '/reportes', label: 'Reportes' }] : [])
                        ] : [])
                    ].map((tab) => (
                        <Link
                            key={tab.path}
                            to={tab.path}
                            className={`
                                relative px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ease-out
                                ${isActive(tab.path)
                                    ? "bg-purple-600 text-white shadow-md transform scale-[1.02]"
                                    : "text-neutral-500 hover:text-purple-700 hover:bg-white/60"
                                }
                            `}
                        >
                            {tab.label}
                        </Link>
                    ))}
                </div>
            )}

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingView isLoggedIn={isLoggedIn} />} />
                <Route
                    path="/catalogo"
                    element={
                        <CatalogoView
                            filters={filters}
                            setFilters={setFilters}
                            handleFilterChange={handleFilterChange}
                            goToMyReservations={goToMyReservations}
                        />
                    }
                />
                <Route
                    path="/espacio/:codigo"
                    element={
                        <EspacioQRView
                            isLoggedIn={isLoggedIn}
                            goToMyReservations={goToMyReservations}
                        />
                    }
                />
                {isLoggedIn && (
                    <>
                        <Route
                            path="/mis-reservas"
                            element={<MisReservasView />}
                        />
                        {isAdmin && (
                            <Route
                                path="/admin-reservas"
                                element={<AdminView />}
                            />
                        )}
                        {(isAdmin || canViewReports) && (
                            <Route
                                path="/reportes"
                                element={<ReportesView />}
                            />
                        )}
                    </>
                )}
                {/* Temporary: Color Palette Demo */}
                <Route path="/colores" element={<ColorPaletteDemo />} />
                {/* Redirect to landing if trying to access protected routes without auth */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
