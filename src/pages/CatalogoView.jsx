import React, { useEffect } from 'react';
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

    // Efecto para aplicar modo invitado (Solo Eventos) y Sede por defecto
    useEffect(() => {
        if (isGuestMode) {
            const guestFilters = {
                ...filters,
                sede: '1', // Pre-seleccionar sede por ID (1 = Campus Av. 68)
                tipo: 'Espacio de eventos'
            };
            // Solo actualizamos si no está ya configurado para evitar loops
            if (filters.tipo !== 'Espacio de eventos' || filters.sede !== '1') {
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
        const newFilters = { ...filters, sede: '', tipo: '' };
        setFilters(newFilters);
        handleFilterChange(newFilters);
    };

    // Si estamos en modo invitado pero los filtros aún no están configurados, no renderizar nada (o un loader)
    // Esto evita que se muestre el selector de campus o resultados incorrectos momentáneamente
    if (isGuestMode && (filters.sede !== '1' || filters.tipo !== 'Espacio de eventos')) {
        return <div className="min-h-screen flex items-center justify-center bg-gray-50/50"><p>Configurando perfil de invitado...</p></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50/50">
            {/* QR Simulator solo para Super Admin */}
            {isSuperAdmin() && <QRSimulator />}

            <div className="container mx-auto py-6">
                {/* Paso 1: Selector de Campus */}
                {showCampusSelector && !isGuestMode && (
                    <CampusSelector onSelectCampus={handleCampusSelect} />
                )}

                {/* Paso 2: Resultados (Inmediatamente tras seleccionar sede) */}
                {showResults && (
                    <div className="animate-fade-in">
                        <div className="flex items-center mb-6">
                            {!isGuestMode && ( // Ocultar botón volver para invitados si ya están predefinidos
                                <button
                                    onClick={handleBackToCampus}
                                    className="mr-4 p-2 rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 flex items-center gap-2"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                    <span className="text-sm font-medium">Volver a selección de sede</span>
                                </button>
                            )}
                            <div>
                                <h2 className="text-2xl font-bold text-neutral-800">Espacios Disponibles</h2>
                                <p className="text-sm text-neutral-500">
                                    {filters.sede} {filters.tipo ? `• ${filters.tipo}` : ''}
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col lg:flex-row gap-6">
                            <div className="w-full lg:w-1/4">
                                <SearchFilters
                                    filters={filters}
                                    setFilters={setFilters}
                                    onFilterChange={handleFilterChange}
                                    isGuestMode={isGuestMode}
                                />
                            </div>
                            <div className="w-full lg:flex-1">
                                <ResultsTable
                                    filters={filters}
                                    goToMyReservations={goToMyReservations}
                                    isGuestMode={isGuestMode}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CatalogoView;
