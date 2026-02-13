import React from 'react';
import SearchFilters from '../components/SearchFilters';
import ResultsTable from '../components/ResultsTable';
import QRSimulator from '../components/QRSimulator';
import { isSuperAdmin } from '../utils/userHelper';

const CatalogoView = ({ filters, setFilters, handleFilterChange, goToMyReservations }) => {
    return (
        <div>
            {/* QR Simulator solo para Super Admin */}
            {isSuperAdmin() && <QRSimulator />}

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="w-full lg:w-1/4">
                    <SearchFilters
                        filters={filters}
                        setFilters={setFilters}
                        onFilterChange={handleFilterChange}
                    />
                </div >
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
