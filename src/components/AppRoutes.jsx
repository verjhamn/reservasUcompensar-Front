/* eslint-disable react/prop-types */
import { useState } from 'react';
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
        fecha: "",
        horaInicio: "",
        horaFin: "",
        palabra: "",
        id: "",
        sede: "",
        bloque: "",
        tipo: "",
        agrupable: "",
        tiporecurso: "",
        piso: "",
    });

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const normalizeDateParam = (value) => {
        if (!value) return "";

        if (value instanceof Date && !Number.isNaN(value.getTime())) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, "0");
            const day = String(value.getDate()).padStart(2, "0");
            return `${year}-${month}-${day}`;
        }

        if (typeof value !== "string") return "";

        const trimmedValue = value.trim();
        const isoMatch = trimmedValue.match(/^(\d{4})-(\d{2})-(\d{2})/);
        if (isoMatch) return `${isoMatch[1]}-${isoMatch[2]}-${isoMatch[3]}`;

        const slashMatch = trimmedValue.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
        if (slashMatch) return `${slashMatch[3]}-${slashMatch[2]}-${slashMatch[1]}`;

        return "";
    };

    const goToMyReservations = (reservationDate) => {
        const selectedDate = normalizeDateParam(reservationDate);

        if (selectedDate) {
            navigate({
                pathname: '/mis-reservas',
                search: `?fecha=${encodeURIComponent(selectedDate)}`,
            }, {
                state: { selectedDate },
            });
            return;
        }

        navigate('/mis-reservas');
    };

    // Helper to check if a route is active
    const isActive = (path) => location.pathname === path;

    // Check if we are on landing page
    const isLanding = location.pathname === '/';
    const tabs = [
        { path: '/catalogo', label: 'Catálogo' },
        ...(isLoggedIn ? [
            { path: '/mis-reservas', label: 'Mis reservas' },
            ...(isAdmin ? [{ path: '/admin-reservas', label: 'Administrar reservas' }] : []),
            ...((isAdmin || canViewReports) ? [{ path: '/reportes', label: 'Reportes' }] : [])
        ] : [])
    ];

    const AccessDenied = () => (
        <div className="container mx-auto px-4 py-12">
            <div className="mx-auto max-w-lg rounded-lg border border-gray-200 bg-white p-6 text-center shadow-sm">
                <h1 className="text-xl font-bold text-gray-900">Acceso restringido</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Tu usuario no tiene permisos para abrir esta ruta.
                </p>
            </div>
        </div>
    );

    const ProtectedRoute = ({ hasAccess, children }) => {
        if (!isLoggedIn) {
            return <Navigate to="/" replace />;
        }

        return hasAccess ? children : <AccessDenied />;
    };

    return (
        <>
            {/* Navigation Tabs (Hidden on Landing) */}
            {!isLanding && (
                <div className="mt-8 mb-2 w-full px-2">
                    <div
                        className={`flex items-center gap-2 bg-neutral-100 p-1.5 rounded-xl max-w-full overflow-x-auto shadow-inner animate-fade-in sm:w-fit sm:mx-auto ${
                            tabs.length === 1 ? "justify-center" : ""
                        }`}
                    >
                        {tabs.map((tab) => (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className={`
                                    relative shrink-0 whitespace-nowrap px-4 sm:px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-300 ease-out
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
                </div>
            )}

            {/* Routes */}
            <Routes>
                <Route path="/" element={<LandingView isLoggedIn={isLoggedIn} />} />
                <Route
                    path="/catalogo"
                    element={
                        <CatalogoView
                            isLoggedIn={isLoggedIn}
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
                <Route
                    path="/mis-reservas"
                    element={
                        <ProtectedRoute hasAccess={isLoggedIn}>
                            <MisReservasView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin-reservas"
                    element={
                        <ProtectedRoute hasAccess={isLoggedIn && isAdmin}>
                            <AdminView />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/reportes"
                    element={
                        <ProtectedRoute hasAccess={isLoggedIn && (isAdmin || canViewReports)}>
                            <ReportesView />
                        </ProtectedRoute>
                    }
                />
                {/* Temporary: Color Palette Demo */}
                <Route path="/colores" element={<ColorPaletteDemo />} />
                {/* Redirect to landing if trying to access protected routes without auth */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
