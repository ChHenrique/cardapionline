const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // Adicionando rotas de pedidos
const path = require('path'); // Necessário para manipular caminhos

const app = express();
app.use(bodyParser.json());

const cors = require('cors');

// Configuração do CORS
const corsOptions = {
    origin: "http://localhost:5173", // Permitir apenas esse domínio (ou use '*' para permitir todas as origens)
    methods: "GET,POST,PUT,DELETE", // Métodos permitidos
    allowedHeaders: "Content-Type", // Cabeçalhos permitidos
};

app.use(cors(corsOptions)); // Ativa o CORS com as opções configuradas

// Configuração para servir a pasta 'uploads' como estática
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

// Rotas da API
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes); // Rota para pedidos

module.exports = app;
