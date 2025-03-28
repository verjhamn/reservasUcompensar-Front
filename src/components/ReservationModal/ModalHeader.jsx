import React from "react";

const ModalHeader = ({ title, onClose }) => (
  <div className="flex justify-between items-start mb-6">
    <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
    <button
      onClick={onClose}
      className="text-gray-500 hover:text-gray-700 transition-colors"
    >
      <svg className="w-6 h-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
        <path d="M6 18L18 6M6 6l12 12"></path>
      </svg>
    </button>
  </div>
);

export default ModalHeader;
