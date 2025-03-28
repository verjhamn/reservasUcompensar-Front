import React from "react";

const InfoTab = ({ spaceData, setActiveTab }) => (
  <div className="space-y-6">
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="w-full md:w-2/3">
        <img
          src={spaceData.image}
          alt={spaceData.nombre}
          className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
        />
      </div>
      <div className="w-full max-h-80 md:w-1/3 grid grid-cols-2 md:grid-cols-1 gap-4 overflow-y-auto">
        {["codigo", "tipo", "piso", "cantidad_equipos"].map((key, index) => (
          <div key={index} className="min-w-0">
            <h3 className="font-semibold text-gray-700 text-lg truncate">{key}</h3>
            <p className="text-gray-600 text-base truncate">{spaceData[key]}</p>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-gray-100 p-4 rounded-lg">
      <h3 className="font-semibold text-gray-700 text-lg mb-3">Información Adicional</h3>
      <p className="text-gray-600 text-base">
        {spaceData.descripcion || "Sin observaciones adicionales."}
      </p>
    </div>

    <div className="flex justify-end mt-4">
      <button onClick={() => setActiveTab("availability")} className="px-6 py-3 bg-turquesa text-white rounded-lg hover:bg-turquesa/90 transition">
        Siguiente
      </button>
    </div>
  </div>
);

export default InfoTab;
