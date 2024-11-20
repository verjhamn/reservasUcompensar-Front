import React from "react";

const SearchFilters = ({ filters, setFilters }) => {
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white shadow-md p-6 mb-6">
      <form className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Espacio Físico */}
        <div>
          <label className="block text-gray-700">Espacio Físico</label>
          <select
            name="espaciofisico"
            value={filters.espaciofisico}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Seleccionar</option>
            <option value="SEDE A">Sede A</option>
            <option value="SEDE B">Sede B</option>
            <option value="SEDE L">Sede L</option>
          </select>
        </div>

        {/* Tipo de Recurso */}
        <div>
          <label className="block text-gray-700">Tipo de Recurso</label>
          <select
            name="tiporecurso"
            value={filters.tiporecurso}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          >
            <option value="">Seleccionar</option>
            <option value="SALA DE COMPUTO">Sala de Cómputo</option>
            <option value="LABORATORIO">Laboratorio</option>
            <option value="SALON DE CLASES">Salón de Clases</option>
          </select>
        </div>

        {/* Fecha de Inicio */}
        <div>
          <label className="block text-gray-700">Fecha de Inicio</label>
          <input
            type="date"
            name="clseFechainicio"
            value={filters.clseFechainicio}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Fecha de Finalización */}
        <div>
          <label className="block text-gray-700">Fecha de Finalización</label>
          <input
            type="date"
            name="clseFechafinal"
            value={filters.clseFechafinal}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Hora de Inicio */}
        <div>
          <label className="block text-gray-700">Hora de Inicio</label>
          <input
            type="time"
            name="horainicio"
            value={filters.horainicio}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Hora de Finalización */}
        <div>
          <label className="block text-gray-700">Hora de Finalización</label>
          <input
            type="time"
            name="horafinal"
            value={filters.horafinal}
            onChange={handleChange}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm"
          />
        </div>
      </form>
    </div>
  );
};

export default SearchFilters;
