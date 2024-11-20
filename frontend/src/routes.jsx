import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SelectTable from './selecionarmesa/mesas';
import NaoEncontrada from './404';
import Cardapio from './teladocardapio/cardapio'
import OrderManagement from './criarprodutos/criarprodutos'
import OrdersList from './verpedidos/pedidos'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SelectTable />} />
      <Route path="*" element={<NaoEncontrada />} />
      <Route path="/cardapio" element={<Cardapio />} />
      <Route path="/criarproduto" element={<OrderManagement />} />
      <Route path="/pedidos" element={<OrdersList />} />
    </Routes>
  );
}

export default AppRoutes;
