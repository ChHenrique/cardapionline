const db = require('../config/database'); // Conexão com o banco de dados

const Order = {
    // Função para criar um novo pedido
    create: (order, callback) => {
        const { mesa, items } = order;
        const query = 'INSERT INTO orders (mesa) VALUES (?)';
        db.query(query, [mesa], (err, result) => {
            if (err) return callback(err);
            const orderId = result.insertId;

            // Inserir os itens do pedido
            const orderItems = items.map(item => {
                return [orderId, item.product_id, item.quantity, item.price];
            });

            const queryItems = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?';
            db.query(queryItems, [orderItems], (err) => {
                if (err) return callback(err);
                callback(null, { insertId: orderId });
            });
        });
    },

    // Função para obter todos os pedidos
    getAll: (callback) => {
        const query = 'SELECT * FROM orders';
        db.query(query, (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },

    // Função para obter um pedido específico e seus itens
    getById: (id, callback) => {
        const query = 'SELECT * FROM orders WHERE id = ?';
        db.query(query, [id], (err, results) => {
            if (err) return callback(err);

            if (results.length > 0) {
                const order = results[0];
                // Obter os itens relacionados ao pedido
                const queryItems = 'SELECT * FROM order_items WHERE order_id = ?';
                db.query(queryItems, [id], (err, items) => {
                    if (err) return callback(err);
                    order.items = items;  // Adiciona os itens ao pedido
                    callback(null, order);
                });
            } else {
                callback(null, null);  // Pedido não encontrado
            }
        });
    },

    // Função para atualizar o status de um pedido
    updateStatus: (id, status, callback) => {
        const query = 'UPDATE orders SET status = ? WHERE id = ?';
        db.query(query, [status, id], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    // Função para excluir um pedido
    delete: (id, callback) => {
        const query = 'DELETE FROM orders WHERE id = ?';
        db.query(query, [id], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    },

    // Função para obter os itens de um pedido específico
    getItemsByOrderId: (orderId, callback) => {
        const query = 'SELECT * FROM order_items WHERE order_id = ?';
        db.query(query, [orderId], (err, items) => {
            if (err) return callback(err);
            callback(null, items);
        });
    },

    // Função para atualizar um item de pedido específico
    updateItem: (orderItemId, quantity, price, callback) => {
        const query = 'UPDATE order_items SET quantity = ?, price = ? WHERE id = ?';
        db.query(query, [quantity, price, orderItemId], (err) => {
            if (err) return callback(err);
            callback(null);
        });
    }
};

module.exports = Order;
