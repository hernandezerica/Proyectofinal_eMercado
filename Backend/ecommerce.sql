-- Creación de la base de datos
CREATE DATABASE IF NOT EXISTS ecommerce;
USE ecommerce;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE categories (
  id INT PRIMARY KEY,
  name VARCHAR(100),
  description TEXT,
  productCount INT
);

CREATE TABLE products (
  id INT PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  cost DECIMAL(10,2),
  currency VARCHAR(10),
  soldCount INT,
  image VARCHAR(255),
  category_id INT,
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT,
  user_id INT,
  score INT,
  description TEXT,
  dateTime DATETIME,
  FOREIGN KEY (product_id) REFERENCES products(id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  product_id INT,
  count INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total_cost DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
