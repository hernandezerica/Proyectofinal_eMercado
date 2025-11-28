const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '..', 'data');

function sendJson(res, relativePath) {
  const fullPath = path.join(DATA_DIR, relativePath);
  if (!fs.existsSync(fullPath)) {
    return res.status(404).json({ error: 'Recurso no encontrado' });
  }
  try {
    const raw = fs.readFileSync(fullPath, 'utf8');
    const json = JSON.parse(raw);
    return res.json(json);
  } catch (e) {
    return res.status(500).json({ error: 'Error leyendo JSON', detail: e.message });
  }
}

// Categorías
router.get('/cats', (req, res) => sendJson(res, 'cats/cat.json'));

// Productos por categoría
router.get('/cats_products/:id', (req, res) => {
  const id = req.params.id;
  sendJson(res, `cats_products/${id}.json`);
});

// Información de producto
router.get('/products/:id', (req, res) => {
  const id = req.params.id;
  sendJson(res, `products/${id}.json`);
});

// Comentarios de producto
router.get('/products_comments/:id', (req, res) => {
  const id = req.params.id;
  sendJson(res, `products_comments/${id}.json`);
});

// Carrito del usuario (JSON original)
router.get('/user_cart/:userId', (req, res) => {
  const userId = req.params.userId;
  sendJson(res, `user_cart/${userId}.json`);
});

// Buy
router.get('/cart/buy.json', (req, res) => sendJson(res, 'cart/buy.json'));

// Publish
router.get('/sell/publish.json', (req, res) => sendJson(res, 'sell/publish.json'));

module.exports = router;
