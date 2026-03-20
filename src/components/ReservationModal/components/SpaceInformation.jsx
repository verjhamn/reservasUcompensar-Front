import React from 'react';
import Carousel from '../../UtilComponents/Carousel';

const SpaceInformation = ({ spaceData, onNext }) => {
    const getImagePaths = () => {
        if (!spaceData) return [];
        return spaceData.imagenes?.map(img => img.img_path) || [];
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[400px]">
            {/* Izquierda: Fotos y Atributos Cortos */}
            <div className="lg:w-1/2 flex flex-col gap-4">
                <div className="h-48 md:h-56 w-full rounded-2xl overflow-hidden shrink-0 border border-gray-100 shadow-sm">
                    <Carousel images={getImagePaths()} />
                </div>

                <div className="grid grid-cols-2 gap-3 shrink-0">
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <h3 className="text-xs font-bold text-purple-800  tracking-widest mb-1 truncate">Código</h3>
                        <p className="text-gray-800 text-sm font-medium truncate">{spaceData.codigo}</p>
                    </div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <h3 className="text-xs font-bold text-purple-800  tracking-widest mb-1 truncate">Tipo</h3>
                        <p className="text-gray-800 text-sm font-medium truncate" title={spaceData.tipoEspecifico || spaceData.tipo}>
                            {spaceData.tipoEspecifico || spaceData.tipo}
                        </p>
                    </div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <h3 className="text-xs font-bold text-purple-800  tracking-widest mb-1 truncate">Piso</h3>
                        <p className="text-gray-800 text-sm font-medium truncate">{spaceData.piso}</p>
                    </div>
                    <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100">
                        <h3 className="text-xs font-bold text-purple-800  tracking-widest mb-1 truncate">Equipos</h3>
                        <p className="text-gray-800 text-sm font-medium truncate">{spaceData.cantidad_equipos}</p>
                    </div>
                </div>
            </div>

            {/* Derecha: Descripción HTML Completa */}
            <div className="lg:w-1/2 flex flex-col flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-[400px] lg:h-auto">
                <div className="flex-1 p-5 overflow-y-auto custom-scrollbar bg-purple-50/30">
                    <h3 className="font-bold text-purple-900 text-base mb-3 flex items-center gap-2 sticky top-0 bg-white/90 backdrop-blur-md pb-2 z-10 border-b border-purple-100">
                        Detalles y Descripción
                    </h3>
                    {spaceData.descripcion ? (
                        <div
                            className="text-gray-700 text-sm leading-relaxed space-y-2 [&_ul]:list-disc [&_ul]:pl-5 [&_p]:m-0 [&_strong]:text-purple-900 [&_strong]:font-semibold"
                            dangerouslySetInnerHTML={{ __html: spaceData.descripcion }}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm italic">
                            No hay información adicional disponible para este espacio.
                        </p>
                    )}
                </div>

                <div className="p-4 border-t border-gray-100 bg-white shrink-0 flex justify-end">
                    <button
                        onClick={onNext}
                        className="px-8 py-2.5 bg-purple-600 font-bold text-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 hover:bg-purple-700 transition-all duration-200 flex items-center justify-center gap-2 w-full lg:w-auto"
                    >
                        Continuar a Disponibilidad
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpaceInformation;
