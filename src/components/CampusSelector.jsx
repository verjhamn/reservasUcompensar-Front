import React from 'react';
import { MapPin } from 'lucide-react';

const campuses = [
    {
        id: 'av68',
        name: 'Campus Av. 68',
        address: 'Av. 68 No. 49A-47',
        description: 'Campus principal con instalaciones completas',
        value: '1',
    },
    {
        id: 'teusaquillo',
        name: 'Campus Teusaquillo',
        address: 'Cra. 24 No. 39A-17',
        description: 'Sede administrativa y académica',
        value: '2',
    },
];

const CampusSelector = ({ selectedCampus, onSelectCampus }) => {
    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Selecciona tu Sede</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campuses.map((campus) => (
                    <button
                        key={campus.id}
                        onClick={() => onSelectCampus(campus.value)}
                        className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 group ${selectedCampus === campus.value
                            ? 'ring-4 ring-purple-500 ring-offset-2'
                            : 'hover:ring-2 hover:ring-purple-300'
                            }`}
                    >
                        {/* Gradient Background */}
                        <div className={`h-48 bg-gradient-to-br ${campus.id === 'av68'
                            ? 'from-purple-500 to-purple-700'
                            : 'from-primary-500 to-primary-700'
                            } relative`}>
                            {/* Icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="bg-white/20 backdrop-blur-sm rounded-full p-6 group-hover:scale-110 transition-transform">
                                    <MapPin className="w-16 h-16 text-white" />
                                </div>
                            </div>

                            {/* Selected Badge */}
                            {selectedCampus === campus.value && (
                                <div className="absolute top-4 right-4 bg-white text-purple-700 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                                    Seleccionado
                                </div>
                            )}
                        </div>

                        {/* Card Content */}
                        <div className="bg-white p-6 text-left">
                            <h3 className="text-xl font-bold text-neutral-800 mb-2">
                                {campus.name}
                            </h3>
                            <div className="flex items-start gap-2 mb-2">
                                <MapPin className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                                <p className="text-sm text-neutral-600">{campus.address}</p>
                            </div>
                            <p className="text-sm text-neutral-500">{campus.description}</p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default CampusSelector;
