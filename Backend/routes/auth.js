const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

const users = [
  { id: 1, email: 'user@example.com', password: '123456', first_name: 'Demo', last_name: 'User' },
  { id: 2, email: 'maximo@example.com', password: '123456', first_name: 'Maximo', last_name: 'Gallo' }
];

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y password requeridos' });
  }
  const found = users.find(u => u.email === email && u.password === password);
  if (!found) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }
  const payload = { id: found.id, email: found.email };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPIRY || '1h' });
  return res.json({ token, user: { id: found.id, email: found.email, first_name: found.first_name, last_name: found.last_name } });
});

module.exports = router;
