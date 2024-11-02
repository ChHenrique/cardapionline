import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectTable from './selecionarmesa/mesas';
import NaoEncontrada from './404';
import Cardapio from './teladocardapio/cardapio'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SelectTable />} />
      <Route path="*" element={<NaoEncontrada />} />
      <Route path="/cardapio" element={<Cardapio />} />
    </Routes>
  );
}

export default AppRoutes;
