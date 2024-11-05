import { useState } from 'react';

const AddDish = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [editIndex, setEditIndex] = useState(null); // Para controlar a edição

  const handleSubmit = (e) => {
    e.preventDefault();
    const newDish = { name, price, description, image };
    
    if (editIndex !== null) {
      // Atualizar um prato existente
      const updatedDishes = [...dishes];
      updatedDishes[editIndex] = newDish;
      setDishes(updatedDishes);
      setEditIndex(null); // Limpar o índice de edição
    } else {
      // Adicionar um novo prato
      setDishes([...dishes, newDish]);
    }

    // Limpar os campos após o envio
    setName('');
    setPrice('');
    setDescription('');
    setImage(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleEdit = (index) => {
    // Preencher o formulário com os dados do prato para edição
    const dish = dishes[index];
    setName(dish.name);
    setPrice(dish.price);
    setDescription(dish.description);
    setImage(dish.image);
    setEditIndex(index); // Definir o índice do prato que está sendo editado
  };

  const handleDelete = (index) => {
    // Remover o prato da lista
    setDishes(dishes.filter((_, i) => i !== index));
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 p-4">
      {/* Formulário de Adição de Prato */}
      <div className="bg-white p-6 rounded-lg shadow-md w-1/3">
        <h2 className="text-2xl font-bold mb-4">{editIndex !== null ? 'Editar Prato' : 'Adicionar Novo Prato'}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
              Nome do Prato
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
              Preço
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
              Descrição
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
              Imagem do Prato
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              accept="image/*"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            {editIndex !== null ? 'Salvar Alterações' : 'Adicionar Prato'}
          </button>
        </form>
      </div>

      {/* Lista de Pratos Cadastrados */}
      <div className="ml-8 w-2/3">
        <h2 className="text-2xl font-bold mb-4">Pratos Cadastrados</h2>
        {dishes.length > 0 ? (
          <ul>
            {dishes.map((dish, index) => (
              <li key={index} className="bg-white p-4 rounded-lg shadow-md mb-4 flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold">{dish.name}</h3>
                  <p className="text-gray-600">Preço: R${dish.price}</p>
                  <p className="text-gray-600">{dish.description}</p>
                  {dish.image && (
                    <img
                      src={URL.createObjectURL(dish.image)}
                      alt={dish.name}
                      className="w-16 h-16 rounded mt-2"
                    />
                  )}
                </div>
                <div>
                  <button
                    onClick={() => handleEdit(index)}
                    className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-3 rounded mr-2"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-3 rounded"
                  >
                    Excluir
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700">Nenhum prato cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default AddDish;
