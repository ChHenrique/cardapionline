import { useState, useEffect } from "react";

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [image, setImage] = useState(null);
  const [editId, setEditId] = useState(null);

  // Fetch produtos na inicialização
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/products");
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      const data = await response.json();
      setProducts(data); // Atualiza a lista com os produtos
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Usando FormData para enviar os dados do formulário, incluindo imagem
    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);

    // Verifica se uma imagem foi selecionada e a adiciona ao FormData
    if (image) {
      data.append("image", image);
    }

    try {
      // URL de criação ou atualização do produto
      const url = editId
        ? `http://localhost:3000/api/products/${editId}` // Para editar
        : "http://localhost:3000/api/products"; // Para criar
      const method = editId ? "PUT" : "POST";

      // Enviando o FormData como corpo da requisição
      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (!response.ok) {
        throw new Error("Erro ao salvar produto");
      }

      // Atualiza a lista de produtos após a requisição
      fetchProducts();
      setFormData({ name: "", description: "", price: "" });
      setImage(null); // Reseta a imagem
      setEditId(null); // Limpa o ID de edição
    } catch (error) {
      console.error("Erro ao salvar produto:", error);
    }
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setImage(null); // Limpa a imagem para upload
    setEditId(product.id); // Armazena o ID do produto que está sendo editado
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/products/${id}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error("Erro ao excluir produto");
      }
      fetchProducts(); // Atualiza a lista de produtos após a exclusão
    } catch (error) {
      console.error("Erro ao excluir produto:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Gerenciamento de Produtos
      </h1>

      {/* Formulário */}
      <form
        className="bg-white p-8 rounded-lg shadow-md mb-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">
          {editId ? "Editar Produto" : "Novo Produto"}
        </h2>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Nome
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="description">
            Descrição
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="4"
          ></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="price">
            Preço
          </label>
          <input
            type="number"
            id="price"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2" htmlFor="image">
            Imagem
          </label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700"
        >
          {editId ? "Atualizar Produto" : "Adicionar Produto"}
        </button>
      </form>

      {/* Lista de Produtos */}
      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Lista de Produtos</h2>
        {products.length === 0 ? (
          <p className="text-gray-600">Nenhum produto encontrado.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">Nome</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">Descrição</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">Preço</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">Imagem</th>
                  <th className="px-4 py-2 text-sm font-medium text-gray-600">Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b">
                    <td className="px-4 py-2 text-sm text-gray-800">{product.name}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">{product.description}</td>
                    <td className="px-4 py-2 text-sm text-gray-800">R$ {product.price}</td>
                    <td className="px-4 py-2">
                      {product.image && (
                        <img
                          src={`http://localhost:3000/${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-800">
                      <button
                        onClick={() => handleEdit(product)}
                        className="px-4 py-2 bg-yellow-400 text-white rounded-md mr-2 hover:bg-yellow-500"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                      >
                        Excluir
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductManagement;
