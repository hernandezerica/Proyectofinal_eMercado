const express = require('express');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const DATA_DIR = path.join(__dirname, '..', 'data');
const USER_CART_DIR = path.join(DATA_DIR, 'user_cart');

if (!fs.existsSync(USER_CART_DIR)) {
  fs.mkdirSync(USER_CART_DIR, { recursive: true });
}

// Guarda items del carrito para el usuario autenticado
router.post('/cart', (req, res) => {
  const user = req.user; // agregado por middleware auth
  if (!user) {
    return res.status(401).json({ error: 'No autenticado' });
  }
  const items = req.body.items;
  if (!Array.isArray(items)) {
    return res.status(400).json({ error: 'Formato inválido, se espera items: []' });
  }
  const savePath = path.join(USER_CART_DIR, `${user.id}_posted.json`);
  try {
    fs.writeFileSync(savePath, JSON.stringify({ userId: user.id, items, savedAt: new Date().toISOString() }, null, 2));
    return res.json({ status: 'ok', message: 'Carrito guardado', file: `${user.id}_posted.json` });
  } catch (e) {
    return res.status(500).json({ error: 'Error guardando carrito', detail: e.message });
  }
});

module.exports = router;
