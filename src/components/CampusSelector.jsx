/* eslint-disable react/prop-types */
import { MapPin } from 'lucide-react';
import campusBg from '../assets/campus_av68.webp';
import campusTeusaquilloBg from '../assets/campus_teusaquillo.webp';

const campuses = [
    {
        id: 'av68',
        name: 'Campus Av. 68',
        address: 'Av Carrera 68 No. 68 B - 45',
        description: 'Sede administrativa y academica',
        value: '1',
    },
    {
        id: 'teusaquillo',
        name: 'Campus Teusaquillo',
        address: 'Avenida (Calle) 32 No. 17 - 30',
        description: 'Sede administrativa y academica',
        value: '2',
    },
];

const CampusSelector = ({ selectedCampus, isInternalUser, onSelectCampus }) => {
    const isCampusDisabled = (campus) => campus.value === '2' && !isInternalUser;

    return (
        <div className="mb-2">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Selecciona la sede</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {campuses.map((campus) => {
                    const isDisabled = isCampusDisabled(campus);
                    const isSelected = selectedCampus === campus.value;

                    return (
                        <button
                            key={campus.id}
                            type="button"
                            onClick={() => onSelectCampus(campus.value)}
                            disabled={isDisabled}
                            aria-disabled={isDisabled}
                            className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 text-left animate-fade-in-up ${
                                isDisabled
                                    ? 'cursor-not-allowed opacity-90'
                                    : `group ${
                                        isSelected
                                            ? 'ring-4 ring-purple-500 ring-offset-2 hover:shadow-2xl hover:scale-105 structure-ring'
                                            : 'hover:ring-2 hover:ring-purple-300 hover:shadow-2xl hover:scale-105'
                                    }`
                            }`}
                        >
                            <div className={`h-48 relative overflow-hidden transition-transform duration-700 ${isDisabled ? '' : 'group-hover:scale-105'}`}>
                                <img
                                    src={campus.id === 'av68' ? campusBg : campusTeusaquilloBg}
                                    alt={campus.name}
                                    className="w-full h-full object-cover"
                                />
                                <div className={`absolute inset-0 ${isDisabled ? 'bg-neutral-900/55' : 'bg-purple-900/40 mix-blend-multiply'}`} />
                                <div className={`absolute inset-0 ${isDisabled ? 'bg-gradient-to-t from-neutral-900/75 to-neutral-700/30' : 'bg-gradient-to-t from-purple-900/80 to-transparent'}`} />

                                <div className="absolute inset-0 flex items-center justify-center z-10">
                                    <div className={`backdrop-blur-sm rounded-full p-6 ${isDisabled ? 'bg-white/10' : 'bg-white/20 transition-transform group-hover:scale-110'}`}>
                                        <MapPin className="w-16 h-16 text-white" />
                                    </div>
                                </div>

                                {isSelected && !isDisabled && (
                                    <div className="absolute top-4 right-4 bg-white text-purple-700 text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                                        Seleccionado
                                    </div>
                                )}

                                {isDisabled && (
                                    <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
                                        <span className="rounded-full border border-neutral-300 bg-white px-6 py-2 text-sm font-black uppercase tracking-wide text-neutral-800 shadow-lg rotate-[-10deg]">
                                            Proximamente
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6">
                                <h3 className="text-xl font-bold text-neutral-800 mb-2">
                                    {campus.name}
                                </h3>
                                <div className="flex items-start gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-purple-500 mt-1 flex-shrink-0" />
                                    <p className="text-sm text-neutral-600">{campus.address}</p>
                                </div>
                                <div className="flex justify-between items-end gap-3">
                                    <p className="text-sm text-neutral-500">{campus.description}</p>
                                    {isDisabled && (
                                        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                                            Solo internos
                                        </span>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default CampusSelector;
