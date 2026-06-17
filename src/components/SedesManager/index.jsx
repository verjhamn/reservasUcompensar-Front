import React from 'react';
import { MapPin, ToggleLeft, ToggleRight } from 'lucide-react';
import { useSedes } from '../../context/SedesContext';

const SedesManager = () => {
    const { sedes, toggleSede, loading } = useSedes();

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-800">Gestión de Sedes</h2>
                <p className="text-sm text-gray-500 mt-1">
                    Activa o desactiva las sedes disponibles para los usuarios en el catálogo.
                </p>
            </div>

            <div className="flex flex-col gap-4">
                {sedes.map(sede => (
                    <div
                        key={sede.id}
                        className={`bg-white rounded-2xl border-2 p-5 flex items-center justify-between transition-all duration-300 ${
                            sede.activo
                                ? 'border-purple-300 shadow-md'
                                : 'border-gray-200 opacity-60'
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-colors ${sede.activo ? 'bg-purple-100' : 'bg-gray-100'}`}>
                                <MapPin className={`w-6 h-6 ${sede.activo ? 'text-purple-600' : 'text-gray-400'}`} />
                            </div>
                            <div>
                                <p className="font-semibold text-gray-800">{sede.nombre}</p>
                                <span className={`inline-block mt-1 text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                    sede.activo
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-red-100 text-red-700'
                                }`}>
                                    {sede.activo ? 'Activa' : 'Inactiva'}
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleSede(sede.id)}
                            disabled={loading}
                            title={sede.activo ? 'Desactivar sede' : 'Activar sede'}
                            className="transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sede.activo
                                ? <ToggleRight className="w-12 h-12 text-purple-600" />
                                : <ToggleLeft className="w-12 h-12 text-gray-400" />
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SedesManager;
