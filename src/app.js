require('dotenv').config();
const express = require('express');
// Importaremos as rotas aqui em breve
const userRoutes = require('./routes/userRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware para que o Express entenda requisições com corpo em JSON
app.use(express.json());

// Definindo o prefixo da rota conforme o escopo do projeto
app.use('/v1/user', userRoutes);
app.use('/v1/category', categoryRoutes);
app.use('/v1/product', productRoutes);

module.exports = app;
