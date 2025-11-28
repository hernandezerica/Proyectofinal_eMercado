# eMercado Backend (Entrega 8)

Backend en Node.js + Express para servir los JSON del proyecto, autenticación JWT y endpoint de carrito (Desafíate).

## Requisitos
- Node.js 18+
- (Opcional) MySQL si se desea implementar la BD del desafíate

## Instalación
```bash
cd Backend
npm install
```

## Variables de entorno
Editar `.env` si se desea cambiar el secreto o el puerto.
```
PORT=3000
JWT_SECRET=supersecretkey
TOKEN_EXPIRY=1h
```

## Ejecución
```bash
npm run start    # producción simple
npm run dev      # con recarga (nodemon)
```

## Autenticación
Login: `POST /login` body ejemplo:
```json
{ "email": "user@example.com", "password": "123456" }
```
Respuesta:
```json
{ "token": "<JWT>", "user": {"id":1, "email":"user@example.com"} }
```
Usar header: `Authorization: Bearer <JWT>` en llamadas posteriores.

## Endpoints protegidos
- `GET /cats`
- `GET /cats_products/:id`
- `GET /products/:id`
- `GET /products_comments/:id`
- `GET /user_cart/:userId`
- `GET /cart/buy.json`
- `GET /sell/publish.json`
- `POST /cart` (guarda items del carrito)

## Guardar carrito
`POST /cart` body:
```json
{ "items": [ {"product_id":101, "count":2} ] }
```
Guarda archivo: `data/user_cart/<userId>_posted.json`.

## Base de datos (Desafíate)
Script en `ecommerce.sql`. Crear la BD y luego adaptar el código del backend para leer/escribir MySQL (no incluido por simplicidad).

## Integración Frontend
Modificar `js/init.js` reemplazando URLs por `http://localhost:3000/...`.

## MER
Ver diagrama en Acta Documental. Tablas: users, categories, products, comments, cart_items, orders.

## Próximos pasos
- Persistir usuarios y login en BD.
- Reemplazar archivos JSON por queries SQL.
- Manejo de errores y validaciones avanzadas.
