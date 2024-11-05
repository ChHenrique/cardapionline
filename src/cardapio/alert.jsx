import React from 'react';

const Alert = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-xs w-full bg-green-500 text-white p-4 rounded-lg shadow-lg transition-all duration-300 ease-in-out">
      {message}
      <button onClick={onClose} className="ml-4 text-white font-bold">
        ×
      </button>
    </div>
  );
};

export default Alert;
