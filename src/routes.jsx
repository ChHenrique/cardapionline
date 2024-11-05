
import { Routes, Route } from 'react-router-dom';
import SelectTable from './selecionarmesa/mesas';
import NaoEncontrada from './404';
import Cardapio from './cardapio/cardapio'
import AddDish from './balconista/adicionarpratos'


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SelectTable />} />
      <Route path="*" element={<NaoEncontrada />} />
      <Route path="/cardapio" element={<Cardapio />} />
      <Route path="/adicionarpratos" element={<AddDish />} />


    </Routes>
  );
}

export default AppRoutes;
