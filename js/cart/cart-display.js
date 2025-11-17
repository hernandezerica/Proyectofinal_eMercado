// ============================================
// CART-DISPLAY.JS - VISUALIZACIÓN DEL CARRITO
// ============================================
// Este módulo maneja la carga y visualización de productos
// en el carrito de compras
// Autor: Máximo Gallo
// ============================================

(function() {
  'use strict';
  
  // ============================================
  // ENTREGA 3 - Autor: Máximo Gallo
  // Función principal que carga y muestra los productos del carrito
  // ============================================
  function cargarCarrito() {
    // Obtener productos guardados en localStorage
    // Si no hay nada guardado, usamos un array vacío
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Referencias a elementos del DOM
    let container = document.getElementById('cart-items-container');
    let emptyMessage = document.getElementById('empty-cart-message');
    
    // VERIFICACIÓN: Si el carrito está vacío
    if (cartItems.length === 0) {
      // Mostrar mensaje de carrito vacío
      emptyMessage.style.display = 'block';
      // Ocultar el contenedor de productos
      container.innerHTML = '';
      // Actualizar resumen con valores en 0
      if (window.actualizarResumen) {
        window.actualizarResumen();
      }
      return;
    }
    
    // Si hay productos, ocultar el mensaje de carrito vacío
    emptyMessage.style.display = 'none';
    
    // Limpiar el contenedor antes de cargar
    container.innerHTML = '';
    
    // PASO 3: Recorrer cada producto y crear su HTML
    cartItems.forEach(function(producto, index) {
      // Crear el HTML del producto usando template literals
      let productoHTML = crearHTMLProducto(producto, index);
      // Agregar el producto al contenedor
      container.innerHTML += productoHTML;
    });
    
    // PASO 4: Agregar eventos a los botones después de crear el HTML
    if (window.agregarEventosBotones) {
      window.agregarEventosBotones();
    }
    
    // PASO 5: Calcular y mostrar el resumen (subtotal, envío, total)
    if (window.actualizarResumen) {
      window.actualizarResumen();
    }
  }
  
  // ============================================
  // ENTREGA 1 - Autor: Máximo Gallo
  // Función que crea el HTML de un producto para el carrito
  // Incluye: imagen, nombre, descripción, cantidad y botones
  // ============================================
  function crearHTMLProducto(producto, index) {
    return `
      <div class="cart-item" data-index="${index}">
        <!-- Botón para eliminar producto -->
        <button class="remove-item" data-index="${index}" aria-label="Eliminar producto">×</button>
        
        <!-- Imagen del producto -->
        <img src="${producto.image}" alt="${producto.name}" class="cart-item-image">
        
        <!-- Detalles del producto -->
        <div class="cart-item-details">
          <h3 class="cart-item-name">${producto.name}</h3>
          ${producto.description ? `<p class="cart-item-description">${producto.description}</p>` : ''}
          
          <!-- ENTREGA 1 - Precio unitario y moneda -->
          <p class="cart-item-price">${producto.currency} ${producto.cost}</p>
          
          <!-- ENTREGA 4 - Subtotal calculado (costo * cantidad) -->
          <p class="cart-item-subtotal">
            Subtotal: <strong>${producto.currency} <span class="subtotal-value">${calcularSubtotal(producto.cost, producto.quantity)}</span></strong>
          </p>
          
          <!-- ENTREGA 1 - Controles para cambiar la cantidad -->
          <div class="quantity-controls">
            <button class="quantity-btn decrease-btn" data-index="${index}" aria-label="Disminuir cantidad">−</button>
            <input type="number" class="quantity-number" data-index="${index}" value="${producto.quantity}" min="1" max="99">
            <button class="quantity-btn increase-btn" data-index="${index}" aria-label="Aumentar cantidad">+</button>
          </div>
        </div>
      </div>
    `;
  }
  
  // ============================================
  // ENTREGA 4 - Autor: Máximo Gallo
  // Función que calcula el subtotal de un producto
  // Multiplica el costo por la cantidad
  // ============================================
  function calcularSubtotal(costo, cantidad) {
    return (costo * cantidad).toFixed(2);
  }
  
  // ============================================
  // EXPOSICIÓN DE FUNCIONES AL CONTEXTO GLOBAL
  // ============================================
  window.cargarCarrito = cargarCarrito;
  window.crearHTMLProducto = crearHTMLProducto;
  window.calcularSubtotal = calcularSubtotal;
  
  // Log de inicialización
  console.log('✓ Módulo cart-display.js cargado');
  
})();
