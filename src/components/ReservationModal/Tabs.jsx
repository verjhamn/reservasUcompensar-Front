import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => (
  <div className="border-b mb-6">
    <button
      onClick={() => setActiveTab("info")}
      className={`py-2 px-4 ${activeTab === "info"
        ? "border-b-2 border-turquesa font-bold text-turquesa"
        : "text-gray-600 hover:text-gray-800"
      }`}
    >
      Información
    </button>
    <button
      onClick={() => setActiveTab("availability")}
      className={`py-2 px-4 ${activeTab === "availability"
        ? "border-b-2 border-turquesa font-bold text-turquesa"
        : "text-gray-600 hover:text-gray-800"
      }`}
    >
      Disponibilidad
    </button>
  </div>
);

export default Tabs;
