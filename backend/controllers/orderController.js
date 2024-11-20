const Order = require('../models/orderModel'); // Importe o modelo de pedido
const Product = require('../models/productModel'); // Caso precise verificar produtos ao criar o pedido

module.exports = {
    // Função para criar um pedido
    createOrder: (req, res) => {
        const { mesa, items } = req.body;

        if (!mesa || !items || items.length === 0) {
            return res.status(400).json({ message: 'Mesa e itens são obrigatórios' });
        }

        // Verificar se os produtos existem ou se a quantidade é válida
        const orderItems = items.map(item => {
            return {
                product_id: item.id,
                quantity: item.quantity,
                price: item.price
            };
        });

        Order.create({ mesa, items: orderItems }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Pedido criado com sucesso', orderId: result.insertId });
        });
    },

// Função para visualizar todos os pedidos
getAllOrders: (req, res) => {
    Order.getAll((err, orders) => {
        if (err) return res.status(500).json({ error: err.message });

        // Para cada pedido, buscamos seus itens relacionados
        const ordersWithItems = orders.map(order => {
            return new Promise((resolve, reject) => {
                Order.getItemsByOrderId(order.id, (err, items) => {
                    if (err) return reject(err);

                    // Buscar o nome dos produtos e adicionar ao item
  // Buscar o nome dos produtos e adicionar ao item
const itemPromises = items.map(item => {
    return new Promise((resolveItem, rejectItem) => {
        Product.getById(item.product_id, (err, product) => {
            if (err) {
                console.error("Erro ao buscar produto:", err);  // Log de erro
                return rejectItem(err);  // Rejeita a promessa em caso de erro
            }
            if (!product) {
                item.name = 'Produto Desconhecido';  // Nome de fallback caso o produto não seja encontrado
            } else {
                item.name = product.name;  // Atribui o nome do produto
                item.price = parseFloat(item.price); // Garantir que o preço seja um número
            }
            resolveItem(item);  // Resolve a promessa após definir o nome
        });
    });
});


                    // Aguardar todas as promessas dos itens
                    Promise.all(itemPromises)
                        .then(() => {
                            order.items = items; // Adiciona os itens ao pedido com o nome
                            resolve(order);
                        })
                        .catch(reject);
                });
            });
        });

        // Aguardar todas as promessas e retornar a resposta
        Promise.all(ordersWithItems)
            .then(orders => res.json(orders))
            .catch(err => res.status(500).json({ error: err.message }));
    });
},




    // Função para visualizar um pedido específico pelo ID
// Função para visualizar um pedido específico pelo ID
getOrderById: (req, res) => {
    const { id } = req.params;
    Order.getById(id, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Pedido não encontrado' });

        const order = results[0];
        // Obter os itens do pedido
        Order.getItemsByOrderId(id, (err, items) => {
            if (err) return res.status(500).json({ error: err.message });

            // Buscar o nome dos produtos para cada item
            const itemPromises = items.map(item => {
                return new Promise((resolveItem, rejectItem) => {
                    Product.getById(item.product_id, (err, product) => {
                        if (err) return rejectItem(err);
                        item.name = product.name; // Adiciona o nome do produto ao item
                        item.price = parseFloat(item.price); // Garantir que o preço seja um número
                        resolveItem(item);
                    });
                });
            });

            // Aguardar todas as promessas dos itens
            Promise.all(itemPromises)
                .then(() => {
                    order.items = items;  // Adiciona os itens ao pedido com o nome
                    res.json(order);
                })
                .catch(err => res.status(500).json({ error: err.message }));
        });
    });
},


    // Função para atualizar o status do pedido
    updateOrderStatus: (req, res) => {
        const { id } = req.params;
        const { status } = req.body; // Status pode ser 'pendente', 'preparando', 'pronto', 'entregue', etc.

        if (!status) {
            return res.status(400).json({ message: 'Status é obrigatório' });
        }

        Order.updateStatus(id, status, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Status do pedido atualizado com sucesso' });
        });
    },

    // Função para excluir um pedido
    deleteOrder: (req, res) => {
        const { id } = req.params;
        Order.delete(id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Pedido excluído com sucesso' });
        });
    },
};
