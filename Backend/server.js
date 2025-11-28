const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const authRoutes = require('./routes/auth');
const apiRoutes = require('./routes/api');
const cartRoutes = require('./routes/cart');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas públicas
app.use('/', authRoutes); // /login

// Middleware de autenticación para el resto
app.use(authMiddleware);

// Rutas protegidas
app.use('/', apiRoutes); // /cats etc.
app.use('/', cartRoutes); // /cart

app.get('/', (req, res) => {
  res.json({ message: 'eMercado Backend OK', user: req.user || null });
});

app.listen(PORT, () => {
  console.log(`Servidor eMercado escuchando en http://localhost:${PORT}`);
});
