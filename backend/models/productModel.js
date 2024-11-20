const db = require('../config/database');

const Product = {
    getAll: (callback) => {
        db.query('SELECT * FROM products', callback);
    },
    getById: (id, callback) => {
        db.query('SELECT * FROM products WHERE id = ?', [id], (err, result) => {
            if (err) return callback(err, null);  // Retorna erro caso exista
            if (result.length === 0) {
                return callback(new Error('Produto não encontrado'), null);  // Se não encontrar o produto
            }
            callback(null, result[0]);  // Retorna o produto encontrado
        });
    },
    
    create: (data, callback) => {
        db.query('INSERT INTO products SET ?', data, callback);
    },
    update: (id, data, callback) => {
        db.query('UPDATE products SET ? WHERE id = ?', [data, id], callback);
    },
    delete: (id, callback) => {
        db.query('DELETE FROM products WHERE id = ?', [id], callback);
    },
};

module.exports = Product;
