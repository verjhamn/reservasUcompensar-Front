import React from 'react';

const FilterField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder = "", 
  options = [] 
}) => {
  const handleChange = (e) => {
    onChange(name, e.target.value);
  };

  if (type === "select") {
    return (
      <div className="w-full">
        <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={value}
          onChange={handleChange}
          className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent"
        >
          <option value="">{placeholder}</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-2 md:px-3 py-1.5 md:py-2 text-sm md:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-turquesa focus:border-transparent"
      />
    </div>
  );
};

export default FilterField;
