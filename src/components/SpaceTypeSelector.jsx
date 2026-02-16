import React from 'react';
import { BookOpen, Users, Dumbbell, FlaskConical, Laptop, Building2 } from 'lucide-react';

const spaceTypes = [
    {
        id: 'study',
        name: 'Sala de Estudio',
        description: 'Espacios tranquilos para estudio individual o grupal',
        icon: BookOpen,
        color: 'purple',
        value: 'Sala de estudio',
    },
    {
        id: 'meeting',
        name: 'Sala de Reuniones',
        description: 'Espacios para reuniones y trabajo colaborativo',
        icon: Users,
        color: 'blue-light',
        value: 'Sala de reuniones',
    },
    {
        id: 'auditorium',
        name: 'Auditorio',
        description: 'Espacios para conferencias y eventos',
        icon: Building2,
        color: 'primary',
        value: 'Auditorio',
    },
    {
        id: 'sports',
        name: 'Instalación Deportiva',
        description: 'Canchas y espacios deportivos',
        icon: Dumbbell,
        color: 'turquoise',
        value: 'Cancha',
    },
    {
        id: 'lab',
        name: 'Laboratorio',
        description: 'Laboratorios de ciencias y tecnología',
        icon: FlaskConical,
        color: 'magenta',
        value: 'Laboratorio',
    },
    {
        id: 'computer',
        name: 'Sala de Cómputo',
        description: 'Equipos de cómputo disponibles',
        icon: Laptop,
        color: 'blue-dark',
        value: 'Sala de computo',
    },
];

const SpaceTypeSelector = ({ selectedType, onSelectType }) => {
    const getColorClasses = (color) => {
        const colorMap = {
            purple: {
                gradient: 'from-purple-500 to-purple-700',
                ring: 'ring-purple-500',
                hover: 'hover:ring-purple-300',
                icon: 'text-purple-500',
                badge: 'text-purple-700',
            },
            'blue-light': {
                gradient: 'from-blue-light-500 to-blue-light-700',
                ring: 'ring-blue-light-500',
                hover: 'hover:ring-blue-light-300',
                icon: 'text-blue-light-500',
                badge: 'text-blue-light-700',
            },
            primary: {
                gradient: 'from-primary-500 to-primary-700',
                ring: 'ring-primary-500',
                hover: 'hover:ring-primary-300',
                icon: 'text-primary-500',
                badge: 'text-primary-700',
            },
            turquoise: {
                gradient: 'from-turquoise-500 to-turquoise-700',
                ring: 'ring-turquoise-500',
                hover: 'hover:ring-turquoise-300',
                icon: 'text-turquoise-500',
                badge: 'text-turquoise-700',
            },
            magenta: {
                gradient: 'from-magenta-500 to-magenta-700',
                ring: 'ring-magenta-500',
                hover: 'hover:ring-magenta-300',
                icon: 'text-magenta-500',
                badge: 'text-magenta-700',
            },
            'blue-dark': {
                gradient: 'from-blue-dark-500 to-blue-dark-700',
                ring: 'ring-blue-dark-500',
                hover: 'hover:ring-blue-dark-300',
                icon: 'text-blue-dark-500',
                badge: 'text-blue-dark-700',
            },
        };
        return colorMap[color] || colorMap.purple;
    };

    return (
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">Selecciona el Tipo de Espacio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {spaceTypes.map((type) => {
                    const Icon = type.icon;
                    const colors = getColorClasses(type.color);
                    const isSelected = selectedType === type.value;

                    return (
                        <button
                            key={type.id}
                            onClick={() => onSelectType(type.value)}
                            className={`relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105 group ${isSelected
                                    ? `ring-4 ${colors.ring} ring-offset-2`
                                    : `hover:ring-2 ${colors.hover}`
                                }`}
                        >
                            {/* Gradient Header */}
                            <div className={`h-32 bg-gradient-to-br ${colors.gradient} relative`}>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-4 group-hover:scale-110 transition-transform">
                                        <Icon className="w-12 h-12 text-white" />
                                    </div>
                                </div>

                                {isSelected && (
                                    <div className={`absolute top-3 right-3 bg-white ${colors.badge} text-xs font-bold px-2 py-1 rounded-full shadow-md`}>
                                        ✓
                                    </div>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="bg-white p-4 text-left">
                                <h3 className="text-lg font-bold text-neutral-800 mb-1">
                                    {type.name}
                                </h3>
                                <p className="text-sm text-neutral-500">
                                    {type.description}
                                </p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default SpaceTypeSelector;
