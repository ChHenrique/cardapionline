const Product = require('../models/productModel');
const path = require('path');

module.exports = {
    getAllProducts: (req, res) => {
        Product.getAll((err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json(results);
        });
    },
    getProductById: (req, res) => {
        const { id } = req.params;
        Product.getById(id, (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            if (results.length === 0) return res.status(404).json({ message: 'Produto não encontrado' });
            res.json(results[0]);
        });
    },
    createProduct: (req, res) => {
        const { name, description, price } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : null;
    
        if (!name || !price) {
            return res.status(400).json({ message: 'Nome e preço são obrigatórios' });
        }
    
        Product.create({ name, description, price, image }, (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ id: result.insertId, name, description, price, image });
        });
    },
    
    updateProduct: (req, res) => {
        const { id } = req.params;
        const { name, description, price } = req.body;

        // Verificar se há uma nova imagem
        const image = req.file ? req.file.path : null;

        Product.update(id, { name, description, price, image }, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Produto atualizado com sucesso' });
        });
    },
    deleteProduct: (req, res) => {
        const { id } = req.params;
        Product.delete(id, (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Produto excluído com sucesso' });
        });
    },
};
