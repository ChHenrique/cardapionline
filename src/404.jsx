import React from 'react';
import { Link } from 'react-router-dom';

function NaoEncontrado() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-5xl md:text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg md:text-xl font-medium text-gray-700 mb-8 text-center max-w-md">
        Oops! Parece que a página que você está procurando não existe ou foi movida.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out transform hover:scale-105 whitespace-nowrap"
      >
        Voltar para a Página Inicial
      </Link>
    </div>
  );
}

export default NaoEncontrado;
