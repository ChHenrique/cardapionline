const express = require('express');
const router = express.Router();
const OrderController = require('../controllers/orderController'); // Importe o controller de pedidos

// Rota para criar um novo pedido
router.post('/', OrderController.createOrder);

// Rota para obter todos os pedidos
router.get('/', OrderController.getAllOrders);

// Rota para obter um pedido pelo ID
router.get('/:id', OrderController.getOrderById);

// Rota para atualizar o status de um pedido
router.put('/:id/status', OrderController.updateOrderStatus);

// Rota para excluir um pedido
router.delete('/:id', OrderController.deleteOrder);

module.exports = router;
