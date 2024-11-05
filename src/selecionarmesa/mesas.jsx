import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SelectTable() {
  const [selectedTable, setSelectedTable] = useState(null);
  const navigate = useNavigate();

  const handleTableSelect = (tableNumber) => {
    setSelectedTable(tableNumber);
  };

  const goToMenu = () => {
    if (selectedTable) {
      navigate(`/cardapio?mesa=${selectedTable}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white p-4 md:p-6">
      <div className="mb-2 text-gray-500 text-sm text-center">
        Feito com ❤ por Claudio Henrique 
      </div>
      <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6 text-center w-full max-w-lg">
        <h1 className="text-4xl font-bold text-gray-800">Bem-vindo ao nosso Restaurante!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Estamos felizes em tê-lo conosco! Selecione uma mesa para começar a sua experiência gastronômica.
        </p>
      </div>
      
      <h2 className="text-3xl font-semibold mb-4 text-center text-gray-800">Selecione a sua Mesa</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 w-full max-w-5xl">
        {[1, 2, 3, 4].map((tableNumber) => (
          <button
            key={tableNumber}
            onClick={() => handleTableSelect(tableNumber)}
            className={`flex flex-col items-center p-6 text-white font-semibold rounded-lg shadow-md transition w-full 
              ${selectedTable === tableNumber ? 'bg-green-500 transform scale-105' : 'bg-blue-500 hover:bg-blue-600'} 
              focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50`}
          >
            <span className="text-2xl">Mesa {tableNumber}</span>
            <span className="mt-2 text-sm">Clique para selecionar</span>
          </button>
        ))}
      </div>
      {selectedTable && (
        <div className="flex flex-col items-center mt-8">
          <p className="text-lg font-medium text-gray-700">Mesa selecionada: <strong>{selectedTable}</strong></p>
          <button
            onClick={goToMenu}
            className="mt-4 px-8 py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition"
          >
            Ir para o Cardápio
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectTable;
