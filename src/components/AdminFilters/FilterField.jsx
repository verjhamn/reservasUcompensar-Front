import React from "react";

const FilterField = ({ label, name, value, onChange, type = "text", placeholder = "", options = [] }) => {
  const baseClasses = "w-full p-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-turquesa focus:border-turquesa";

  const renderField = () => {
    if (type === "select") {
      return (
        <select
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          className={baseClasses}
        >
          <option value="">{placeholder || "Todos"}</option>
          {options.map((option, index) => {
            // Verificar si la opción es un objeto con value y label
            if (typeof option === 'object' && 'value' in option && 'label' in option) {
              return (
                <option key={index} value={option.value}>
                  {option.label}
                </option>
              );
            }
            // Si es un valor simple (string o número)
            return (
              <option key={index} value={option}>
                {option}
              </option>
            );
          })}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className={baseClasses}
      />
    );
  };

  return (
    <div>
      <label className="block text-gray-700 mb-1">{label}</label>
      {renderField()}
    </div>
  );
};

export default FilterField;
