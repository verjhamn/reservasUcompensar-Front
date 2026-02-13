import React from 'react';

const ColorSwatch = ({ color, label, isBase }) => (
    <div className="relative">
        <div className={`${color} h-20 rounded-lg flex items-center justify-center font-semibold text-sm shadow-md hover:scale-105 transition-transform ${isBase ? 'ring-2 ring-offset-1' : ''}`}>
            <span className={label.includes('50') || label.includes('100') || label.includes('200') || label.includes('300') ? 'text-neutral-900' : 'text-white'}>
                {label}
            </span>
            {isBase && (
                <span className="absolute top-1 right-1 text-xs bg-white/20 px-1 rounded text-white">
                    BASE
                </span>
            )}
        </div>
    </div>
);

const ColorPaletteDemo = () => {
    return (
        <div className="p-6 bg-white">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-600 mb-2">
                    Paleta de Colores Institucional UCompensar
                </h1>
                <p className="text-neutral-600">
                    Sistema de diseño basado en la identidad oficial de UCompensar
                </p>
            </div>

            {/* Naranja - Principal 1 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Naranja (Principal 1)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color principal #1 de UCompensar</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-primary-50" label="50" />
                    <ColorSwatch color="bg-primary-100" label="100" />
                    <ColorSwatch color="bg-primary-200" label="200" />
                    <ColorSwatch color="bg-primary-300" label="300" />
                    <ColorSwatch color="bg-primary-400" label="400" />
                    <ColorSwatch color="bg-primary-500" label="500" isBase />
                    <ColorSwatch color="bg-primary-600" label="600" />
                    <ColorSwatch color="bg-primary-700" label="700" />
                    <ColorSwatch color="bg-primary-800" label="800" />
                    <ColorSwatch color="bg-primary-900" label="900" />
                </div>
            </div>

            {/* Morado - Principal 2 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Morado (Principal 2)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color principal #2 de UCompensar</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-purple-50" label="50" />
                    <ColorSwatch color="bg-purple-100" label="100" />
                    <ColorSwatch color="bg-purple-200" label="200" />
                    <ColorSwatch color="bg-purple-300" label="300" />
                    <ColorSwatch color="bg-purple-400" label="400" />
                    <ColorSwatch color="bg-purple-500" label="500" isBase />
                    <ColorSwatch color="bg-purple-600" label="600" />
                    <ColorSwatch color="bg-purple-700" label="700" />
                    <ColorSwatch color="bg-purple-800" label="800" />
                    <ColorSwatch color="bg-purple-900" label="900" />
                </div>
            </div>

            {/* Magenta - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Magenta (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-magenta-50" label="50" />
                    <ColorSwatch color="bg-magenta-100" label="100" />
                    <ColorSwatch color="bg-magenta-200" label="200" />
                    <ColorSwatch color="bg-magenta-300" label="300" />
                    <ColorSwatch color="bg-magenta-400" label="400" />
                    <ColorSwatch color="bg-magenta-500" label="500" isBase />
                    <ColorSwatch color="bg-magenta-600" label="600" />
                    <ColorSwatch color="bg-magenta-700" label="700" />
                    <ColorSwatch color="bg-magenta-800" label="800" />
                    <ColorSwatch color="bg-magenta-900" label="900" />
                </div>
            </div>

            {/* Amarillo - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Amarillo (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-yellow-50" label="50" />
                    <ColorSwatch color="bg-yellow-100" label="100" />
                    <ColorSwatch color="bg-yellow-200" label="200" />
                    <ColorSwatch color="bg-yellow-300" label="300" />
                    <ColorSwatch color="bg-yellow-400" label="400" />
                    <ColorSwatch color="bg-yellow-500" label="500" isBase />
                    <ColorSwatch color="bg-yellow-600" label="600" />
                    <ColorSwatch color="bg-yellow-700" label="700" />
                    <ColorSwatch color="bg-yellow-800" label="800" />
                    <ColorSwatch color="bg-yellow-900" label="900" />
                </div>
            </div>

            {/* Azul Claro - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Azul Claro (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-blue-light-50" label="50" />
                    <ColorSwatch color="bg-blue-light-100" label="100" />
                    <ColorSwatch color="bg-blue-light-200" label="200" />
                    <ColorSwatch color="bg-blue-light-300" label="300" />
                    <ColorSwatch color="bg-blue-light-400" label="400" />
                    <ColorSwatch color="bg-blue-light-500" label="500" isBase />
                    <ColorSwatch color="bg-blue-light-600" label="600" />
                    <ColorSwatch color="bg-blue-light-700" label="700" />
                    <ColorSwatch color="bg-blue-light-800" label="800" />
                    <ColorSwatch color="bg-blue-light-900" label="900" />
                </div>
            </div>

            {/* Azul Oscuro - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Azul Oscuro (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-blue-dark-50" label="50" />
                    <ColorSwatch color="bg-blue-dark-100" label="100" />
                    <ColorSwatch color="bg-blue-dark-200" label="200" />
                    <ColorSwatch color="bg-blue-dark-300" label="300" />
                    <ColorSwatch color="bg-blue-dark-400" label="400" />
                    <ColorSwatch color="bg-blue-dark-500" label="500" isBase />
                    <ColorSwatch color="bg-blue-dark-600" label="600" />
                    <ColorSwatch color="bg-blue-dark-700" label="700" />
                    <ColorSwatch color="bg-blue-dark-800" label="800" />
                    <ColorSwatch color="bg-blue-dark-900" label="900" />
                </div>
            </div>

            {/* Turquesa - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Turquesa (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-turquoise-50" label="50" />
                    <ColorSwatch color="bg-turquoise-100" label="100" />
                    <ColorSwatch color="bg-turquoise-200" label="200" />
                    <ColorSwatch color="bg-turquoise-300" label="300" />
                    <ColorSwatch color="bg-turquoise-400" label="400" />
                    <ColorSwatch color="bg-turquoise-500" label="500" isBase />
                    <ColorSwatch color="bg-turquoise-600" label="600" />
                    <ColorSwatch color="bg-turquoise-700" label="700" />
                    <ColorSwatch color="bg-turquoise-800" label="800" />
                    <ColorSwatch color="bg-turquoise-900" label="900" />
                </div>
            </div>

            {/* Verde Lima - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Verde Lima (Secundario)</h2>
                <p className="text-sm text-neutral-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-lime-50" label="50" />
                    <ColorSwatch color="bg-lime-100" label="100" />
                    <ColorSwatch color="bg-lime-200" label="200" />
                    <ColorSwatch color="bg-lime-300" label="300" />
                    <ColorSwatch color="bg-lime-400" label="400" />
                    <ColorSwatch color="bg-lime-500" label="500" isBase />
                    <ColorSwatch color="bg-lime-600" label="600" />
                    <ColorSwatch color="bg-lime-700" label="700" />
                    <ColorSwatch color="bg-lime-800" label="800" />
                    <ColorSwatch color="bg-lime-900" label="900" />
                </div>
            </div>

            {/* Verde - Secundario */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Verde (Secundario)</h2>
                <p className="text-sm text-neural-500 mb-3">Color secundario complementario</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-green-50" label="50" />
                    <ColorSwatch color="bg-green-100" label="100" />
                    <ColorSwatch color="bg-green-200" label="200" />
                    <ColorSwatch color="bg-green-300" label="300" />
                    <ColorSwatch color="bg-green-400" label="400" />
                    <ColorSwatch color="bg-green-500" label="500" isBase />
                    <ColorSwatch color="bg-green-600" label="600" />
                    <ColorSwatch color="bg-green-700" label="700" />
                    <ColorSwatch color="bg-green-800" label="800" />
                    <ColorSwatch color="bg-green-900" label="900" />
                </div>
            </div>

            {/* Neutral */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-1">Neutral (Grises)</h2>
                <p className="text-sm text-neutral-500 mb-3">Colores neutros para fondos y texto</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
                    <ColorSwatch color="bg-neutral-50" label="50" />
                    <ColorSwatch color="bg-neutral-100" label="100" />
                    <ColorSwatch color="bg-neutral-200" label="200" />
                    <ColorSwatch color="bg-neutral-300" label="300" />
                    <ColorSwatch color="bg-neutral-400" label="400" />
                    <ColorSwatch color="bg-neutral-500" label="500" isBase />
                    <ColorSwatch color="bg-neutral-600" label="600" />
                    <ColorSwatch color="bg-neutral-700" label="700" />
                    <ColorSwatch color="bg-neutral-800" label="800" />
                    <ColorSwatch color="bg-neutral-900" label="900" />
                </div>
            </div>

            {/* Semantic Colors */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neural-800 mb-4">
                    Colores Semánticos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="bg-success text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Success
                    </div>
                    <div className="bg-success-light text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Success Light
                    </div>
                    <div className="bg-success-dark text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Success Dark
                    </div>
                    <div className="bg-warning text-neutral-900 h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Warning
                    </div>
                    <div className="bg-warning-light text-neutral-900 h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Warning Light
                    </div>
                    <div className="bg-warning-dark text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Warning Dark
                    </div>
                    <div className="bg-error text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Error
                    </div>
                    <div className="bg-error-light text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Error Light
                    </div>
                    <div className="bg-error-dark text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Error Dark
                    </div>
                    <div className="bg-info text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Info
                    </div>
                    <div className="bg-info-light text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Info Light
                    </div>
                    <div className="bg-info-dark text-white h-16 rounded-lg flex items-center justify-center font-medium text-sm shadow-md">
                        Info Dark
                    </div>
                </div>
            </div>

            {/* Examples */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                    Ejemplos de Uso
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border border-neutral-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Botón Naranja (Principal)</h3>
                        <button className="w-full bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Reservar Espacio
                        </button>
                    </div>
                    <div className="p-4 border border-neutral-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Botón Morado (Principal)</h3>
                        <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Ver Detalles
                        </button>
                    </div>
                    <div className="p-4 border border-neutral-200 rounded-lg">
                        <h3 className="text-sm font-semibold text-neutral-700 mb-3">Botón Magenta</h3>
                        <button className="w-full bg-magenta-500 hover:bg-magenta-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors">
                            Acción Destacada
                        </button>
                    </div>
                </div>
            </div>

            {/* Typography */}
            <div>
                <h2 className="text-xl font-semibold text-neutral-800 mb-4">
                    Tipografía
                </h2>
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-primary-600">Título Naranja</h1>
                    <h2 className="text-3xl font-semibold text-purple-600">Subtítulo Morado</h2>
                    <h3 className="text-2xl font-medium text-magenta-600">Encabezado Magenta</h3>
                    <p className="text-base text-neutral-700">Texto normal</p>
                    <p className="text-sm text-neutral-500">Texto secundario</p>
                </div>
            </div>
        </div>
    );
};

export default ColorPaletteDemo;
