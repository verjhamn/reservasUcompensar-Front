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
        <label className="block text-xs md:text-sm font-medium text-neutral-600 mb-1.5">
          {label}
        </label>
        <div className="relative">
          <select
            value={value}
            onChange={handleChange}
            className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 appearance-none text-gray-700 font-medium cursor-pointer hover:border-purple-300"
          >
            <option value="">{placeholder}</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-xs md:text-sm font-medium text-neutral-600 mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-gray-700 font-medium placeholder-gray-400 focus:placeholder-gray-300 hover:border-purple-300"
      />
    </div>
  );
};

export default FilterField;
