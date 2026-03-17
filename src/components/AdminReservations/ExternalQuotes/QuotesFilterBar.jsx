import React from 'react';
import { Search, Filter, Mail, Calendar as CalendarIcon, Briefcase } from 'lucide-react';

const QuotesFilterBar = ({ filters, handleFilterChange }) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 z-10 relative">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <Briefcase className="w-6 h-6 text-purple-600" />
                        Bandeja de Solicitudes Externas
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Revisa y pre-aprueba solicitudes para contratos o montajes en los espacios corporativos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Search className="h-4 w-4 text-gray-400" /></div>
                    <input type="text" name="palabra" placeholder="Buscar Solicitante, Empresa..." value={filters.palabra} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-gray-400" /></div>
                    <input type="email" name="email" placeholder="Correo solicitante..." value={filters.email} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><Filter className="h-4 w-4 text-gray-400" /></div>
                    <select name="estado" value={filters.estado} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white appearance-none">
                        <option value="">Todos los Estados</option>
                        <option value="nueva">Nuevas</option>
                        <option value="en curso">En Curso</option>
                        <option value="en espera">En Espera</option>
                        <option value="aprobada">Aprobada</option>
                        <option value="no aprobada">No Aprobada</option>
                    </select>
                </div>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><CalendarIcon className="h-4 w-4 text-gray-400" /></div>
                    <input type="date" name="fecha" value={filters.fecha} onChange={handleFilterChange} className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-sm transition-all bg-gray-50 hover:bg-white" />
                </div>
            </div>
        </div>
    );
};

export default QuotesFilterBar;
