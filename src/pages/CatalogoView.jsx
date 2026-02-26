import React, { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import SearchFilters from '../components/SearchFilters';
import ResultsTable from '../components/ResultsTable';
import QRSimulator from '../components/QRSimulator';
import CampusSelector from '../components/CampusSelector';
import { isSuperAdmin } from '../utils/userHelper';

const CatalogoView = ({ filters, setFilters, handleFilterChange, goToMyReservations }) => {
    const location = useLocation();
    const isGuestMode = location.state?.guestMode;
    const [availableFloors, setAvailableFloors] = useState([]);

    // Efecto para aplicar modo invitado (Solo Eventos)
    useEffect(() => {
        if (isGuestMode) {
            // Solo pre-seleccionamos el TIPO, la SEDE la debe elegir el usuario
            if (filters.tipo !== 'Espacio de eventos') {
                const guestFilters = {
                    ...filters,
                    tipo: 'Espacio de eventos'
                    // NO pre-seleccionamos sede aquí
                };
                setFilters(guestFilters);
                handleFilterChange(guestFilters);
            }
        }
    }, [isGuestMode]);

    // Determine current step based on filters
    // Step 1: Select Campus (No campus selected)
    // Step 2: Show Results (Campus selected) - SpaceTypeSelector removed

    // Si no hay sede seleccionada, mostrar paso 1
    const showCampusSelector = !filters.sede;

    // Si hay sede, mostrar paso 2 (Resultados) de inmediato
    const showResults = filters.sede;

    const handleCampusSelect = (campus) => {
        const newFilters = { ...filters, sede: campus };
        setFilters(newFilters);
        handleFilterChange(newFilters);
    };

    // handleTypeSelect removido ya que el componente se elimina

    // handleBackToCampus resets everything
    const handleBackToCampus = () => {
        const newFilters = { ...filters, sede: '', tipo: isGuestMode ? 'Espacio de eventos' : '' };
        setFilters(newFilters);
        handleFilterChange(newFilters);
    };

    // Si estamos en modo invitado pero el tipo aún no está configurado, mostrar loader
    if (isGuestMode && filters.tipo !== 'Espacio de eventos') {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50/50"><p>Configurando perfil de invitado...</p></div>;
    }

    return (
        <div className="container mx-auto pb-6 pt-2 bg-gray-50/50 rounded-xl px-4">
            {/* QR Simulator solo para Super Admin */}
            {isSuperAdmin() && <QRSimulator />}

            {/* Paso 1: Selector de Campus */}
            {showCampusSelector && (
                <CampusSelector onSelectCampus={handleCampusSelect} />
            )}

            {/* Paso 2: Resultados (Inmediatamente tras seleccionar sede) */}
            {showResults && (
                <div className="animate-fade-in">
                    <div className="flex items-center mb-2">
                        <div>
                            <button
                                onClick={handleBackToCampus}
                                className="mb-2 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 flex items-center gap-2"
                            >
                                <ArrowLeft className="w-5 h-5" />
                                <span className="text-sm font-medium">Volver a selección de sede</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-6">
                        <div className="w-full lg:w-1/4">
                            <SearchFilters
                                filters={filters}
                                setFilters={setFilters}
                                onFilterChange={handleFilterChange}
                                isGuestMode={isGuestMode}
                                availableFloors={availableFloors}
                            />
                        </div>
                        <div className="w-full lg:flex-1">
                            <ResultsTable
                                filters={filters}
                                goToMyReservations={goToMyReservations}
                                isGuestMode={isGuestMode}
                                setAvailableFloors={setAvailableFloors}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CatalogoView;
