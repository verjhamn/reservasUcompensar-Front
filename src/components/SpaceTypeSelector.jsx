import React, { useState } from 'react';
// Version Force Update: 1.0.1
import { BookOpen, Users, FlaskConical, Laptop, Building2, ArrowLeft, ChevronDown, Check } from 'lucide-react';

const spaceTypes = [
    { id: 'events', name: 'Espacio de eventos', icon: Building2, color: 'primary', value: 'Espacio de eventos' },
    { id: 'coworking', name: 'Coworking', icon: Laptop, color: 'blue-light', value: 'Coworking' },
    { id: 'multipurpose', name: 'Espacio multipropósito', icon: Users, color: 'purple', value: 'Espacio multipropósito' },
    { id: 'lab', name: 'Laboratorio', icon: FlaskConical, color: 'magenta', value: 'Laboratorio' },
    { id: 'classroom', name: 'Sala de clases', icon: BookOpen, color: 'turquoise', value: 'Sala de clases' },
];

const SpaceTypeSelector = ({ selectedType, onSelectType, onBack }) => {
    const [isOpen, setIsOpen] = useState(false);
    // Inicializar con el tipo seleccionado si existe
    const [selected, setSelected] = useState(() => {
        return spaceTypes.find(t => t.value === selectedType) || null;
    });

    const handleSelect = (type) => {
        setSelected(type);
        setIsOpen(false);
        // Pequeño delay para que el usuario vea la selección antes de navegar
        setTimeout(() => {
            onSelectType(type.value);
        }, 300);
    };

    const getIconColor = (color) => {
        const colorMap = {
            purple: 'text-purple-600',
            'blue-light': 'text-blue-light-600',
            primary: 'text-primary-600',
            turquoise: 'text-turquoise-600',
            magenta: 'text-magenta-600',
            'blue-dark': 'text-blue-dark-600',
        };
        return colorMap[color] || 'text-neutral-600';
    };

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center min-h-[50vh]">

            <div className="w-full max-w-lg">
                <button
                    onClick={onBack}
                    className="mb-6 flex items-center text-neutral-500 hover:text-primary-600 transition-colors group"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Volver a selección de sede</span>
                </button>

                <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 relative">
                    {/* Header Decorativo */}
                    <div className="h-32 bg-gradient-to-r from-purple-600 to-primary-600 relative flex items-center justify-center rounded-t-3xl overflow-hidden">
                        <div className="absolute inset-0 bg-white/10 pattern-grid-lg opacity-20" />
                        <div className="text-center text-white z-10">
                            <h2 className="text-2xl font-bold mb-1">Tipo de espacio</h2>
                            <p className="text-white/80 text-sm">Selecciona el tipo de espacio que necesitas</p>
                        </div>
                    </div>

                    {/* Dropdown Container */}
                    <div className="p-8">
                        <div className="relative">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className={`w-full bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4 flex items-center justify-between hover:border-primary-300 hover:bg-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-primary-100 ${isOpen ? 'border-primary-500 bg-white ring-4 ring-primary-100' : ''}`}
                            >
                                <div className="flex items-center">
                                    {selected && (
                                        <div className={`mr-3 ${getIconColor(selected.color)}`}>
                                            {React.createElement(selected.icon, { className: "w-5 h-5" })}
                                        </div>
                                    )}
                                    <span className={`text-lg ${selected ? 'text-neutral-800 font-semibold' : 'text-neutral-400'}`}>
                                        {selected ? selected.name : 'Elige el tipo de espacio...'}
                                    </span>
                                </div>
                                <ChevronDown className={`w-6 h-6 text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-primary-500' : ''}`} />
                            </button>

                            {/* Dropdown Menu */}
                            {isOpen && (
                                <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-xl shadow-2xl border border-neutral-100 overflow-hidden z-20 origin-top max-h-80 overflow-y-auto">
                                    <div className="py-2">
                                        {spaceTypes.map((type) => {
                                            const Icon = type.icon;
                                            const iconColor = getIconColor(type.color);

                                            return (
                                                <button
                                                    key={type.id}
                                                    onClick={() => handleSelect(type)}
                                                    className="w-full px-6 py-4 flex items-center hover:bg-neutral-50 transition-colors group border-b border-neutral-50 last:border-0"
                                                >
                                                    <div className={`p-2 rounded-lg bg-neutral-100 mr-4 group-hover:bg-white group-hover:shadow-sm transition-all ${iconColor}`}>
                                                        <Icon className="w-6 h-6" />
                                                    </div>
                                                    <span className="text-neutral-700 font-medium text-lg group-hover:text-primary-700 transition-colors">
                                                        {type.name}
                                                    </span>
                                                    {selected?.id === type.id && (
                                                        <Check className="w-5 h-5 text-success ml-auto" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {selected && !isOpen && (
                            <div className="mt-6 text-center animate-fade-in text-neutral-500 text-sm">
                                Redirigiendo a los resultados...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SpaceTypeSelector;
