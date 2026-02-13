import React, { useState } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, Link } from 'react-router-dom';
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

    return (
        <>
            {/* Navigation Tabs */}
            <div className="flex justify-center space-x-4 mb-6">
                <Link
                    to="/catalogo"
                    className={`py-2 px-4 rounded ${isActive('/catalogo') ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                >
                    Catálogo
                </Link>

                {isLoggedIn && (
                    <>
                        <Link
                            to="/mis-reservas"
                            className={`py-2 px-4 rounded ${isActive('/mis-reservas') ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                        >
                            Mis reservas
                        </Link>
                        {isAdmin && (
                            <Link
                                to="/admin-reservas"
                                className={`py-2 px-4 rounded ${isActive('/admin-reservas') ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                            >
                                Administrar reservas
                            </Link>
                        )}
                        {(isAdmin || canViewReports) && (
                            <Link
                                to="/reportes"
                                className={`py-2 px-4 rounded ${isActive('/reportes') ? "bg-turquesa hover:bg-turquesa/90 text-white" : "bg-gray-300"}`}
                            >
                                Reportes
                            </Link>
                        )}
                    </>
                )}
            </div>

            {/* Routes */}
            <Routes>
                <Route path="/" element={<Navigate to="/catalogo" replace />} />
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
                {/* Redirect to catalog if trying to access protected routes without auth */}
                <Route path="*" element={<Navigate to="/catalogo" replace />} />
            </Routes>
        </>
    );
};

export default AppRoutes;
