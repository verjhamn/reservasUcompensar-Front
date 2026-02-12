import React from 'react';
import Carousel from '../../UtilComponents/Carousel';

const SpaceInformation = ({ spaceData, onNext }) => {
    const getImagePaths = () => {
        if (!spaceData) return [];
        return spaceData.imagenes?.map(img => img.img_path) || [];
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-6 md:flex-row">
                <div className="w-full md:w-2/3 h-64 md:h-80">
                    <Carousel images={getImagePaths()} />
                </div>
                <div className="w-full max-h-80 md:w-1/3 grid grid-cols-2 md:grid-cols-1 gap-4 overflow-y-auto">
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 text-lg truncate">Código</h3>
                        <p className="text-gray-600 text-base truncate">{spaceData.codigo}</p>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 text-lg truncate">Tipo</h3>
                        <p className="text-gray-600 text-base truncate">
                            {spaceData.tipo}
                            {spaceData.tipoEspecifico && spaceData.tipoEspecifico !== spaceData.tipo && (
                                <span className="text-gray-500"> - {spaceData.tipoEspecifico}</span>
                            )}
                        </p>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 text-lg truncate">Piso</h3>
                        <p className="text-gray-600 text-base truncate">{spaceData.piso}</p>
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-semibold text-gray-700 text-lg truncate">Equipos</h3>
                        <p className="text-gray-600 text-base truncate">{spaceData.cantidad_equipos}</p>
                    </div>
                </div>
            </div>

            <div className="bg-gris-sutil p-4 md:p-6 rounded-lg">
                <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
                <p className="text-gray-600 text-base">
                    {spaceData.descripcion || "Sin observaciones adicionales."}
                </p>
            </div>

            <div className="flex justify-end mt-4">
                <button
                    onClick={onNext}
                    className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition flex items-center gap-2"
                >
                    Siguiente
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a 1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default SpaceInformation;
