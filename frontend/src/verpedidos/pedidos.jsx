import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar os pedidos da API
  useEffect(() => {
    axios
      .get('http://localhost:3000/api/orders') // URL da API que retorna os pedidos
      .then((response) => {
        setOrders(response.data); // Define os pedidos no estado
        setLoading(false); // Muda o estado para carregar os dados
      })
      .catch((err) => {
        setError(err.message); // Caso ocorra erro, exibe a mensagem de erro
        setLoading(false); // Muda o estado de carregamento para falso
      });
  }, []); // Executa apenas uma vez após o componente ser montado

  // Função para atualizar o status do pedido
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // Fazendo a requisição PUT para atualizar o status do pedido
      const response = await axios.put(`http://localhost:3000/api/orders/${orderId}/status`, {
        status: newStatus, // Corpo da requisição contendo o novo status
      });

      // Verificando se a resposta foi bem-sucedida
      if (response.status === 200) {
        // Atualiza o status do pedido localmente após a alteração
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err) {
      setError(err.message); // Caso ocorra erro, exibe a mensagem de erro
    }
  };

  // Função para excluir um pedido
  const handleDeleteOrder = async (orderId) => {
    try {
      // Fazendo a requisição DELETE para excluir o pedido
      const response = await axios.delete(`http://localhost:3000/api/orders/${orderId}`);

      // Verificando se a exclusão foi bem-sucedida
      if (response.status === 200) {
        // Remove o pedido da lista localmente após a exclusão
        setOrders((prevOrders) => prevOrders.filter((order) => order.id !== orderId));
      }
    } catch (err) {
      setError(err.message); // Caso ocorra erro, exibe a mensagem de erro
    }
  };

  // Função para calcular o preço total do pedido
  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  // Renderiza a tela de carregamento, erro ou a lista de pedidos
  if (loading) {
    return <div className="text-center text-xl font-semibold">Carregando pedidos...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold">Erro ao carregar pedidos: {error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-6">Lista de Pedidos</h2>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="table-auto w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">ID do Pedido</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Mesa</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Data de Criação</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Itens</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Preço Total</th>
              <th className="border px-4 py-3 text-left text-sm font-medium text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => {
              const total = calculateTotal(order.items); // Calcula o preço total do pedido
              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-3 text-sm text-gray-800">{order.id}</td>
                  <td className="border px-4 py-3 text-sm text-gray-800">{order.mesa}</td>
                  <td className="border px-4 py-3 text-sm text-gray-800 capitalize">{order.status}</td>
                  <td className="border px-4 py-3 text-sm text-gray-800">
                    {new Date(order.created_at).toLocaleString()}
                  </td>
                  <td className="border px-4 py-3 text-sm text-gray-800">
                    <ul className="space-y-1">
                      {order.items && order.items.map((item) => (
                        <li key={item.product_id} className="flex justify-between">
                          <span>
                            <strong>{item.name}</strong> - {item.quantity} x{' '}
                            <span className="text-gray-500">R${(parseFloat(item.price) || 0).toFixed(2)}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="border px-4 py-3 text-sm text-gray-800">
                    R${total.toFixed(2)} {/* Exibe o preço total formatado */}
                  </td>
                  <td className="border px-4 py-3 text-sm text-gray-800">
                    <div className="flex space-x-2">
                      {/* Dropdown para alterar o status */}
                      <select
                        className="p-2 bg-gray-100 border rounded-md"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="preparando">Preparando</option>
                        <option value="pronto">Pronto</option>
                        <option value="entregue">Entregue</option>
                      </select>

                      {/* Botão de exclusão */}
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
