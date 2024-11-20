import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from './alert';

function Cardapio() {
  const query = new URLSearchParams(useLocation().search);
  const tableNumber = query.get('mesa');  // Obtém o número da mesa da URL

  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');
  const [orderDetails, setOrderDetails] = useState(null);  // Para armazenar os detalhes do pedido

  useEffect(() => {
    // Função para buscar os itens do cardápio
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/products');
        
        // Verifica se a resposta não é 200 (erro)
        if (!response.ok) {
          throw new Error(`Erro HTTP: ${response.status}`);
        }

        const textResponse = await response.text(); // Pega a resposta como texto
        console.log(textResponse);  // Exibe a resposta no console
        
        const data = JSON.parse(textResponse);  // Tenta fazer o parsing manual
        setMenuItems(data);
      } catch (error) {
        console.error('Erro ao buscar os itens do cardápio:', error);
        showAlert('Erro ao carregar o cardápio.');
      }
    };

    fetchMenuItems();
  }, []); // O efeito será executado uma vez ao carregar o componente

  const addToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      existingItem.quantity += 1;
      setCart([...cart]);
    } else {
      setCart((prevCart) => [...prevCart, { ...item, quantity: 1 }]);
    }
    showAlert(`${item.name} adicionado ao carrinho!`);
  };

  const removeFromCart = (itemToRemove) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== itemToRemove.id));
    showAlert(`${itemToRemove.name} removido do carrinho!`);
  };

  const updateQuantity = (item, delta) => {
    setCart((prevCart) => 
      prevCart.map(cartItem => {
        if (cartItem.id === item.id) {
          const newQuantity = cartItem.quantity + delta;
          return { ...cartItem, quantity: Math.max(newQuantity, 1) }; 
        }
        return cartItem;
      })
    );
  };

  const showAlert = (message) => {
    setAlertMessage(message);
    setTimeout(() => setAlertMessage(''), 3000);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      const price = parseFloat(item.price.replace('R$', '').replace(',', '.'));
      return total + price * item.quantity;
    }, 0).toFixed(2);
  };

  const handleOrderSubmit = async () => {
    if (cart.length === 0) {
      showAlert('Seu carrinho está vazio.');
      return;
    }
  
    // Preparando os dados no formato correto
    const orderData = {
      mesa: parseInt(tableNumber),  // Garantindo que a mesa seja um número inteiro
      items: cart.map((cartItem) => ({
        id: cartItem.id,
        quantity: cartItem.quantity,
        price: parseFloat(cartItem.price.replace('R$', '').replace(',', '.'))  // Garantindo que o preço seja um número
      }))
    };
  
    console.log('Dados do pedido enviados:', orderData);  // Exibindo os dados no console para debug
  
    try {
      const response = await fetch('http://localhost:3000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),  // Enviando os dados no formato JSON
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao fazer o pedido: ${response.status}`);
      }
  
      const result = await response.json();
      showAlert('Pedido realizado com sucesso!');  // Exibe a mensagem de sucesso
  
      // Armazenando os detalhes do pedido
      setOrderDetails(result.order);  // Salva o pedido realizado no estado
  
      // Limpa o carrinho após o pedido
      setCart([]);
    } catch (error) {
      console.error('Erro ao enviar o pedido:', error);
      showAlert('Erro ao realizar o pedido.');
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-gray-100 p-6">
      <div className="flex flex-col items-center w-full max-w-4xl">
        {alertMessage && <Alert message={alertMessage} onClose={() => setAlertMessage('')} />}
        
        <div className="flex flex-col md:flex-row w-full">
          <div className="flex-1 mb-6 md:mr-6">
            <h1 className="text-3xl font-bold mb-4 text-center">
              Cardápio - Mesa {tableNumber || 'Desconhecida'}
            </h1>
            <div className="w-full bg-white rounded-lg shadow-lg p-4">
              {menuItems.length === 0 ? (
                <p className="text-gray-600">Carregando cardápio...</p>
              ) : (
                menuItems.map((item) => (
                  <div key={item.id} className="border-b border-gray-200 py-4 flex flex-col md:flex-row items-start">
                    <img
                      src={`http://localhost:3000/${item.image}`}
                      alt={item.name}
                      className="w-full h-32 md:w-24 md:h-24 rounded-lg mr-0 md:mr-4 object-cover"
                    />
                    <div className="flex-1 mt-2 md:mt-0">
                      <h2 className="text-xl font-semibold">{item.name}</h2>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="text-green-600 font-semibold mt-1">{item.price}</p>
                      <button
                        onClick={() => addToCart(item)}
                        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      >
                        Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4">
            <h2 className="text-xl font-bold mb-4">Carrinho</h2>
            <ul>
              {cart.length === 0 ? (
                <li className="text-gray-600">O carrinho está vazio.</li>
              ) : (
                cart.map((cartItem, index) => (
                  <li key={index} className="flex justify-between items-center py-2">
                    <span>{`${cartItem.name} ${cartItem.quantity}x`}</span>
                    <div className="flex items-center">
                      <span className="mx-2 cursor-pointer" onClick={() => updateQuantity(cartItem, -1)}>&lt;</span>
                      <span>{cartItem.quantity}</span>
                      <span className="mx-2 cursor-pointer" onClick={() => updateQuantity(cartItem, 1)}>&gt;</span>
                      <span>{`R$${(parseFloat(cartItem.price.replace('R$', '').replace(',', '.')) * cartItem.quantity).toFixed(2)}`}</span>
                      <button
                        onClick={() => removeFromCart(cartItem)}
                        className="ml-4 text-red-500 hover:text-red-700"
                      >
                        Remover
                      </button>
                    </div>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t border-gray-200 mt-4 pt-2">
              <h3 className="text-lg font-semibold">Total: R${getTotalPrice()}</h3>
              <button
                className="mt-4 w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                onClick={handleOrderSubmit}
              >
                Fazer Pedido
              </button>
            </div>
          </div>

          {/* Se houver um pedido, exibe o pedido da mesa */}
          {orderDetails && (
            <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg p-4 mt-6 md:mt-0">
              <h2 className="text-xl font-bold mb-4">Pedido Realizado</h2>
              <ul>
                {orderDetails.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center py-2">
                    <span>{`${item.name} ${item.quantity}x`}</span>
                    <span>{`R$${(item.price * item.quantity).toFixed(2)}`}</span>
                  </li>
                ))}
              </ul>
              <div className="border-t border-gray-200 mt-4 pt-2">
                <h3 className="text-lg font-semibold">Total: R${orderDetails.total.toFixed(2)}</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Cardapio;
