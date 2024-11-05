import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Alert from './alert'; 

function Cardapio() {
  const query = new URLSearchParams(useLocation().search);
  const tableNumber = query.get('mesa');

 
  const menuItems = [
    {
      id: 1,
      name: 'Hambúrguer',
      description: 'Hambúrguer suculento com queijo e bacon',
      price: 'R$15,00',
      image: 'https://www.estadao.com.br/resizer/v2/L3LYN5Y4MRG6BB47MNHEEXDRGA.jpeg?quality=80&auth=c4f56563b2c83e506971bce35dbc505a5ecdf7d89a70d2f2c5fbb8b0c7071e5f&width=720&height=503&smart=true',
    },
    {
      id: 2,
      name: 'Pizza Margherita',
      description: 'Pizza com molho de tomate, mussarela e manjericão',
      price: 'R$30,00',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS1ftzx-IDo-vhdpr5Al5FaTcKBPvyAbjbIQ&s',
    },
    {
      id: 3,
      name: 'Salada Caesar',
      description: 'Salada com alface, croutons e molho Caesar',
      price: 'R$18,00',
      image: 'https://img.cybercook.com.br/receitas/441/salada-caesar-2.jpeg',
    },
    {
      id: 4,
      name: 'Refrigerante',
      description: 'Refrigerante de 350ml',
      price: 'R$5,00',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSH-GuX-TnYMiIMoJhKcLI4h_FCWCLNS7cMaQ&s',
    },
  ];

  const [cart, setCart] = useState([]);
  const [alertMessage, setAlertMessage] = useState('');

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
              {menuItems.map((item) => (
                <div key={item.id} className="border-b border-gray-200 py-4 flex flex-col md:flex-row items-start">
                  <img
                    src={item.image}
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
              ))}
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
                onClick={() => {
                  showAlert('Pedido realizado com sucesso!'); // Feedback ao usuário
                }}
              >
                Fazer Pedido
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cardapio;
