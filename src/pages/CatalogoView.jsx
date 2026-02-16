import React from 'react';
import SearchFilters from '../components/SearchFilters';
import ResultsTable from '../components/ResultsTable';
import QRSimulator from '../components/QRSimulator';
import CampusSelector from '../components/CampusSelector';
import SpaceTypeSelector from '../components/SpaceTypeSelector';
import { isSuperAdmin } from '../utils/userHelper';

const CatalogoView = ({ filters, setFilters, handleFilterChange, goToMyReservations }) => {
    const handleCampusSelect = (campus) => {
        const newFilters = { ...filters, sede: campus };
        setFilters(newFilters);
        handleFilterChange(newFilters);
    };

    const handleTypeSelect = (type) => {
        const newFilters = { ...filters, tipo: type };
        setFilters(newFilters);
        handleFilterChange(newFilters);
    };

    return (
        <div>
            {/* QR Simulator solo para Super Admin */}
            {isSuperAdmin() && <QRSimulator />}

            {/* Campus Selector */}
            <CampusSelector
                selectedCampus={filters.sede}
                onSelectCampus={handleCampusSelect}
            />

            {/* Space Type Selector */}
            <SpaceTypeSelector
                selectedType={filters.tipo}
                onSelectType={handleTypeSelect}
            />

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4">
                    <SearchFilters
                        filters={filters}
                        setFilters={setFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div>
                <div className="w-full lg:flex-1">
                    <ResultsTable
                        filters={filters}
                        goToMyReservations={goToMyReservations}
                    />
                </div>
            </div>
        </div>
    );
};

export default CatalogoView;
